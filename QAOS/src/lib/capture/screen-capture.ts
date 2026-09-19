// Pure screen-capture helpers built entirely on native browser APIs — no React, no server, no
// external libraries. The captured frame/video never leaves the device: everything here runs
// against getDisplayMedia()/MediaRecorder and hands back a plain Blob for the caller to use.

const PREFERRED_RECORDING_MIME_TYPES = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];

function assertDisplayMediaSupported(): void {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getDisplayMedia) {
    throw new Error("Screen capture isn't supported in this browser.");
  }
}

/** getDisplayMedia() rejects (usually with NotAllowedError) when the user dismisses the native
 * share picker instead of picking a source — normalize that into one friendly message. */
async function requestDisplayStream(constraints: DisplayMediaStreamOptions): Promise<MediaStream> {
  assertDisplayMediaSupported();
  try {
    return await navigator.mediaDevices.getDisplayMedia(constraints);
  } catch {
    throw new Error("Screen capture was cancelled.");
  }
}

/** Resolves once the given video element has a real frame ready to read (videoWidth/height can
 * briefly report 0 immediately after play() resolves). */
function waitForVideoFrame(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= video.HAVE_CURRENT_DATA && video.videoWidth > 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    video.addEventListener(
      "loadeddata",
      () => {
        resolve();
      },
      { once: true }
    );
  });
}

/** Captures a single screenshot of a user-chosen tab/window/screen. Grabs exactly one frame, then
 * immediately stops the capture so the browser's "sharing" indicator doesn't linger afterward. */
export async function captureScreenshot(): Promise<Blob> {
  const stream = await requestDisplayStream({ video: true });

  try {
    const video = document.createElement("video");
    video.muted = true;
    video.srcObject = stream;
    await video.play();
    await waitForVideoFrame(video);

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not create a canvas context to capture the screenshot.");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("Failed to create the screenshot image.");
    return blob;
  } finally {
    // Always release the capture, whether we succeeded, threw, or the caller's promise chain
    // never awaits us again — a single screenshot must never leave the share indicator active.
    stream.getTracks().forEach((track) => track.stop());
  }
}

export interface ScreenRecordingHandle {
  /** The live capture stream. Its video track's `onended` fires if the user stops sharing via the
   * browser's own native control rather than this app's Stop button — attach a listener to it to
   * detect that and finalize the recording the same way a manual stop would. */
  stream: MediaStream;
  /** Stops recording (and the underlying tracks) and resolves with the assembled video Blob. Safe
   * to call more than once, and safe to call after an external "stop sharing" already ended the
   * stream — both resolve to the same result. */
  stop: () => Promise<Blob>;
}

function pickSupportedMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  return PREFERRED_RECORDING_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
}

/** Starts recording a user-chosen tab/window/screen (video only, no audio, kept simple for v1). */
export async function startScreenRecording(): Promise<ScreenRecordingHandle> {
  const stream = await requestDisplayStream({ video: true, audio: false });

  const mimeType = pickSupportedMimeType();
  const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
  const chunks: BlobPart[] = [];

  recorder.ondataavailable = (event: BlobEvent) => {
    if (event.data.size > 0) chunks.push(event.data);
  };

  recorder.start();

  let finalizePromise: Promise<Blob> | null = null;

  function finalize(): Promise<Blob> {
    if (finalizePromise) return finalizePromise;
    finalizePromise = new Promise<Blob>((resolve) => {
      const resolveWithChunks = () => resolve(new Blob(chunks, { type: mimeType ?? "video/webm" }));
      if (recorder.state === "inactive") {
        resolveWithChunks();
        return;
      }
      recorder.addEventListener("stop", resolveWithChunks, { once: true });
      try {
        recorder.stop();
      } catch {
        // Already stopping — e.g. the track ended on its own via the browser's native "Stop
        // sharing" control — the "stop" listener above still fires once that completes.
      }
    });
    return finalizePromise;
  }

  async function stop(): Promise<Blob> {
    stream.getTracks().forEach((track) => track.stop());
    return finalize();
  }

  return { stream, stop };
}

/** mm:ss (or hh:mm:ss past an hour) for the recording's elapsed time. */
export function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0 ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

/** Triggers a browser "Save As" download for a captured Blob (screenshot or recording). */
export function downloadCapture(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

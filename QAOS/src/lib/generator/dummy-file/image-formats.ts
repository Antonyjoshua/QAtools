import { randomBytes } from "./text-formats";

function formatBytesShort(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
  return `${bytes} B`;
}

function drawBaseImage(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 480;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#2E6FFF");
  gradient.addColorStop(1, "#22D3EE");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText("QA Dummy Test Image", 24, 140);
  ctx.font = "16px sans-serif";
  ctx.fillText(new Date().toISOString(), 24, 170);

  return canvas;
}

async function canvasToBytes(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Uint8Array> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("canvas.toBlob returned null"))),
      mime,
      quality
    );
  });
  return new Uint8Array(await blob.arrayBuffer());
}

/**
 * Real, viewable PNG/JPEG images padded to an exact byte size by appending raw bytes after the
 * image's natural end marker. Browsers and standard OS/image viewers stop reading at the image's
 * own end-of-data marker (IEND for PNG, EOI for JPEG) and ignore anything appended after it — a
 * long-standing, widely-relied-on technique — so the image still opens and previews normally.
 * Some very strict/spec-pedantic validators may reject the trailing bytes; that trade-off is
 * documented in the UI rather than hidden.
 */
export async function generateImage(format: "png" | "jpg", targetBytes: number): Promise<Uint8Array> {
  const canvas = drawBaseImage();
  const mime = format === "png" ? "image/png" : "image/jpeg";
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.font = "16px sans-serif";
    ctx.fillText(`Target size: ${formatBytesShort(targetBytes)}`, 24, 195);
  }

  const base = await canvasToBytes(canvas, mime, format === "jpg" ? 0.9 : undefined);
  if (base.length >= targetBytes) return base;

  const padding = randomBytes(targetBytes - base.length);
  const out = new Uint8Array(targetBytes);
  out.set(base, 0);
  out.set(padding, base.length);
  return out;
}

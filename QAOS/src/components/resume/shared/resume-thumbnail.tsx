import { ResumeRenderer, PAGE_SIZE_PX } from "./resume-renderer";
import type { Resume } from "@/lib/resume/types";

/** A live, scaled-down render of an actual resume — clipped to a fixed card size. */
export function ResumeThumbnail({
  resume,
  photoUrl,
  frameWidth = 220,
  frameHeight = 300,
}: {
  resume: Resume;
  photoUrl?: string | null;
  frameWidth?: number;
  frameHeight?: number;
}) {
  const page = PAGE_SIZE_PX[resume.layout.pageSize];
  const scale = frameWidth / page.width;

  return (
    <div style={{ width: frameWidth, height: frameHeight, overflow: "hidden", position: "relative", background: resume.theme.backgroundColor }}>
      <ResumeRenderer resume={resume} photoUrl={photoUrl} scale={scale} />
    </div>
  );
}

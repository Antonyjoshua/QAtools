import { ResumeRenderer, PAGE_SIZE_PX } from "./resume-renderer";
import { buildSampleResume } from "@/lib/resume/sample-data";
import type { ResumeTemplate } from "@/lib/resume/types";

/** A live, scaled-down render of the template with sample content — clipped to a fixed card size. */
export function TemplateThumbnail({ template, frameWidth = 220, frameHeight = 300 }: { template: ResumeTemplate; frameWidth?: number; frameHeight?: number }) {
  const sample = buildSampleResume(template);
  const page = PAGE_SIZE_PX[template.layout.pageSize];
  const scale = frameWidth / page.width;

  return (
    <div style={{ width: frameWidth, height: frameHeight, overflow: "hidden", position: "relative", background: sample.theme.backgroundColor }}>
      <ResumeRenderer resume={sample} scale={scale} />
    </div>
  );
}

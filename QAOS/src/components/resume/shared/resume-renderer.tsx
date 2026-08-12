import { SectionRenderer, HEADER_ZONE_TYPES } from "./section-renderer";
import type { Resume } from "@/lib/resume/types";

export const PAGE_SIZE_PX: Record<"a4" | "letter", { width: number; height: number }> = {
  a4: { width: 794, height: 1123 },
  letter: { width: 816, height: 1056 },
};

function HeaderZone({ resume, photoUrl }: { resume: Resume; photoUrl?: string | null }) {
  const { theme, layout } = resume;
  const headerSections = resume.sections.filter((s) => (HEADER_ZONE_TYPES as readonly string[]).includes(s.type) && s.visible);
  const photo = headerSections.find((s) => s.type === "photo");
  const nameTitle = headerSections.filter((s) => s.type !== "photo");
  if (headerSections.length === 0) return null;

  const nameTitleCol = (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, textAlign: layout.headerLayout === "stacked" ? "center" : theme.alignment }}>
      {nameTitle.map((s) => (
        <SectionRenderer key={s.id} section={s} theme={layout.headerLayout === "banner" ? { ...theme, primaryColor: "#ffffff", accentColor: "#e5e7eb" } : theme} photoUrl={photoUrl} />
      ))}
    </div>
  );

  if (layout.headerLayout === "banner") {
    return (
      <div
        style={{
          background: theme.primaryColor,
          margin: `-${theme.pageMargin}px -${theme.pageMargin}px ${theme.sectionSpacing}px`,
          padding: `${theme.pageMargin * 0.8}px ${theme.pageMargin}px`,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        {photo && <SectionRenderer section={photo} theme={theme} photoUrl={photoUrl} />}
        {nameTitleCol}
      </div>
    );
  }

  if (layout.headerLayout === "split") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, marginBottom: theme.sectionSpacing }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {photo && <SectionRenderer section={photo} theme={theme} photoUrl={photoUrl} />}
          {nameTitleCol}
        </div>
      </div>
    );
  }

  // stacked
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: theme.sectionSpacing }}>
      {photo && <SectionRenderer section={photo} theme={theme} photoUrl={photoUrl} />}
      {nameTitleCol}
    </div>
  );
}

export function ResumeRenderer({
  resume,
  photoUrl,
  scale = 1,
  pageRef,
}: {
  resume: Resume;
  photoUrl?: string | null;
  scale?: number;
  pageRef?: React.Ref<HTMLDivElement>;
}) {
  const { theme, layout, sections } = resume;
  const page = PAGE_SIZE_PX[layout.pageSize];

  const bodySections = sections.filter((s) => !(HEADER_ZONE_TYPES as readonly string[]).includes(s.type) && s.visible);
  const col0 = bodySections.filter((s) => layout.columns === 1 || s.column === 0).sort((a, b) => a.order - b.order);
  const col1 = layout.columns === 2 ? bodySections.filter((s) => s.column === 1).sort((a, b) => a.order - b.order) : [];

  return (
    <div
      ref={pageRef}
      style={{
        width: page.width,
        minHeight: page.height,
        background: theme.backgroundColor,
        color: theme.textColor,
        padding: theme.pageMargin,
        boxSizing: "border-box",
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        fontFamily: theme.bodyFont,
      }}
      data-resume-page
    >
      <HeaderZone resume={resume} photoUrl={photoUrl} />

      {layout.columns === 2 ? (
        <div style={{ display: "flex", gap: theme.pageMargin * 0.8 }}>
          <div style={{ flex: layout.columnRatio }}>
            {col0.map((s) => (
              <SectionRenderer key={s.id} section={s} theme={theme} />
            ))}
          </div>
          <div style={{ flex: 1 - layout.columnRatio, borderLeft: theme.borders ? `1px solid ${theme.accentColor}33` : undefined, paddingLeft: theme.borders ? theme.pageMargin * 0.5 : 0 }}>
            {col1.map((s) => (
              <SectionRenderer key={s.id} section={s} theme={theme} photoUrl={photoUrl} />
            ))}
          </div>
        </div>
      ) : (
        <div>
          {col0.map((s) => (
            <SectionRenderer key={s.id} section={s} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
}

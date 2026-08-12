import type { ResumeTheme, SectionData } from "@/lib/resume/types";

type ExperienceData = Extract<SectionData, { type: "experience" }>;
type EducationData = Extract<SectionData, { type: "education" }>;
type ProjectsData = Extract<SectionData, { type: "projects" }>;

function formatRange(start: string, end: string, current: boolean): string {
  if (!start && !end && !current) return "";
  return `${start || "—"} – ${current ? "Present" : end || "—"}`;
}

function Bullets({ bullets, theme }: { bullets: string[]; theme: ResumeTheme }) {
  const nonEmpty = bullets.filter(Boolean);
  if (nonEmpty.length === 0) return null;
  return (
    <ul style={{ margin: "4px 0 0", paddingLeft: 16, display: "flex", flexDirection: "column", gap: 2 }}>
      {nonEmpty.map((b, i) => (
        <li key={i} style={{ fontSize: theme.fontSize - 1, color: theme.textColor, lineHeight: 1.45 }}>
          {b}
        </li>
      ))}
    </ul>
  );
}

export function ExperienceBlock({ data, theme }: { data: ExperienceData; theme: ResumeTheme }) {
  if (data.items.length === 0) return <p style={{ color: theme.mutedColor, fontSize: theme.fontSize - 1, margin: 0 }}>—</p>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {data.items.map((item) => (
        <div key={item.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: theme.headingFont, fontWeight: 600, color: theme.textColor, fontSize: theme.fontSize }}>
              {item.role || "Role"} {item.company && <span style={{ color: theme.accentColor }}>· {item.company}</span>}
            </span>
            <span style={{ fontSize: theme.fontSize - 2, color: theme.mutedColor, whiteSpace: "nowrap" }}>
              {formatRange(item.startDate, item.endDate, item.current)}
            </span>
          </div>
          {item.location && <p style={{ margin: "1px 0 0", fontSize: theme.fontSize - 2, color: theme.mutedColor }}>{item.location}</p>}
          <Bullets bullets={item.bullets} theme={theme} />
        </div>
      ))}
    </div>
  );
}

export function EducationBlock({ data, theme }: { data: EducationData; theme: ResumeTheme }) {
  if (data.items.length === 0) return <p style={{ color: theme.mutedColor, fontSize: theme.fontSize - 1, margin: 0 }}>—</p>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.items.map((item) => (
        <div key={item.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: theme.headingFont, fontWeight: 600, color: theme.textColor, fontSize: theme.fontSize }}>
              {item.degree || "Degree"} {item.field && `in ${item.field}`}
            </span>
            <span style={{ fontSize: theme.fontSize - 2, color: theme.mutedColor, whiteSpace: "nowrap" }}>
              {formatRange(item.startDate, item.endDate, false)}
            </span>
          </div>
          <p style={{ margin: "1px 0 0", fontSize: theme.fontSize - 1, color: theme.accentColor }}>
            {item.school}
            {item.gpa && <span style={{ color: theme.mutedColor }}> · GPA {item.gpa}</span>}
          </p>
        </div>
      ))}
    </div>
  );
}

export function ProjectsBlock({ data, theme }: { data: ProjectsData; theme: ResumeTheme }) {
  if (data.items.length === 0) return <p style={{ color: theme.mutedColor, fontSize: theme.fontSize - 1, margin: 0 }}>—</p>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.items.map((item) => (
        <div key={item.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: theme.headingFont, fontWeight: 600, color: theme.textColor, fontSize: theme.fontSize }}>{item.name || "Project"}</span>
            {item.link && <span style={{ fontSize: theme.fontSize - 2, color: theme.accentColor }}>{item.link}</span>}
          </div>
          {item.description && <p style={{ margin: "1px 0 0", fontSize: theme.fontSize - 1, color: theme.textColor }}>{item.description}</p>}
          <Bullets bullets={item.bullets} theme={theme} />
        </div>
      ))}
    </div>
  );
}

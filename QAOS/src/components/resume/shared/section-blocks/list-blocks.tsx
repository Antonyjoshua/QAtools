import type { ResumeTheme, SectionData } from "@/lib/resume/types";

type SkillsData = Extract<SectionData, { type: "skills" | "technicalSkills" | "softSkills" }>;
type LanguagesData = Extract<SectionData, { type: "languages" }>;
type InterestsData = Extract<SectionData, { type: "interests" }>;

export function SkillsBlock({ data, theme }: { data: SkillsData; theme: ResumeTheme }) {
  if (data.items.length === 0) return <p style={{ color: theme.mutedColor, fontSize: theme.fontSize - 1, margin: 0 }}>—</p>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {data.items.map((item) => (
        <span
          key={item.id}
          style={{
            fontFamily: theme.bodyFont,
            fontSize: theme.fontSize - 2,
            color: theme.primaryColor,
            background: theme.accentColor + "1a",
            border: theme.borders ? `1px solid ${theme.accentColor}55` : undefined,
            borderRadius: 5,
            padding: "3px 8px",
          }}
        >
          {item.name}
        </span>
      ))}
    </div>
  );
}

export function LanguagesBlock({ data, theme }: { data: LanguagesData; theme: ResumeTheme }) {
  if (data.items.length === 0) return <p style={{ color: theme.mutedColor, fontSize: theme.fontSize - 1, margin: 0 }}>—</p>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {data.items.map((item) => (
        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: theme.fontSize - 1, color: theme.textColor }}>
          <span>{item.name}</span>
          <span style={{ color: theme.mutedColor }}>{item.level}</span>
        </div>
      ))}
    </div>
  );
}

export function InterestsBlock({ data, theme }: { data: InterestsData; theme: ResumeTheme }) {
  if (data.items.length === 0) return <p style={{ color: theme.mutedColor, fontSize: theme.fontSize - 1, margin: 0 }}>—</p>;
  return (
    <p style={{ fontSize: theme.fontSize - 1, color: theme.textColor, margin: 0 }}>{data.items.join(" · ")}</p>
  );
}

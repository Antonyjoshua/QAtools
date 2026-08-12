import type { ResumeTheme, SectionData } from "@/lib/resume/types";

type CustomData = Extract<SectionData, { type: "custom" }>;

export function CustomBlock({ data, theme }: { data: CustomData; theme: ResumeTheme }) {
  if (!data.text.trim()) return <p style={{ color: theme.mutedColor, fontSize: theme.fontSize - 1, margin: 0 }}>—</p>;
  return (
    <p style={{ fontFamily: theme.bodyFont, color: theme.textColor, fontSize: theme.fontSize - 1, lineHeight: 1.5, margin: 0, whiteSpace: "pre-wrap" }}>
      {data.text}
    </p>
  );
}

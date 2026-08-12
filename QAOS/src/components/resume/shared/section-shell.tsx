import { SECTION_ICONS } from "@/lib/resume/section-icons";
import type { ResumeSectionInstance, ResumeTheme } from "@/lib/resume/types";

export function SectionShell({
  section,
  theme,
  children,
}: {
  section: ResumeSectionInstance;
  theme: ResumeTheme;
  children: React.ReactNode;
}) {
  const Icon = SECTION_ICONS[section.type];
  return (
    <div style={{ marginBottom: theme.sectionSpacing }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 8,
          borderBottom: theme.dividers ? `1px solid ${theme.accentColor}55` : undefined,
          paddingBottom: theme.dividers ? 4 : 0,
        }}
      >
        {section.showIcon && <Icon size={13} color={theme.primaryColor} strokeWidth={2.25} />}
        <h3
          style={{
            fontFamily: theme.headingFont,
            color: theme.primaryColor,
            fontSize: theme.fontSize + 2,
            fontWeight: 700,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          {section.title}
        </h3>
      </div>
      {children}
    </div>
  );
}

import type { ResumeTheme, SectionData } from "@/lib/resume/types";

type CertificationsData = Extract<SectionData, { type: "certifications" }>;
type AwardsData = Extract<SectionData, { type: "awards" }>;
type PublicationsData = Extract<SectionData, { type: "publications" }>;
type ReferencesData = Extract<SectionData, { type: "references" }>;

function Empty({ theme }: { theme: ResumeTheme }) {
  return <p style={{ color: theme.mutedColor, fontSize: theme.fontSize - 1, margin: 0 }}>—</p>;
}

function Row({ title, meta, sub, theme }: { title: string; meta?: string; sub?: string; theme: ResumeTheme }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontFamily: theme.headingFont, fontWeight: 600, color: theme.textColor, fontSize: theme.fontSize - 1 }}>{title}</span>
        {meta && <span style={{ fontSize: theme.fontSize - 2, color: theme.mutedColor, whiteSpace: "nowrap" }}>{meta}</span>}
      </div>
      {sub && <p style={{ margin: "1px 0 0", fontSize: theme.fontSize - 2, color: theme.mutedColor }}>{sub}</p>}
    </div>
  );
}

export function CertificationsBlock({ data, theme }: { data: CertificationsData; theme: ResumeTheme }) {
  if (data.items.length === 0) return <Empty theme={theme} />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.items.map((item) => (
        <Row key={item.id} title={item.name || "Certification"} meta={item.date} sub={item.issuer} theme={theme} />
      ))}
    </div>
  );
}

export function AwardsBlock({ data, theme }: { data: AwardsData; theme: ResumeTheme }) {
  if (data.items.length === 0) return <Empty theme={theme} />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.items.map((item) => (
        <Row key={item.id} title={item.title || "Award"} meta={item.date} sub={[item.issuer, item.description].filter(Boolean).join(" — ")} theme={theme} />
      ))}
    </div>
  );
}

export function PublicationsBlock({ data, theme }: { data: PublicationsData; theme: ResumeTheme }) {
  if (data.items.length === 0) return <Empty theme={theme} />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.items.map((item) => (
        <Row key={item.id} title={item.title || "Publication"} meta={item.date} sub={item.publisher} theme={theme} />
      ))}
    </div>
  );
}

export function ReferencesBlock({ data, theme }: { data: ReferencesData; theme: ResumeTheme }) {
  if (data.items.length === 0) return <Empty theme={theme} />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.items.map((item) => (
        <Row key={item.id} title={item.name || "Reference"} sub={[item.relation, item.contact].filter(Boolean).join(" · ")} theme={theme} />
      ))}
    </div>
  );
}

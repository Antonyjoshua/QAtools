import { Mail, Phone, MapPin, Globe } from "lucide-react";
import type { ResumeTheme, SectionData } from "@/lib/resume/types";

type NameData = Extract<SectionData, { type: "name" }>;
type PhotoData = Extract<SectionData, { type: "photo" }>;
type TitleData = Extract<SectionData, { type: "title" }>;
type SummaryData = Extract<SectionData, { type: "summary" }>;
type ContactData = Extract<SectionData, { type: "contact" }>;
type SocialData = Extract<SectionData, { type: "social" }>;

export function NameBlock({ data, theme }: { data: NameData; theme: ResumeTheme }) {
  return (
    <h1
      style={{
        fontFamily: theme.headingFont,
        color: theme.primaryColor,
        fontSize: theme.fontSize + 15,
        fontWeight: 700,
        margin: 0,
        textAlign: theme.alignment,
      }}
    >
      {data.fullName || "Your Name"}
    </h1>
  );
}

export function TitleBlock({ data, theme }: { data: TitleData; theme: ResumeTheme }) {
  return (
    <p
      style={{
        fontFamily: theme.bodyFont,
        color: theme.accentColor,
        fontSize: theme.fontSize + 3,
        fontWeight: 500,
        margin: "2px 0 0",
        textAlign: theme.alignment,
      }}
    >
      {data.text || "Professional Title"}
    </p>
  );
}

export function PhotoBlock({ data, theme, photoUrl }: { data: PhotoData; theme: ResumeTheme; photoUrl?: string | null }) {
  const size = 92;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: data.shape === "circle" ? "50%" : 10,
        overflow: "hidden",
        background: theme.mutedColor + "33",
        border: `2px solid ${theme.accentColor}`,
        flexShrink: 0,
      }}
    >
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : null}
    </div>
  );
}

export function SummaryBlock({ data, theme }: { data: SummaryData; theme: ResumeTheme }) {
  return (
    <p style={{ fontFamily: theme.bodyFont, color: theme.textColor, fontSize: theme.fontSize, lineHeight: 1.5, margin: 0, whiteSpace: "pre-wrap" }}>
      {data.text || "A short professional summary goes here."}
    </p>
  );
}

export function ContactBlock({ data, theme }: { data: ContactData; theme: ResumeTheme }) {
  const rows = [
    { icon: Mail, value: data.email },
    { icon: Phone, value: data.phone },
    { icon: MapPin, value: data.location },
    { icon: Globe, value: data.website },
  ].filter((r) => r.value);
  if (rows.length === 0) return <p style={{ color: theme.mutedColor, fontSize: theme.fontSize - 1, margin: 0 }}>—</p>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: theme.fontSize - 1, color: theme.textColor }}>
          <r.icon size={12} color={theme.mutedColor} />
          <span>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export function SocialBlock({ data, theme }: { data: SocialData; theme: ResumeTheme }) {
  if (data.links.length === 0) return <p style={{ color: theme.mutedColor, fontSize: theme.fontSize - 1, margin: 0 }}>—</p>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {data.links.map((l) => (
        <div key={l.id} style={{ fontSize: theme.fontSize - 1 }}>
          <span style={{ color: theme.mutedColor }}>{l.label}: </span>
          <span style={{ color: theme.accentColor }}>{l.url}</span>
        </div>
      ))}
    </div>
  );
}

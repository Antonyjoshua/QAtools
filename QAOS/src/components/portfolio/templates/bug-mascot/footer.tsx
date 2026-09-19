"use client";

import { usePortfolioContent } from "../shared/portfolio-content-context";
import { useAttachmentUrl } from "@/lib/portfolio/hooks/use-attachment-url";
import { GithubIcon, LinkedinIcon } from "../shared/social-icons";

export function Footer() {
  const { profile } = usePortfolioContent();
  const resumeUrl = useAttachmentUrl(profile.resumeAttachmentId);

  interface FooterLink {
    href: string;
    label: string;
    icon?: string;
    Icon?: typeof LinkedinIcon;
    download?: boolean;
  }

  const rawLinks: (FooterLink | null)[] = [
    profile.email ? { href: `mailto:${profile.email}`, label: profile.email, icon: "✉" } : null,
    profile.phone ? { href: `tel:${profile.phone.replace(/\s/g, "")}`, label: profile.phone, icon: "📞" } : null,
    profile.linkedin ? { href: profile.linkedin, label: "LinkedIn", Icon: LinkedinIcon } : null,
    profile.github ? { href: profile.github, label: "GitHub", Icon: GithubIcon } : null,
    resumeUrl ? { href: resumeUrl, label: "Resume", icon: "⬇", download: true } : null,
  ];
  const links = rawLinks.filter((l): l is FooterLink => l !== null);

  return (
    <footer id="contact" className="border-t py-14" style={{ borderColor: "var(--border)", background: "var(--bg2)" }}>
      <div className="mx-auto flex max-w-[1100px] flex-col gap-8 px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="font-mono-jb text-xl font-bold" style={{ color: "var(--text)" }}>
              {profile.name
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")}
              <span className="accent">.</span>
            </span>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              {profile.role} {profile.location ? `· ${profile.location}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-5">
            {links.map((l) => (
              <a key={l.label} href={l.href} download={l.download} target={l.download ? undefined : "_blank"} rel="noopener noreferrer" className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                {l.Icon ? <l.Icon size={16} /> : <span>{l.icon}</span>}
                <span>{l.label}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t pt-6 text-sm" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>·</span>
          <span>{profile.role}</span>
        </div>
      </div>
    </footer>
  );
}

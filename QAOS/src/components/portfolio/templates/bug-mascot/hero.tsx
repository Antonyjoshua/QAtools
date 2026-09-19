"use client";

import { useEffect, useState } from "react";
import { usePortfolioContent } from "../shared/portfolio-content-context";
import { useAttachmentUrl } from "@/lib/portfolio/hooks/use-attachment-url";
import { BugIllustration } from "./bug-illustration";

export function Hero() {
  const { profile, stats, skills } = usePortfolioContent();
  const photoUrl = useAttachmentUrl(profile.photoAttachmentId);
  const resumeUrl = useAttachmentUrl(profile.resumeAttachmentId);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const roles = [profile.role, "Bug Hunter", "Automation Engineer"].filter(Boolean);
  const [roleIdx, setRoleIdx] = useState(0);
  const chips = skills.flatMap((g) => g.items).slice(0, 7);

  useEffect(() => {
    const target = roles[roleIdx % roles.length] ?? "";
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting) {
      if (displayed.length < target.length) {
        timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 70);
      } else {
        timeout = setTimeout(() => setDeleting(true), 2400);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- advances the typewriter loop to the next role
        setDeleting(false);
        setRoleIdx((i) => (i + 1) % roles.length);
      }
    }
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayed, deleting, roleIdx]);

  return (
    <section id="hero" className="relative flex min-h-screen items-center pt-24 pb-16">
      <div className="mx-auto w-full max-w-[1100px] px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-3">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt={profile.name} className="h-14 w-14 rounded-full object-cover" style={{ border: "2px solid rgba(108,99,255,0.45)", boxShadow: "0 0 14px rgba(108,99,255,0.22)" }} />
              ) : null}
              <p style={{ color: "var(--text-muted)" }}>Hi, I&apos;m</p>
            </div>
            <h1 className="text-5xl leading-tight font-extrabold sm:text-6xl" style={{ color: "var(--text)" }}>
              {profile.name.split(" ").slice(0, -1).join(" ")} <span className="accent">{profile.name.split(" ").slice(-1)}</span>
            </h1>
            <div className="mt-3 flex items-center text-xl" style={{ color: "var(--text-muted)" }}>
              <span>I&apos;m a&nbsp;</span>
              <span className="font-semibold" style={{ color: "var(--accent2)" }}>
                {displayed}
              </span>
              <span className="ml-0.5 animate-pulse" style={{ color: "var(--accent2)" }}>
                |
              </span>
            </div>
            <p className="mt-5 max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {profile.tagline}
            </p>
            {chips.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <span key={c} className="chip">
                    {c}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} className="btn btn-primary">
                View My Work
              </button>
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="btn btn-outline">
                Contact Me
              </button>
              {resumeUrl && (
                <a href={resumeUrl} download target="_blank" rel="noopener noreferrer" className="btn btn-download">
                  Download Resume
                </a>
              )}
            </div>
            {stats.length > 0 && (
              <div className="mt-9 flex flex-wrap items-center gap-6">
                {stats.slice(0, 4).map((s) => (
                  <div key={s.id} className="flex flex-col">
                    <span className="stat-num">
                      {s.value}
                      {s.suffix}
                    </span>
                    <span className="stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex w-full items-center justify-center overflow-visible">
              <BugIllustration />
            </div>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
              <span className="mr-1">⬆</span> hover any part
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

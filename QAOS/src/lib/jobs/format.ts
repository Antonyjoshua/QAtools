import type { Job } from "./types";

export function formatRelativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

export function formatExperience(job: Pick<Job, "experienceMinYears" | "experienceMaxYears">): string {
  if (job.experienceMaxYears === null) return `${job.experienceMinYears}+ yrs`;
  if (job.experienceMinYears === job.experienceMaxYears) return `${job.experienceMinYears} yrs`;
  return `${job.experienceMinYears}–${job.experienceMaxYears} yrs`;
}

export function formatSalary(job: Pick<Job, "salaryMin" | "salaryMax" | "currency" | "salaryPeriod">): string | null {
  if (!job.salaryMin && !job.salaryMax) return null;
  const currency = job.currency ?? "INR";
  const fmt = (n: number) => {
    if (currency === "INR") {
      if (n >= 100000) return `${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
      return n.toLocaleString("en-IN");
    }
    if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
    return n.toString();
  };
  const symbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : `${currency} `;
  const period = job.salaryPeriod === "month" ? "/mo" : "/yr";
  if (job.salaryMin && job.salaryMax && job.salaryMin !== job.salaryMax) {
    return `${symbol}${fmt(job.salaryMin)} – ${symbol}${fmt(job.salaryMax)}${period}`;
  }
  const value = job.salaryMin ?? job.salaryMax ?? 0;
  return `${symbol}${fmt(value)}${period}`;
}

export function formatLocation(job: Pick<Job, "city" | "state" | "country" | "remoteStatus">): string {
  if (job.remoteStatus === "REMOTE_WORLDWIDE") return "Remote — Worldwide";
  if (job.remoteStatus === "REMOTE_REGION") return "Remote — Asia/Regional";
  if (job.remoteStatus === "REMOTE_INDIA" && !job.city) return "Remote — India";
  const parts = [job.city, job.state].filter(Boolean);
  const base = parts.length > 0 ? parts.join(", ") : job.country;
  if (job.remoteStatus === "REMOTE_INDIA") return `Remote — ${base}`;
  if (job.remoteStatus === "HYBRID") return `Hybrid — ${base}`;
  return base;
}

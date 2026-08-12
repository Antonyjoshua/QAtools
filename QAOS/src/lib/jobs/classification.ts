import type { EmploymentType, JobLevel, QACategory, RemoteStatus, ReviewReason } from "./types";

// -----------------------------------------------------------------------------
// Real, working rule-based classification — this is the engine that would run
// on every ingested job (seeded or, later, live-fetched) to derive the fields
// the spec asks for. It's intentionally rule-based rather than ML-based: cheap,
// deterministic, explainable, and good enough for keyword-shaped QA job text.
// The future-AI service interfaces (ai-services.ts) describe where a smarter
// classifier could slot in later without changing callers.
// -----------------------------------------------------------------------------

const TECHNOLOGY_PATTERNS: { name: string; pattern: RegExp }[] = [
  { name: "Playwright", pattern: /\bplaywright\b/i },
  { name: "Selenium", pattern: /\bselenium\b/i },
  { name: "Cypress", pattern: /\bcypress\b/i },
  { name: "Appium", pattern: /\bappium\b/i },
  { name: "Postman", pattern: /\bpostman\b/i },
  { name: "REST Assured", pattern: /\brest[\s-]?assured\b/i },
  { name: "Java", pattern: /\bjava\b(?!script)/i },
  { name: "Python", pattern: /\bpython\b/i },
  { name: "JavaScript", pattern: /\bjavascript\b/i },
  { name: "TypeScript", pattern: /\btypescript\b/i },
  { name: "C#", pattern: /\bc#\b/i },
  { name: "SQL", pattern: /\bsql\b/i },
  { name: "JMeter", pattern: /\bjmeter\b/i },
  { name: "k6", pattern: /\bk6\b/i },
  { name: "Jenkins", pattern: /\bjenkins\b/i },
  { name: "GitHub Actions", pattern: /\bgithub actions\b/i },
  { name: "Azure DevOps", pattern: /\bazure devops\b/i },
  { name: "Docker", pattern: /\bdocker\b/i },
  { name: "AWS", pattern: /\baws\b/i },
  { name: "Azure", pattern: /\bazure\b(?! devops)/i },
  { name: "GCP", pattern: /\bgcp\b|\bgoogle cloud\b/i },
];

export function detectTechnologies(text: string): string[] {
  const found: string[] = [];
  for (const t of TECHNOLOGY_PATTERNS) {
    if (t.pattern.test(text)) found.push(t.name);
  }
  return found;
}

const QA_CATEGORY_RULES: { category: QACategory; pattern: RegExp }[] = [
  { category: "SDET", pattern: /\bsdet\b/i },
  { category: "Automation Testing", pattern: /\bautomat(ion|ed)\b/i },
  { category: "Manual Testing", pattern: /\bmanual test/i },
  { category: "API Testing", pattern: /\bapi test|\brest api\b[\s\S]{0,30}\btest/i },
  { category: "Performance Testing", pattern: /\bperformance test|\bload test|\bjmeter\b|\bk6\b/i },
  { category: "Mobile Testing", pattern: /\bmobile test|\bappium\b|\bios test|\bandroid test/i },
  { category: "Security Testing", pattern: /\bsecurity test|\bpenetration test|\bpen test/i },
  { category: "Accessibility Testing", pattern: /\baccessibility|\bwcag\b|\ba11y\b/i },
  { category: "Test Management", pattern: /\btest management|\btest plan|\btest strategy/i },
  { category: "QA Leadership", pattern: /\bqa lead\b|\bqa manager\b|\bhead of qa\b|\bqa director\b/i },
  { category: "Quality Engineering", pattern: /\bquality engineer/i },
  { category: "DevOps / QA", pattern: /\bci\/cd\b|\bdevops\b/i },
  { category: "AI Testing", pattern: /\bai test|\bml test|\bllm test|\bmodel test/i },
];

/** Multi-label: a job can span several categories (e.g. Automation + API). Falls back to Manual Testing only when nothing else matches, since that's the broadest safe default for a QA-titled role. */
export function classifyQACategories(title: string, description: string): QACategory[] {
  const text = `${title} ${description}`;
  const matched = QA_CATEGORY_RULES.filter((r) => r.pattern.test(text)).map((r) => r.category);
  const unique = Array.from(new Set(matched));
  return unique.length > 0 ? unique : ["Manual Testing"];
}

export function classifyJobLevel(title: string, minYears: number): JobLevel {
  const t = title.toLowerCase();
  if (/\barchitect\b/.test(t)) return "Architect";
  if (/\bmanager\b|\bhead of\b|\bdirector\b/.test(t)) return "Manager";
  if (/\blead\b/.test(t)) return "Lead";
  if (/\bsenior\b|\bsr\.?\s/.test(t)) return "Senior";
  if (/\bintern(ship)?\b/.test(t)) return "Intern";
  if (/\bfresher\b|\bentry[\s-]level\b/.test(t)) return "Fresher";
  if (/\bjunior\b|\bjr\.?\s/.test(t)) return "Junior";
  if (minYears >= 8) return "Lead";
  if (minYears >= 5) return "Senior";
  if (minYears >= 2) return "Mid-Level";
  if (minYears >= 1) return "Junior";
  return "Fresher";
}

export interface RemoteClassification {
  status: RemoteStatus;
  needsReview: boolean;
}

/**
 * The core India-eligibility rule from the spec: an international job is only
 * REMOTE_INDIA when the evidence text explicitly names India (or is explicitly
 * worldwide/anywhere). Plain "Remote" on a non-Indian listing is never enough —
 * it lands as REMOTE_UNKNOWN and is flagged for review instead of guessed at.
 */
export function classifyRemoteStatus(evidenceText: string | null, country: string): RemoteClassification {
  if (!evidenceText) return { status: "ONSITE", needsReview: false };
  const t = evidenceText.toLowerCase();
  const mentionsIndia = /india/.test(t);
  const worldwide = /worldwide|global|anywhere|multiple countries/.test(t);
  const hybrid = /hybrid/.test(t);
  const remote = /remote|wfh|work from home/.test(t);
  const regional = /\basia\b|\bapac\b|\btimezone\b/.test(t);

  if (hybrid) return { status: "HYBRID", needsReview: false };
  if (!remote) return { status: "ONSITE", needsReview: false };

  if (country === "India") {
    return { status: "REMOTE_INDIA", needsReview: false };
  }

  if (mentionsIndia) return { status: "REMOTE_INDIA", needsReview: false };
  if (worldwide) return { status: "REMOTE_WORLDWIDE", needsReview: false };
  if (regional) return { status: "REMOTE_REGION", needsReview: true };
  return { status: "REMOTE_UNKNOWN", needsReview: true };
}

export function classifyEmploymentType(text: string): EmploymentType {
  const t = text.toLowerCase();
  if (/\bintern(ship)?\b/.test(t)) return "Internship";
  if (/\bcontract\b|\bc2h\b|\bcontract[\s-]to[\s-]hire\b/.test(t)) return "Contract";
  if (/\bfreelance\b/.test(t)) return "Freelance";
  if (/\bpart[\s-]time\b/.test(t)) return "Part-time";
  return "Full-time";
}

export function deriveReviewReasons(opts: {
  qaCategoriesWereFallback: boolean;
  remoteNeedsReview: boolean;
  isIndiaLocation: boolean;
  remoteStatus: RemoteStatus;
}): ReviewReason[] {
  const reasons: ReviewReason[] = [];
  if (opts.qaCategoriesWereFallback) reasons.push("qa_relevance_unclear");
  if (opts.remoteNeedsReview) reasons.push("remote_status_unclear");
  if (!opts.isIndiaLocation && opts.remoteStatus === "REMOTE_UNKNOWN") reasons.push("india_eligibility_unclear");
  return reasons;
}

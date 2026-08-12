export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export interface DedupCandidate {
  id: string;
  companyId: string;
  title: string;
  city: string | null;
  jobUrl: string;
}

/**
 * Same job posted to multiple sources (LinkedIn, Indeed, company careers) is
 * matched on company + normalized title + location, or an identical canonical
 * URL — matching the spec's stated matching signals minus description-similarity
 * (not worth a text-similarity model for a rule-based v1; URL + title + company
 * + location already catches the common "same job, multiple boards" case).
 */
export function isDuplicate(a: DedupCandidate, b: DedupCandidate): boolean {
  if (a.jobUrl && b.jobUrl && a.jobUrl === b.jobUrl) return true;
  return a.companyId === b.companyId && normalizeTitle(a.title) === normalizeTitle(b.title) && (a.city ?? "") === (b.city ?? "");
}

/** Prefers the official company careers page as the canonical/displayed listing when duplicates are found across sources. */
export function pickCanonical<T extends { sourceType: string }>(dupes: T[]): T {
  return dupes.find((d) => d.sourceType === "CompanyCareers") ?? dupes[0];
}

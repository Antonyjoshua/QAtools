export interface HelpEntry {
  id: string;
  /** Display grouping shown as a small badge on the answer, e.g. "Notes", "Bug Reports". */
  module: string;
  /** Canonical phrasing shown back to the user, e.g. "How do I add a note?" */
  question: string;
  /** Extra terms/synonyms to match on, lowercase. The question's own words are matched automatically. */
  keywords: string[];
  steps: string[];
  tip?: string;
  link?: { href: string; label: string };
}

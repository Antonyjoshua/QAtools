import type { Job, SourceType } from "./types";

// -----------------------------------------------------------------------------
// Job source adapter architecture.
//
// This is the seam where real ingestion plugs in later: implement fetchJobs()
// against a real API/feed, keep normalizeJob()/validateJob() the same shape,
// and the rest of the app (classification, dedup, storage, UI) doesn't change.
//
// Every adapter below is a REAL class with a REAL (small) implementation of
// the parts that don't need network access, but fetchJobs() deliberately
// throws rather than returning empty/fake data — a source that "succeeds"
// with zero jobs looks identical to a source with nothing new to report,
// which would be misleading. Throwing surfaces honestly in the admin Source
// Errors log instead.
// -----------------------------------------------------------------------------

export interface RawSourceJob {
  [key: string]: unknown;
}

export interface SourceMetadata {
  id: string;
  name: string;
  type: SourceType;
  /** Human-readable rate-limit note shown in the admin panel — not enforced here. */
  rateLimitNote?: string;
  /** Attribution string required by some sources' terms (e.g. "Jobs via Greenhouse"). */
  attribution?: string;
  /** Where this source's public API/feed docs live, for whoever wires this up. */
  docsUrl?: string;
}

export interface JobSourceAdapter {
  getSourceMetadata(): SourceMetadata;
  fetchJobs(page?: number): Promise<RawSourceJob[]>;
  normalizeJob(raw: RawSourceJob): Job | null;
  validateJob(job: Job): boolean;
  getNextPage(currentPage: number, resultsOnPage: RawSourceJob[]): number | null;
}

export class SourceNotConnectedError extends Error {
  constructor(sourceName: string) {
    super(`${sourceName} is not connected yet — configure API access in Admin > Sources before syncing.`);
    this.name = "SourceNotConnectedError";
  }
}

abstract class BaseJobSourceAdapter implements JobSourceAdapter {
  abstract getSourceMetadata(): SourceMetadata;

  fetchJobs(_page?: number): Promise<RawSourceJob[]> {
    throw new SourceNotConnectedError(this.getSourceMetadata().name);
  }

  normalizeJob(_raw: RawSourceJob): Job | null {
    throw new SourceNotConnectedError(this.getSourceMetadata().name);
  }

  /** Baseline field-presence check every adapter can reuse once it has a real normalizeJob(). */
  validateJob(job: Job): boolean {
    return Boolean(job.id && job.title && job.companyName && job.jobUrl && job.postedDate);
  }

  getNextPage(currentPage: number, resultsOnPage: RawSourceJob[]): number | null {
    return resultsOnPage.length > 0 ? currentPage + 1 : null;
  }
}

export class CompanyCareerAdapter extends BaseJobSourceAdapter {
  constructor(private companyName: string, private careersUrl: string) {
    super();
  }
  getSourceMetadata(): SourceMetadata {
    return { id: `company:${this.companyName}`, name: `${this.companyName} Careers`, type: "CompanyCareers", docsUrl: this.careersUrl };
  }
}

export class GreenhouseAdapter extends BaseJobSourceAdapter {
  constructor(private boardToken: string) {
    super();
  }
  getSourceMetadata(): SourceMetadata {
    return {
      id: `greenhouse:${this.boardToken}`,
      name: "Greenhouse",
      type: "Greenhouse",
      rateLimitNote: "Public job board API — no key required per Greenhouse's documented usage.",
      attribution: "Jobs via Greenhouse",
      docsUrl: `https://boards-api.greenhouse.io/v1/boards/${this.boardToken}/jobs`,
    };
  }
}

export class LeverAdapter extends BaseJobSourceAdapter {
  constructor(private site: string) {
    super();
  }
  getSourceMetadata(): SourceMetadata {
    return {
      id: `lever:${this.site}`,
      name: "Lever",
      type: "Lever",
      rateLimitNote: "Public postings API — respect Lever's fair-use rate limits.",
      attribution: "Jobs via Lever",
      docsUrl: `https://api.lever.co/v0/postings/${this.site}`,
    };
  }
}

export class AshbyAdapter extends BaseJobSourceAdapter {
  constructor(private jobBoardName: string) {
    super();
  }
  getSourceMetadata(): SourceMetadata {
    return { id: `ashby:${this.jobBoardName}`, name: "Ashby", type: "Ashby", attribution: "Jobs via Ashby" };
  }
}

export class WorkableAdapter extends BaseJobSourceAdapter {
  constructor(private subdomain: string) {
    super();
  }
  getSourceMetadata(): SourceMetadata {
    return { id: `workable:${this.subdomain}`, name: "Workable", type: "Workable", attribution: "Jobs via Workable" };
  }
}

export class RSSAdapter extends BaseJobSourceAdapter {
  constructor(private feedName: string, private feedUrl: string) {
    super();
  }
  getSourceMetadata(): SourceMetadata {
    return { id: `rss:${this.feedName}`, name: this.feedName, type: "RSS", docsUrl: this.feedUrl };
  }
}

export function createAdapter(sourceType: SourceType, id: string, label: string): JobSourceAdapter {
  switch (sourceType) {
    case "CompanyCareers":
      // `label` (the source's display name) already ends in "Careers" by convention —
      // strip it here since CompanyCareerAdapter appends its own " Careers" suffix.
      return new CompanyCareerAdapter(label.replace(/\s+Careers$/i, ""), id);
    case "Greenhouse":
      return new GreenhouseAdapter(id);
    case "Lever":
      return new LeverAdapter(id);
    case "Ashby":
      return new AshbyAdapter(id);
    case "Workable":
      return new WorkableAdapter(id);
    case "RSS":
      return new RSSAdapter(label, id);
    default:
      return new CompanyCareerAdapter(label, id);
  }
}

import type { HelpEntry } from "../types";

export const JOBS_ENTRIES: HelpEntry[] = [
  {
    id: "jobs-search",
    module: "Jobs",
    question: "How do I search for QA jobs?",
    keywords: ["search jobs", "find jobs", "job search"],
    steps: [
      "Open Jobs from the sidebar (or the Quick Job Search popup in the top toolbar).",
      "Use the search box and filters (remote status, location, experience, posted date) to narrow the list.",
      "Click a job to view details and the original listing link.",
    ],
    link: { href: "/jobs", label: "Open Jobs" },
  },
  {
    id: "jobs-save",
    module: "Jobs",
    question: "How do I save a job or track my application status?",
    keywords: ["save job", "bookmark job", "application status", "job pipeline"],
    steps: [
      "Open a job and click Save (or the bookmark icon in the list).",
      "Go to Jobs > Saved to see your saved jobs and change each one's status (Saved, Applied, Interview, Rejected, Archived) as you progress.",
    ],
    link: { href: "/jobs/saved", label: "Open Saved Jobs" },
  },
  {
    id: "jobs-alerts",
    module: "Jobs",
    question: "How do I set up job alerts?",
    keywords: ["job alert", "job notifications"],
    steps: [
      "Go to Jobs > Alerts.",
      "Create a new alert with a search query, location filter, and frequency (Instant/Daily/Weekly).",
    ],
    link: { href: "/jobs/alerts", label: "Open Job Alerts" },
  },
  {
    id: "jobs-profile",
    module: "Jobs",
    question: "How do I set my job preferences (remote, salary, skills)?",
    keywords: ["job profile", "job preferences", "remote preference", "expected salary"],
    steps: [
      "Go to Jobs > Profile.",
      "Set your remote work preference, expected salary and currency, and your skills.",
    ],
    link: { href: "/jobs/profile", label: "Open Job Profile" },
  },
];

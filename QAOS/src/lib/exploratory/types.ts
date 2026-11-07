export const SESSION_STATUSES = ["Planned", "In Progress", "Paused", "Completed"] as const;
export type SessionStatus = (typeof SESSION_STATUSES)[number];

export const NOTE_TYPES = ["Note", "Bug", "Question", "Idea", "Risk"] as const;
export type NoteType = (typeof NOTE_TYPES)[number];

export interface Charter {
  id: string;
  title: string;
  /** The session's stated goal, e.g. "Explore the checkout flow to discover edge cases using invalid coupon codes." */
  mission: string;
  areas: string[];
  targetDurationMinutes: number;
  createdAt: number;
}

export interface Session {
  id: string;
  charterId: string;
  tester: string;
  status: SessionStatus;
  /** Elapsed time accumulated across all completed run segments (drift-free — wall-clock based, same technique as the Quick Timer's stopwatch). */
  accumulatedMs: number;
  /** Timestamp the current run segment started, or null when paused/not started/completed. */
  startedAt: number | null;
  completedAt: number | null;
  createdAt: number;
}

export interface SessionNote {
  id: string;
  sessionId: string;
  type: NoteType;
  text: string;
  timestamp: number;
  linkedBugId: string | null;
  linkedBugDisplayId: string | null;
}

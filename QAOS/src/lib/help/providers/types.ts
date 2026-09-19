import type { HelpEntry } from "../types";

export interface ChatTurn {
  role: "user" | "assistant";
  text: string;
}

export type HelpAnswer =
  | { kind: "kb"; entry: HelpEntry; alternatives: HelpEntry[] }
  | { kind: "text"; text: string; sources: HelpEntry[] }
  | { kind: "fallback"; text: string };

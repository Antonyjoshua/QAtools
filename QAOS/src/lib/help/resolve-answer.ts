import { searchHelp } from "./search";
import { AI_PROVIDER } from "./providers/ai-provider";
import type { ChatTurn, HelpAnswer } from "./providers/types";

const FALLBACK_TEXT =
  "I don't have an answer for that yet. Try asking about a specific module — Notes, Bug Reports, Test Management, Calculator, Test Data Generator, Resume Builder, Learn, File Converter, Jobs, or Solo Leveling.";

/**
 * The single place the UI asks "what's the answer to this?" — it doesn't know or care whether
 * that came from the local keyword search or (once wired in) a real model; see providers/ai-provider.ts.
 */
export async function resolveHelpAnswer(query: string, history: ChatTurn[]): Promise<HelpAnswer> {
  const matches = searchHelp(query);
  const grounding = matches.map((m) => m.entry);

  if (AI_PROVIDER) {
    const aiText = await AI_PROVIDER(query, history, grounding);
    if (aiText) return { kind: "text", text: aiText, sources: grounding.slice(0, 3) };
  }

  const top = matches[0];
  if (!top) return { kind: "fallback", text: FALLBACK_TEXT };

  const alternatives = matches
    .slice(1, 3)
    .filter((m) => m.score >= top.score / 2)
    .map((m) => m.entry);
  return { kind: "kb", entry: top.entry, alternatives };
}

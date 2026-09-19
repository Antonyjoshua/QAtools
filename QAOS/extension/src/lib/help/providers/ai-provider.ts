import type { HelpEntry } from "../types";
import type { ChatTurn } from "./types";

/**
 * Extension point for a real AI-backed answer. Deliberately unimplemented for now — this app has
 * no backend and no AI service wired up anywhere, and the local knowledge-base search this
 * chatbot uses today keeps that true (nothing leaves the device, no API key, no cost).
 *
 * To wire in a real model later:
 *   1. Implement a function matching `AiAnswerFn` below that calls your LLM of choice (e.g. the
 *      Claude API). You'll be given:
 *        - `query`     — the user's latest message
 *        - `history`   — the full conversation so far, oldest first, for multi-turn context
 *        - `grounding` — the top-matching entries from this app's local help knowledge base
 *          (search.ts). Pass these to the model as system/context and instruct it to answer only
 *          from them. This is the important part: an ungrounded chatbot will confidently invent
 *          buttons and steps that don't exist in this app, which is worse than the honest
 *          "I don't know" fallback this widget already has. Grounding on the KB keeps answers
 *          conversational (real AI phrasing, follow-up understanding) while staying factual.
 *   2. Return the model's reply as a string, or `null` to fall back to the plain local-KB answer
 *      for that turn (e.g. on an API error, or if you want to only use AI for queries the local
 *      search scored poorly on).
 *   3. Point AI_PROVIDER at your function. resolveHelpAnswer() (in ../resolve-answer.ts) already
 *      checks it on every message — no other file needs to change.
 */
export type AiAnswerFn = (query: string, history: ChatTurn[], grounding: HelpEntry[]) => Promise<string | null>;

export const AI_PROVIDER: AiAnswerFn | null = null;

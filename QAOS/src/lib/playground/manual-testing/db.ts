import Dexie, { type EntityTable } from "dexie";
import type { ChallengeAttempt } from "./types";

class ChallengeArenaDB extends Dexie {
  attempts!: EntityTable<ChallengeAttempt, "id">;

  constructor() {
    super("challengearena-db");
    this.version(1).stores({
      attempts: "id, challengeId, mechanic, technique, passed, attemptedAt",
    });
  }
}

export const db = new ChallengeArenaDB();

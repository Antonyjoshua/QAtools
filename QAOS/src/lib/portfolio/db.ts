import Dexie, { type EntityTable } from "dexie";
import type { Portfolio, PortfolioAttachment } from "./types";

class PortfolioBuilderDB extends Dexie {
  portfolios!: EntityTable<Portfolio, "id">;
  attachments!: EntityTable<PortfolioAttachment, "id">;

  constructor() {
    super("qaos-portfolio-db");
    this.version(1).stores({
      portfolios: "id, name, templateId, favorite, createdAt, updatedAt, lastOpenedAt",
      attachments: "id, portfolioId, kind, createdAt",
    });
  }
}

export const db = new PortfolioBuilderDB();

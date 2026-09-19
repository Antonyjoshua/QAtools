import { db } from "../db";
import { uid } from "../id";
import { createSampleContent } from "../sample-data";
import { getTemplate } from "../templates/registry";
import type { Portfolio, PortfolioContent, PortfolioTemplateId } from "../types";

export async function createPortfolioFromTemplate(templateId: PortfolioTemplateId, name?: string): Promise<Portfolio> {
  const template = getTemplate(templateId);
  if (!template) throw new Error(`Unknown portfolio template: ${templateId}`);
  const now = Date.now();
  const portfolio: Portfolio = {
    id: uid(),
    name: name?.trim() || `${template.name} Portfolio`,
    templateId: template.id,
    themeId: template.defaultThemeId,
    content: createSampleContent(),
    favorite: false,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
  };
  await db.portfolios.add(portfolio);
  return portfolio;
}

export async function updatePortfolioContent(id: string, content: PortfolioContent): Promise<void> {
  await db.portfolios.update(id, { content, updatedAt: Date.now() });
}

export async function renamePortfolio(id: string, name: string): Promise<void> {
  await db.portfolios.update(id, { name, updatedAt: Date.now() });
}

export async function switchPortfolioTemplate(id: string, templateId: PortfolioTemplateId): Promise<void> {
  const template = getTemplate(templateId);
  if (!template) return;
  await db.portfolios.update(id, { templateId, themeId: template.defaultThemeId, updatedAt: Date.now() });
}

export async function setPortfolioTheme(id: string, themeId: string): Promise<void> {
  await db.portfolios.update(id, { themeId, updatedAt: Date.now() });
}

export async function touchPortfolioOpened(id: string): Promise<void> {
  await db.portfolios.update(id, { lastOpenedAt: Date.now() });
}

export async function duplicatePortfolio(id: string): Promise<Portfolio | null> {
  const original = await db.portfolios.get(id);
  if (!original) return null;
  const now = Date.now();
  const copy: Portfolio = { ...original, id: uid(), name: `${original.name} (Copy)`, createdAt: now, updatedAt: now, lastOpenedAt: now };
  await db.portfolios.add(copy);
  return copy;
}

export async function deletePortfolio(id: string): Promise<void> {
  await db.transaction("rw", [db.portfolios, db.attachments], async () => {
    await db.portfolios.delete(id);
    await db.attachments.where("portfolioId").equals(id).delete();
  });
}

export async function togglePortfolioFavorite(id: string): Promise<void> {
  const portfolio = await db.portfolios.get(id);
  if (!portfolio) return;
  await db.portfolios.update(id, { favorite: !portfolio.favorite });
}

import type { CategoryId, GeneratorModule } from "./types";
import { personalGenerators } from "./modules/personal";
import { indianGenerators } from "./modules/indian";
import { bankingGenerators } from "./modules/banking";
import { ecommerceGenerators } from "./modules/ecommerce";
import { apiGenerators } from "./modules/api";
import { databaseGenerators } from "./modules/database";
import { automationGenerators } from "./modules/automation";
import { mobileGenerators } from "./modules/mobile";
import { securityGenerators } from "./modules/security";
import { devUtilsGenerators } from "./modules/devutils";
import { qaGenerators } from "./modules/qa";
import { contentGenerators } from "./modules/content";
import { fakerProfileGenerators } from "./modules/faker-profiles";
import { fileGenerators } from "./modules/files";

export const ALL_GENERATORS: GeneratorModule[] = [
  ...personalGenerators,
  ...indianGenerators,
  ...bankingGenerators,
  ...ecommerceGenerators,
  ...apiGenerators,
  ...databaseGenerators,
  ...automationGenerators,
  ...mobileGenerators,
  ...securityGenerators,
  ...devUtilsGenerators,
  ...qaGenerators,
  ...contentGenerators,
  ...fakerProfileGenerators,
  ...fileGenerators,
];

const bySlug = new Map(ALL_GENERATORS.map((g) => [g.slug, g]));

export function getGeneratorBySlug(slug: string): GeneratorModule | undefined {
  return bySlug.get(slug);
}

export function getGeneratorsByCategory(category: CategoryId): GeneratorModule[] {
  return ALL_GENERATORS.filter((g) => g.category === category);
}

export function searchGenerators(query: string): GeneratorModule[] {
  const q = query.trim().toLowerCase();
  if (!q) return ALL_GENERATORS;
  return ALL_GENERATORS.filter(
    (g) =>
      g.name.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      (g.tags ?? []).some((t) => t.toLowerCase().includes(q))
  );
}

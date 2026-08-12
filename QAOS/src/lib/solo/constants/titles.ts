import type { TitleDefinition } from "@/lib/solo/types";
import { LEVEL_BREAKPOINTS } from "./levels";

/** Equippable badge titles — one per career-level breakpoint. */
export const TITLES: TitleDefinition[] = LEVEL_BREAKPOINTS.map((bp) => ({
  id: `title-${bp.title.toLowerCase().replace(/\s+/g, "-")}`,
  name: bp.title,
  unlockLevel: bp.level,
}));

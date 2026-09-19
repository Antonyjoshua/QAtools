import type { HelpEntry } from "./types";
import { NOTES_ENTRIES } from "./kb/notes";
import { CALCULATOR_ENTRIES } from "./kb/calculator";
import { GENERATOR_ENTRIES } from "./kb/generator";
import { TESTCASES_ENTRIES } from "./kb/testcases";
import { BUGS_ENTRIES } from "./kb/bugs";
import { RESUME_ENTRIES } from "./kb/resume";
import { LEARN_ENTRIES } from "./kb/learn";
import { CONVERT_ENTRIES } from "./kb/convert";
import { JOBS_ENTRIES } from "./kb/jobs";
import { SOLO_ENTRIES } from "./kb/solo";
import { QUICK_TOOLS_ENTRIES } from "./kb/quick-tools";
import { GENERAL_ENTRIES } from "./kb/general";

export const HELP_ENTRIES: HelpEntry[] = [
  ...GENERAL_ENTRIES,
  ...NOTES_ENTRIES,
  ...CALCULATOR_ENTRIES,
  ...GENERATOR_ENTRIES,
  ...TESTCASES_ENTRIES,
  ...BUGS_ENTRIES,
  ...RESUME_ENTRIES,
  ...LEARN_ENTRIES,
  ...CONVERT_ENTRIES,
  ...JOBS_ENTRIES,
  ...SOLO_ENTRIES,
  ...QUICK_TOOLS_ENTRIES,
];

export const HELP_MODULES: string[] = Array.from(new Set(HELP_ENTRIES.map((e) => e.module)));

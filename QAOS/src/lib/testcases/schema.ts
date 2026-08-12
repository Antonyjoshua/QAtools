import { z } from "zod";
import { PRIORITIES, SEVERITIES, TEST_TYPES, TEST_CASE_STATUSES, AUTOMATION_STATUSES } from "./types";

// No .default() here: zodResolver requires the schema's input and output types to
// match exactly, and .default() makes the input type optional while the output type
// stays required. Callers always pass complete defaultValues instead (see
// app/testcases/case/new/page.tsx and the detail page).
export const testCaseFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(5000),
  objective: z.string().max(2000),
  module: z.string().max(120),
  feature: z.string().max(120),

  priority: z.enum(PRIORITIES),
  severity: z.enum(SEVERITIES),
  type: z.enum(TEST_TYPES),
  status: z.enum(TEST_CASE_STATUSES),

  requirementId: z.string().max(60),
  sprint: z.string().max(60),
  releaseVersion: z.string().max(60),
  environment: z.string().max(60),
  browser: z.string().max(60),
  device: z.string().max(60),
  os: z.string().max(60),
  tags: z.array(z.string()),

  reviewer: z.string().max(120),
  estimatedTimeMinutes: z.number().min(0).max(10000).nullable(),

  automationStatus: z.enum(AUTOMATION_STATUSES),
  automationScriptLink: z.string().max(500),

  preconditions: z.string().max(5000),
  testData: z.string().max(5000),
  expectedResult: z.string().max(5000),
  notes: z.string().max(5000),
});

export type TestCaseFormValues = z.infer<typeof testCaseFormSchema>;

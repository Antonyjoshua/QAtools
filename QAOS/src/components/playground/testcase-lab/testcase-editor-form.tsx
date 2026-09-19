"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTestCase } from "@/lib/playground/testcase-lab/testcases-repo";
import type { TestCasePriority, TestCaseType } from "@/lib/playground/testcase-lab/types";

const TYPES: TestCaseType[] = ["Positive", "Negative", "Boundary", "Security", "Usability"];
const PRIORITIES: TestCasePriority[] = ["P1", "P2", "P3", "P4"];

const EMPTY = {
  scenario: "",
  preconditions: "",
  testData: "",
  steps: "",
  expectedResult: "",
  priority: "P3" as TestCasePriority,
  type: "Positive" as TestCaseType,
};

export function TestCaseEditorForm({ requirementId }: { requirementId: string }) {
  const [values, setValues] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await createTestCase({ requirementId, ...values });
    setSubmitting(false);
    setValues(EMPTY);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="tc-scenario">Scenario</Label>
        <Input
          id="tc-scenario"
          value={values.scenario}
          onChange={(e) => update("scenario", e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="tc-pre">Preconditions</Label>
        <Textarea
          id="tc-pre"
          value={values.preconditions}
          onChange={(e) => update("preconditions", e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="tc-data">Test Data</Label>
        <Input id="tc-data" value={values.testData} onChange={(e) => update("testData", e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="tc-steps">Steps</Label>
        <Textarea
          id="tc-steps"
          value={values.steps}
          onChange={(e) => update("steps", e.target.value)}
          placeholder={"1. ...\n2. ..."}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="tc-expected">Expected Result</Label>
        <Textarea
          id="tc-expected"
          value={values.expectedResult}
          onChange={(e) => update("expectedResult", e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Type</Label>
          <Select value={values.type} onValueChange={(v) => update("type", v as TestCaseType)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Priority</Label>
          <Select value={values.priority} onValueChange={(v) => update("priority", v as TestCasePriority)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" disabled={submitting}>
        Add Test Case (+15 XP)
      </Button>
    </form>
  );
}

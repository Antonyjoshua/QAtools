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
import { submitBugReport } from "@/lib/playground/bug-hunter/reports-repo";
import type { BugReportInput, BugReportSubmission, Reproducibility } from "@/lib/playground/bug-hunter/types";
import type { BugCategory, BugPriority, BugSeverity, ShopModule } from "@/lib/playground/bug-registry/types";

const MODULES: ShopModule[] = [
  "Auth",
  "Catalog",
  "Product Detail",
  "Cart",
  "Wishlist",
  "Coupons",
  "Checkout",
  "Payment",
  "Orders",
  "Profile",
  "Addresses",
];
const SEVERITIES: BugSeverity[] = ["Critical", "High", "Medium", "Low"];
const PRIORITIES: BugPriority[] = ["P1", "P2", "P3", "P4"];
const REPRODUCIBILITIES: Reproducibility[] = ["Always", "Sometimes", "Rarely", "Could not reproduce"];
const CATEGORIES: BugCategory[] = [
  "Functional",
  "UI",
  "Validation",
  "Boundary",
  "Data",
  "Usability",
  "Accessibility",
  "Security",
];

const EMPTY: Omit<BugReportInput, "missionId"> = {
  title: "",
  module: "Catalog",
  environment: "",
  preconditions: "",
  stepsToReproduce: "",
  expectedResult: "",
  actualResult: "",
  severity: "Medium",
  priority: "P3",
  reproducibility: "Always",
  category: "Functional",
  evidenceNote: "",
};

interface Props {
  missionId: string;
  defaultEnvironment?: string;
  defaultValues?: Partial<Omit<BugReportInput, "missionId">>;
  linkedTestCaseId?: string;
  linkedExecutionId?: string;
  linkedExecutionResultId?: string;
  onSubmitted?: (report: BugReportSubmission) => void;
}

export function BugReportForm({
  missionId,
  defaultEnvironment,
  defaultValues,
  linkedTestCaseId,
  linkedExecutionId,
  linkedExecutionResultId,
  onSubmitted,
}: Props) {
  const [values, setValues] = useState<Omit<BugReportInput, "missionId">>({
    ...EMPTY,
    environment: defaultEnvironment ?? "",
    ...defaultValues,
  });
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const report = await submitBugReport({
      ...values,
      missionId,
      linkedTestCaseId,
      linkedExecutionId,
      linkedExecutionResultId,
    });
    setSubmitting(false);
    setValues({ ...EMPTY, environment: defaultEnvironment ?? "" });
    onSubmitted?.(report);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="bh-title">Title</Label>
        <Input
          id="bh-title"
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Short summary of the problem"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Module</Label>
          <Select value={values.module} onValueChange={(v) => update("module", v as ShopModule)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODULES.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="bh-env">Environment</Label>
          <Input id="bh-env" value={values.environment} onChange={(e) => update("environment", e.target.value)} />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="bh-pre">Preconditions</Label>
        <Textarea
          id="bh-pre"
          value={values.preconditions}
          onChange={(e) => update("preconditions", e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="bh-steps">Steps to Reproduce</Label>
        <Textarea
          id="bh-steps"
          value={values.stepsToReproduce}
          onChange={(e) => update("stepsToReproduce", e.target.value)}
          placeholder={"1. ...\n2. ...\n3. ..."}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="bh-expected">Expected Result</Label>
          <Textarea
            id="bh-expected"
            value={values.expectedResult}
            onChange={(e) => update("expectedResult", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="bh-actual">Actual Result</Label>
          <Textarea
            id="bh-actual"
            value={values.actualResult}
            onChange={(e) => update("actualResult", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="space-y-1">
          <Label>Severity</Label>
          <Select value={values.severity} onValueChange={(v) => update("severity", v as BugSeverity)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEVERITIES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Priority</Label>
          <Select value={values.priority} onValueChange={(v) => update("priority", v as BugPriority)}>
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
        <div className="space-y-1">
          <Label>Reproducibility</Label>
          <Select
            value={values.reproducibility}
            onValueChange={(v) => update("reproducibility", v as Reproducibility)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REPRODUCIBILITIES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Category</Label>
          <Select value={values.category} onValueChange={(v) => update("category", v as BugCategory)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="bh-evidence">Evidence (describe attached screenshot/notes)</Label>
        <Textarea
          id="bh-evidence"
          value={values.evidenceNote}
          onChange={(e) => update("evidenceNote", e.target.value)}
          placeholder="e.g. Screenshot showing the cart total before/after applying the coupon."
        />
      </div>

      <Button type="submit" disabled={submitting}>
        Report Bug
      </Button>
    </form>
  );
}

"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createTestPlan, updateTestPlan } from "@/lib/testcases/repo/test-plans-repo";
import { TEST_PLAN_STATUSES, type TestPlan, type TestPlanStatus } from "@/lib/testcases/types";

function toDateInput(ts: number | null): string {
  return ts ? new Date(ts).toISOString().slice(0, 10) : "";
}

interface NewTestPlanDialogProps {
  projectId: string;
  plan?: TestPlan;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSaved?: (plan: TestPlan) => void;
  hideTrigger?: boolean;
}

export function NewTestPlanDialog({ projectId, plan, open: controlledOpen, onOpenChange, onSaved, hideTrigger }: NewTestPlanDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const [name, setName] = React.useState(plan?.name ?? "");
  const [objective, setObjective] = React.useState(plan?.objective ?? "");
  const [targetRelease, setTargetRelease] = React.useState(plan?.targetRelease ?? "");
  const [environment, setEnvironment] = React.useState(plan?.environment ?? "");
  const [owner, setOwner] = React.useState(plan?.owner ?? "");
  const [startDate, setStartDate] = React.useState(toDateInput(plan?.startDate ?? null));
  const [endDate, setEndDate] = React.useState(toDateInput(plan?.endDate ?? null));
  const [status, setStatus] = React.useState<TestPlanStatus>(plan?.status ?? "Draft");

  React.useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset form fields from `plan` each time the dialog opens
      setName(plan?.name ?? "");
      setObjective(plan?.objective ?? "");
      setTargetRelease(plan?.targetRelease ?? "");
      setEnvironment(plan?.environment ?? "");
      setOwner(plan?.owner ?? "");
      setStartDate(toDateInput(plan?.startDate ?? null));
      setEndDate(toDateInput(plan?.endDate ?? null));
      setStatus(plan?.status ?? "Draft");
    }
  }, [open, plan]);

  async function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const fields = {
      name: trimmedName,
      objective: objective.trim(),
      targetRelease: targetRelease.trim(),
      environment: environment.trim(),
      owner: owner.trim(),
      startDate: startDate ? new Date(startDate).getTime() : null,
      endDate: endDate ? new Date(endDate).getTime() : null,
      status,
    };

    let saved: TestPlan;
    if (plan) {
      await updateTestPlan(plan.id, fields);
      saved = { ...plan, ...fields, updatedAt: Date.now() };
    } else {
      saved = await createTestPlan({ projectId, ...fields });
    }
    setOpen(false);
    onSaved?.(saved);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          New Test Plan
        </Button>
      )}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{plan ? "Edit test plan" : "New test plan"}</DialogTitle>
        </DialogHeader>
        <div className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto py-2 pr-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="plan-name">Name</Label>
            <Input id="plan-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sprint 15 Regression Plan" autoFocus />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="plan-objective">Objective</Label>
            <Textarea id="plan-objective" value={objective} onChange={(e) => setObjective(e.target.value)} rows={2} placeholder="What this plan is meant to verify" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-release">Target release</Label>
              <Input id="plan-release" value={targetRelease} onChange={(e) => setTargetRelease(e.target.value)} placeholder="v2.5.0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-env">Environment</Label>
              <Input id="plan-env" value={environment} onChange={(e) => setEnvironment(e.target.value)} placeholder="Staging" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-owner">Owner</Label>
              <Input id="plan-owner" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Who owns this plan?" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => v !== null && setStatus(v as TestPlanStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEST_PLAN_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-start">Start date</Label>
              <Input id="plan-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-end">End date</Label>
              <Input id="plan-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {plan ? "Save changes" : "Create plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

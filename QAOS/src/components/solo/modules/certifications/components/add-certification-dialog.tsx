"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/solo/ui/dialog";
import { Button } from "@/components/solo/ui/button";
import { Input } from "@/components/solo/ui/input";
import { Label } from "@/components/solo/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/solo/ui/select";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import type { CertificationStatus } from "@/lib/solo/types";

export function AddCertificationDialog() {
  const [open, setOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [provider, setProvider] = useState("");
  const [status, setStatus] = useState<CertificationStatus>("not-started");
  const addCertification = useAppStore((s) => s.addCertification);

  function handleAdd() {
    if (!courseName.trim()) return;
    addCertification({
      courseName: courseName.trim(),
      provider: provider.trim(),
      status,
      completionPercent: status === "completed" ? 100 : status === "in-progress" ? 50 : 0,
      hasCertificate: status === "completed",
      expiryDate: null,
    });
    setCourseName("");
    setProvider("");
    setStatus("not-started");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          Add Certification
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Certification</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="cert-name">Course Name</Label>
            <Input id="cert-name" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cert-provider">Provider</Label>
            <Input id="cert-provider" value={provider} onChange={(e) => setProvider(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as CertificationStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAdd}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

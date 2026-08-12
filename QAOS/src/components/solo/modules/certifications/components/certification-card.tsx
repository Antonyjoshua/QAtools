"use client";

import { Trash2, BadgeCheck } from "lucide-react";
import { Card } from "@/components/solo/ui/card";
import { Progress } from "@/components/solo/ui/progress";
import { Badge } from "@/components/solo/ui/badge";
import { Button } from "@/components/solo/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/solo/ui/select";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import type { Certification, CertificationStatus } from "@/lib/solo/types";

const STATUS_VARIANT: Record<CertificationStatus, "secondary" | "warning" | "success"> = {
  "not-started": "secondary",
  "in-progress": "warning",
  completed: "success",
};

const STATUS_LABEL: Record<CertificationStatus, string> = {
  "not-started": "Not Started",
  "in-progress": "In Progress",
  completed: "Completed",
};

export function CertificationCard({ cert }: { cert: Certification }) {
  const updateCertification = useAppStore((s) => s.updateCertification);
  const removeCertification = useAppStore((s) => s.removeCertification);

  function handleStatusChange(status: CertificationStatus) {
    updateCertification(cert.id, {
      status,
      completionPercent: status === "completed" ? 100 : status === "in-progress" ? Math.max(cert.completionPercent, 50) : 0,
      hasCertificate: status === "completed" ? true : cert.hasCertificate,
    });
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="font-semibold text-sm truncate">{cert.courseName}</div>
            {cert.hasCertificate && <BadgeCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
          </div>
          <div className="text-xs text-muted-foreground truncate">{cert.provider || "—"}</div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={() => removeCertification(cert.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Completion</span>
          <span>{cert.completionPercent}%</span>
        </div>
        <Progress value={cert.completionPercent} />
      </div>

      <div className="flex items-center justify-between gap-2">
        <Badge variant={STATUS_VARIANT[cert.status]}>{STATUS_LABEL[cert.status]}</Badge>
        <Select value={cert.status} onValueChange={(v) => handleStatusChange(v as CertificationStatus)}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not-started">Not Started</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}

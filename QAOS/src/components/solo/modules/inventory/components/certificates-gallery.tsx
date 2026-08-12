"use client";

import { Award } from "lucide-react";
import { Card } from "@/components/solo/ui/card";
import { useAppStore } from "@/lib/solo/store/useAppStore";

export function CertificatesGallery() {
  const certifications = useAppStore((s) => s.certifications.filter((c) => c.status === "completed"));

  if (certifications.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-10">
        No certificates earned yet — complete one from the Certifications page.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {certifications.map((cert) => (
        <Card key={cert.id} className="p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Award className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{cert.courseName}</div>
            <div className="text-xs text-muted-foreground truncate">{cert.provider}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

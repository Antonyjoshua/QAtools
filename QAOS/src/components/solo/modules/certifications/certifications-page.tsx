"use client";

import { useAppStore } from "@/lib/solo/store/useAppStore";
import { AddCertificationDialog } from "./components/add-certification-dialog";
import { CertificationCard } from "./components/certification-card";

export function CertificationsPage() {
  const certifications = useAppStore((s) => s.certifications);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Certifications</h1>
          <p className="text-sm text-muted-foreground">Track courses and certificates toward your next milestone.</p>
        </div>
        <AddCertificationDialog />
      </div>
      {certifications.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No certifications tracked yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {certifications.map((cert) => (
            <CertificationCard key={cert.id} cert={cert} />
          ))}
        </div>
      )}
    </div>
  );
}

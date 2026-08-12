"use client";

import { ShieldCheck } from "lucide-react";
import { useConvertSettings } from "@/lib/convert/settings-store";
import { PRIVACY_STATEMENT } from "@/lib/convert/services/security";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function PrivacyToggle() {
  const privacyMode = useConvertSettings((s) => s.privacyMode);
  const setPrivacyMode = useConvertSettings((s) => s.setPrivacyMode);

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <Label className="text-sm font-medium">Delete files automatically after conversion</Label>
          <Switch checked={privacyMode} onCheckedChange={(v) => setPrivacyMode(Boolean(v))} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{PRIVACY_STATEMENT}</p>
      </div>
    </div>
  );
}

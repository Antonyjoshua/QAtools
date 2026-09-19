"use client";

import { useRef } from "react";
import { ImagePlus, FileUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { addAttachment, deleteAttachment } from "@/lib/portfolio/repo/attachments-repo";
import { useAttachmentUrl } from "@/lib/portfolio/hooks/use-attachment-url";
import type { PortfolioProfile } from "@/lib/portfolio/types";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function ProfileForm({
  portfolioId,
  profile,
  onChange,
}: {
  portfolioId: string;
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
}) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const photoUrl = useAttachmentUrl(profile.photoAttachmentId);
  const resumeUrl = useAttachmentUrl(profile.resumeAttachmentId);

  function update(patch: Partial<PortfolioProfile>) {
    onChange({ ...profile, ...patch });
  }

  async function handlePhotoSelect(file: File | undefined) {
    if (!file) return;
    const prevId = profile.photoAttachmentId;
    const attachment = await addAttachment(portfolioId, "photo", file);
    update({ photoAttachmentId: attachment.id });
    if (prevId) await deleteAttachment(prevId);
  }

  async function handleResumeSelect(file: File | undefined) {
    if (!file) return;
    const prevId = profile.resumeAttachmentId;
    const attachment = await addAttachment(portfolioId, "resume", file);
    update({ resumeAttachmentId: attachment.id });
    if (prevId) await deleteAttachment(prevId);
  }

  async function removePhoto() {
    const prevId = profile.photoAttachmentId;
    update({ photoAttachmentId: null });
    if (prevId) await deleteAttachment(prevId);
  }

  async function removeResume() {
    const prevId = profile.resumeAttachmentId;
    update({ resumeAttachmentId: null });
    if (prevId) await deleteAttachment(prevId);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <Field label="Full name">
          <Input value={profile.name} onChange={(e) => update({ name: e.target.value })} className="h-8 text-sm" />
        </Field>
        <Field label="Role / title">
          <Input value={profile.role} onChange={(e) => update({ role: e.target.value })} className="h-8 text-sm" />
        </Field>
        <div className="col-span-2 flex flex-col gap-1">
          <Label className="text-[11px] text-muted-foreground">Tagline</Label>
          <Input value={profile.tagline} onChange={(e) => update({ tagline: e.target.value })} className="h-8 text-sm" placeholder="A one-line summary shown in the hero section" />
        </div>
        <Field label="Location">
          <Input value={profile.location} onChange={(e) => update({ location: e.target.value })} className="h-8 text-sm" />
        </Field>
        <Field label="Email">
          <Input value={profile.email} onChange={(e) => update({ email: e.target.value })} className="h-8 text-sm" />
        </Field>
        <Field label="Phone">
          <Input value={profile.phone} onChange={(e) => update({ phone: e.target.value })} className="h-8 text-sm" />
        </Field>
        <Field label="GitHub URL">
          <Input value={profile.github} onChange={(e) => update({ github: e.target.value })} className="h-8 text-sm" />
        </Field>
        <Field label="LinkedIn URL">
          <Input value={profile.linkedin} onChange={(e) => update({ linkedin: e.target.value })} className="h-8 text-sm" />
        </Field>
      </div>

      <div className="flex flex-col gap-1.5 rounded-lg border border-border p-3">
        <span className="text-[11px] text-muted-foreground">Profile photo</span>
        <div className="flex items-center gap-2">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="Profile" className="size-10 rounded-full object-cover" />
          ) : (
            <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <ImagePlus className="size-4" />
            </div>
          )}
          <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => void handlePhotoSelect(e.target.files?.[0])} />
          <Button variant="outline" size="sm" onClick={() => photoInputRef.current?.click()}>
            {photoUrl ? "Replace" : "Upload"}
          </Button>
          {photoUrl && (
            <Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={() => void removePhoto()}>
              <X className="size-3.5" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 rounded-lg border border-border p-3">
        <span className="text-[11px] text-muted-foreground">Resume / CV file</span>
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <FileUp className="size-4" />
          </div>
          <input ref={resumeInputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => void handleResumeSelect(e.target.files?.[0])} />
          <Button variant="outline" size="sm" onClick={() => resumeInputRef.current?.click()}>
            {resumeUrl ? "Replace" : "Upload"}
          </Button>
          {resumeUrl && (
            <Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={() => void removeResume()}>
              <X className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/solo/ui/dialog";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { cn } from "@/lib/utils";

const AVATARS = ["🧑‍💻", "🥷", "🕵️", "🧙", "🦸", "🧝", "🤖", "👾", "🛡️", "⚔️", "🐛", "🔬", "🎯", "🚀", "🔥", "⭐"];

export function AvatarPicker({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const avatar = useAppStore((s) => s.profile.avatar);
  const updateProfile = useAppStore((s) => s.updateProfile);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Choose Avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => {
                updateProfile({ avatar: a });
                setOpen(false);
              }}
              className={cn(
                "flex h-14 items-center justify-center rounded-lg border text-2xl transition-colors",
                avatar === a
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 shadow-[0_0_12px_var(--glow)]"
                  : "border-white/10 bg-white/5 hover:border-[var(--accent)]/40"
              )}
            >
              {a}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

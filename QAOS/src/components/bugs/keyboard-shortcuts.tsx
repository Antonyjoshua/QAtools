"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createBug } from "@/lib/bugs/bugs-repo";

export function KeyboardShortcuts() {
  const router = useRouter();

  React.useEffect(() => {
    async function onKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const key = e.key.toLowerCase();

      if (key === "n") {
        e.preventDefault();
        const bug = await createBug();
        router.push(`/bugs/${bug.id}`);
        toast.success("New bug report created");
      } else if (key === "s") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("bugforge:save"));
      } else if (key === "p") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("bugforge:export-pdf"));
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return null;
}

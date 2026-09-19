"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/lib/playground/shop/hooks/use-current-user";
import { db } from "@/lib/playground/shop/db";
import { isBugActive } from "@/lib/playground/bug-registry/toggle-store";
import type { User } from "@/lib/playground/shop/types";

function ProfileForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name);

  async function handleSave() {
    // BUG-022: an empty name should be rejected — allowed through when active.
    if (!isBugActive("BUG-022") && !name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    await db.users.update(user.id, { name });
    toast.success("Profile updated.");
  }

  return (
    <div className="mx-auto max-w-sm space-y-4">
      <h1 className="text-xl font-bold">Profile</h1>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={user.email} disabled />
      </div>
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
}

export default function ProfilePage() {
  const { user, isLoggedIn } = useCurrentUser();

  if (!isLoggedIn || !user) {
    return <p className="text-sm text-muted-foreground">Please log in to view your profile.</p>;
  }

  return <ProfileForm key={user.id} user={user} />;
}

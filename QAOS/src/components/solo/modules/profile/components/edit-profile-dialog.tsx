"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil } from "lucide-react";
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
import { Textarea } from "@/components/solo/ui/textarea";
import { Label } from "@/components/solo/ui/label";
import { useAppStore } from "@/lib/solo/store/useAppStore";

const profileSchema = z.object({
  username: z.string().trim().min(1, "Username is required").max(40),
  bio: z.string().max(280).optional(),
  careerGoal: z.string().max(120).optional(),
  company: z.string().max(80).optional(),
  yearsExperience: z.number().min(0).max(60),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function EditProfileDialog() {
  const [open, setOpen] = useState(false);
  const profile = useAppStore((s) => s.profile);
  const updateProfile = useAppStore((s) => s.updateProfile);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile.username,
      bio: profile.bio,
      careerGoal: profile.careerGoal,
      company: profile.company,
      yearsExperience: profile.yearsExperience,
    },
  });

  function onSubmit(values: ProfileFormValues) {
    updateProfile({
      username: values.username,
      bio: values.bio ?? "",
      careerGoal: values.careerGoal ?? "",
      company: values.company ?? "",
      yearsExperience: values.yearsExperience,
    });
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) reset(profile);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Pencil className="h-3.5 w-3.5" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input id="username" {...register("username")} />
            {errors.username && <p className="text-xs text-red-400">{errors.username.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="company">Company</Label>
              <Input id="company" {...register("company")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="yearsExperience">Years Experience</Label>
              <Input
                id="yearsExperience"
                type="number"
                step="0.5"
                {...register("yearsExperience", { valueAsNumber: true })}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="careerGoal">Career Goal</Label>
            <Input id="careerGoal" {...register("careerGoal")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={3} {...register("bio")} />
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/solo/ui/card";
import { Switch } from "@/components/solo/ui/switch";
import { Label } from "@/components/solo/ui/label";
import { Button } from "@/components/solo/ui/button";
import { useMounted } from "@/lib/solo/hooks/useMounted";

export function AppearanceCard() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Switch between dark and light mode, or manage your unlocked accent themes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode-switch" className="normal-case text-sm text-foreground">
            Dark Mode
          </Label>
          {mounted && (
            <Switch
              id="dark-mode-switch"
              checked={theme !== "light"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          )}
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link href="/journey/inventory">Manage Accent Themes</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

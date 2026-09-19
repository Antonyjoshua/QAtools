import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap = Icons as unknown as Record<string, LucideIcon>;

export function BadgeIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] ?? Icons.Award;
  return <Icon className={className} />;
}

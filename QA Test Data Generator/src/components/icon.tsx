import {
  User,
  Landmark,
  Banknote,
  ShoppingCart,
  Braces,
  Database,
  FileDown,
  Bot,
  Smartphone,
  ShieldCheck,
  Terminal,
  Image as ImageIcon,
  FlaskConical,
  Users,
  QrCode,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  User,
  Landmark,
  Banknote,
  ShoppingCart,
  Braces,
  Database,
  FileDown,
  Bot,
  Smartphone,
  ShieldCheck,
  Terminal,
  Image: ImageIcon,
  FlaskConical,
  Users,
  QrCode,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICONS[name] ?? FlaskConical;
  return <Cmp className={className} />;
}

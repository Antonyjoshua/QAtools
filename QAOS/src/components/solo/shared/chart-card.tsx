import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/solo/ui/card";
import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  description,
  heightClassName = "h-64",
  children,
}: {
  title: string;
  description?: string;
  heightClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={cn(heightClassName)}>{children}</CardContent>
    </Card>
  );
}

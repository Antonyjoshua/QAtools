"use client";

import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { TestPlan } from "@/lib/testcases/types";

export function TestPlanList({
  plans,
  runCountByPlan,
}: {
  plans: TestPlan[];
  runCountByPlan: Map<string, number>;
}) {
  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-14 text-center">
        <ClipboardList className="size-6 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No test plans yet — create one to organize test cases into a release cycle.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Target release</TableHead>
            <TableHead>Test cases</TableHead>
            <TableHead>Runs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <Link href={`/testcases/plans/${p.id}`} className="font-medium hover:text-primary">
                  {p.name}
                </Link>
                {p.objective && <p className="line-clamp-1 text-xs text-muted-foreground">{p.objective}</p>}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{p.status}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{p.targetRelease || "—"}</TableCell>
              <TableCell>
                <Badge variant="outline">{p.testCaseIds.length}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{runCountByPlan.get(p.id) ?? 0}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

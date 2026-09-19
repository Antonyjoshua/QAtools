"use client";

import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Row {
  id: number;
  name: string;
  role: string;
  status: "Active" | "Inactive";
}

const ROWS: Row[] = [
  { id: 1, name: "Amy Tester", role: "QA Engineer", status: "Active" },
  { id: 2, name: "Ben Coder", role: "Developer", status: "Active" },
  { id: 3, name: "Cara Ops", role: "DevOps", status: "Inactive" },
  { id: 4, name: "Dev User", role: "QA Engineer", status: "Active" },
  { id: 5, name: "Ella Manager", role: "Product Manager", status: "Active" },
  { id: 6, name: "Finn Analyst", role: "Business Analyst", status: "Inactive" },
  { id: 7, name: "Grace Lead", role: "QA Lead", status: "Active" },
  { id: 8, name: "Hank Support", role: "Support Engineer", status: "Active" },
  { id: 9, name: "Ivy Designer", role: "UX Designer", status: "Inactive" },
  { id: 10, name: "Jack Sales", role: "Sales Engineer", status: "Active" },
  { id: 11, name: "Kim Security", role: "Security Engineer", status: "Active" },
  { id: 12, name: "Leo Data", role: "Data Engineer", status: "Inactive" },
];

type SortKey = keyof Row;
const PAGE_SIZE = 5;

export default function TablesPage() {
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const copy = [...ROWS];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageRows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  const columns: { key: SortKey; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Click a column header to sort. Practice locating rows by index, by cell text, and
        navigating pagination.
      </p>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
              {columns.map((col) => (
                <th key={col.key} className="p-2">
                  <button
                    type="button"
                    data-testid={`sort-${col.key}`}
                    onClick={() => toggleSort(col.key)}
                    className="flex items-center gap-1 font-medium hover:text-foreground"
                  >
                    {col.label}
                    {sortKey === col.key &&
                      (sortDir === "asc" ? (
                        <ChevronUp className="size-3" />
                      ) : (
                        <ChevronDown className="size-3" />
                      ))}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.id} data-testid={`table-row-${row.id}`} className="border-b border-border last:border-0">
                <td className="p-2">{row.id}</td>
                <td className="p-2">{row.name}</td>
                <td className="p-2 text-muted-foreground">{row.role}</td>
                <td className="p-2">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground" data-testid="page-indicator">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            data-testid="prev-page"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <Button
            size="sm"
            variant="outline"
            data-testid="next-page"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

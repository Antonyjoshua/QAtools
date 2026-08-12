"use client";

import * as React from "react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type RowSelectionState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, Columns3, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriorityBadge, SeverityBadge, StatusBadge, AutomationBadge } from "@/components/testcases/shared/badges";
import type { TestCase, TestCaseStatus } from "@/lib/testcases/types";
import { TEST_CASE_STATUSES } from "@/lib/testcases/types";
import { bulkDeleteTestCases, bulkUpdateTestCases } from "@/lib/testcases/repo/testcases-repo";
import { useTestManagementSettings } from "@/lib/testcases/settings-store";

const columnHelper = createColumnHelper<TestCase>();

export function TestCaseTable({ testCases }: { testCases: TestCase[] }) {
  const currentUser = useTestManagementSettings((s) => s.currentUser);
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "updatedAt", desc: true }]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const columns = React.useMemo(
    () => [
      columnHelper.display({
        id: "select",
        size: 36,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(Boolean(v))}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(Boolean(v))} aria-label="Select row" />
        ),
      }),
      columnHelper.accessor("displayId", { header: "ID", size: 90 }),
      columnHelper.accessor("title", {
        header: "Title",
        size: 280,
        cell: ({ row }) => (
          <Link href={`/testcases/case/${row.original.id}`} className="font-medium hover:underline">
            {row.original.title}
          </Link>
        ),
      }),
      columnHelper.accessor("priority", { header: "Priority", size: 110, cell: ({ getValue }) => <PriorityBadge value={getValue()} /> }),
      columnHelper.accessor("severity", { header: "Severity", size: 110, cell: ({ getValue }) => <SeverityBadge value={getValue()} /> }),
      columnHelper.accessor("status", { header: "Status", size: 120, cell: ({ getValue }) => <StatusBadge value={getValue()} /> }),
      columnHelper.accessor("type", { header: "Type", size: 110 }),
      columnHelper.accessor("module", { header: "Module", size: 130 }),
      columnHelper.accessor("automationStatus", {
        header: "Automation",
        size: 140,
        cell: ({ getValue }) => <AutomationBadge value={getValue()} />,
      }),
      columnHelper.accessor("author", { header: "Author", size: 110 }),
      columnHelper.accessor("updatedAt", {
        header: "Updated",
        size: 120,
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: testCases,
    columns,
    state: { sorting, rowSelection, columnVisibility },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: "onChange",
    getRowId: (row) => row.id,
    initialState: { pagination: { pageSize: 25 } },
  });

  const selectedIds = Object.keys(rowSelection);

  async function handleBulkStatus(status: TestCaseStatus) {
    await bulkUpdateTestCases(selectedIds, { status }, currentUser);
    setRowSelection({});
  }

  async function handleBulkDelete() {
    if (!window.confirm(`Delete ${selectedIds.length} test case(s)? This cannot be undone.`)) return;
    await bulkDeleteTestCases(selectedIds);
    setRowSelection({});
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        {selectedIds.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5">
            <span className="text-xs font-medium">{selectedIds.length} selected</span>
            <Select onValueChange={(v) => handleBulkStatus(v as TestCaseStatus)}>
              <SelectTrigger className="h-7 w-40 text-xs">
                <SelectValue placeholder="Set status…" />
              </SelectTrigger>
              <SelectContent>
                {TEST_CASE_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-destructive" onClick={handleBulkDelete}>
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </div>
        ) : (
          <span />
        )}
        <Popover>
          <PopoverTrigger
            render={
              <Button variant="outline" size="sm" className="gap-1.5">
                <Columns3 className="size-3.5" />
                Columns
              </Button>
            }
          />
          <PopoverContent align="end" className="w-48 p-2">
            <div className="flex flex-col gap-1">
              {table.getAllLeafColumns().filter((c) => c.id !== "select").map((column) => (
                <label key={column.id} className="flex items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-accent/50">
                  <Checkbox checked={column.getIsVisible()} onCheckedChange={(v) => column.toggleVisibility(Boolean(v))} />
                  <span className="capitalize">{String(column.columnDef.header)}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm" style={{ width: table.getTotalSize() }}>
          <thead className="sticky top-0 z-10 bg-card">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="relative px-3 py-2 text-left text-xs font-semibold text-muted-foreground select-none"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className="flex items-center gap-1 hover:text-foreground disabled:cursor-default"
                        onClick={header.column.getToggleSortingHandler()}
                        disabled={header.column.id === "select"}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && header.column.id !== "select" && <ArrowUpDown className="size-3" />}
                      </button>
                    )}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className="absolute top-0 right-0 h-full w-1 cursor-col-resize touch-none select-none hover:bg-primary/40"
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-accent/30">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={{ width: cell.column.getSize() }} className="px-3 py-2 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-10 text-center text-sm text-muted-foreground">
                  No test cases match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="size-7" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="size-3.5" />
          </Button>
          <Button variant="outline" size="icon" className="size-7" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

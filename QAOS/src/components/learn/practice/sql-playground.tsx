"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SEED_SQL = `
CREATE TABLE departments (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO departments VALUES (1, 'Engineering'), (2, 'QA'), (3, 'Sales');

CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department_id INTEGER, salary INTEGER);
INSERT INTO employees VALUES
  (1, 'Alice Chen', 2, 78000),
  (2, 'Brian Osei', 1, 95000),
  (3, 'Carla Gomez', 2, 82000),
  (4, 'David Kim', 3, 61000),
  (5, 'Elena Petrova', 1, 105000),
  (6, 'Farid Khan', 2, 79000);
`;

const SAMPLE_QUERIES = [
  { label: "All employees", sql: "SELECT * FROM employees;" },
  { label: "Employees with department name", sql: "SELECT e.name, e.salary, d.name AS department\nFROM employees e\nJOIN departments d ON d.id = e.department_id;" },
  { label: "Average salary per department", sql: "SELECT d.name, AVG(e.salary) AS avg_salary\nFROM employees e\nJOIN departments d ON d.id = e.department_id\nGROUP BY d.name;" },
  { label: "Highest-paid employee", sql: "SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 1;" },
];

type QueryResult = { columns: string[]; values: (string | number | null)[][] };

export function SqlPlayground() {
  const dbRef = React.useRef<import("sql.js").Database | null>(null);
  const [ready, setReady] = React.useState(false);
  const [sql, setSql] = React.useState(SAMPLE_QUERIES[0].sql);
  const [result, setResult] = React.useState<QueryResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const initSqlJs = (await import("sql.js")).default;
      const SQL = await initSqlJs({ locateFile: () => "/sql-wasm.wasm" });
      if (cancelled) return;
      const database = new SQL.Database();
      database.run(SEED_SQL);
      dbRef.current = database;
      setReady(true);
    })();
    return () => {
      cancelled = true;
      dbRef.current?.close();
    };
  }, []);

  function runQuery() {
    if (!dbRef.current) return;
    try {
      const res = dbRef.current.exec(sql);
      setError(null);
      setResult((res[0] as QueryResult | undefined) ?? { columns: [], values: [] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Query failed");
      setResult(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/learn/practice" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Practice Zone
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">SQL Playground</h1>
      <p className="mt-1 text-muted-foreground">A real, in-browser SQLite database — practice queries with zero setup.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Schema</p>
          <div className="rounded-lg border border-border p-3 text-xs">
            <p className="font-mono font-semibold">departments</p>
            <p className="text-muted-foreground">id, name</p>
            <p className="mt-2 font-mono font-semibold">employees</p>
            <p className="text-muted-foreground">id, name, department_id, salary</p>
          </div>
          <p className="mt-4 mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Try it</p>
          <div className="flex flex-col gap-1.5">
            {SAMPLE_QUERIES.map((q) => (
              <button key={q.label} type="button" onClick={() => setSql(q.sql)} className="rounded-md border border-border px-2 py-1.5 text-left text-xs hover:bg-accent/50">
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Textarea value={sql} onChange={(e) => setSql(e.target.value)} rows={6} className="font-mono text-sm" spellCheck={false} />
          <div className="mt-2 flex items-center gap-2">
            <Button size="sm" className="gap-1.5" disabled={!ready} onClick={runQuery}>
              <Play className="size-3.5" />
              Run Query
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setSql(SAMPLE_QUERIES[0].sql)}>
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
            {!ready && <span className="text-xs text-muted-foreground">Loading SQLite engine…</span>}
          </div>

          {error && <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

          {result && (
            <div className="mt-3 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/40">
                    {result.columns.map((c) => (
                      <th key={c} className="border-b border-border px-2 py-1.5 text-left font-medium">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.values.map((row, i) => (
                    <tr key={i} className={i % 2 === 1 ? "bg-muted/20" : undefined}>
                      {row.map((cell, j) => (
                        <td key={j} className="border-b border-border/60 px-2 py-1.5 font-mono">
                          {cell === null ? <span className="text-muted-foreground">NULL</span> : String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {result.values.length === 0 && <p className="p-3 text-center text-muted-foreground">Query ran successfully — no rows returned.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

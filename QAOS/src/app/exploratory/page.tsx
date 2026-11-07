"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { Radar, Play, Clock, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { db } from "@/lib/exploratory/db";
import { deleteCharter } from "@/lib/exploratory/repo/charters-repo";
import { createSession } from "@/lib/exploratory/repo/sessions-repo";
import { NewCharterDialog } from "@/components/exploratory/new-charter-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SessionStatusBadge } from "@/components/exploratory/status-badge";
import type { Charter, Session } from "@/lib/exploratory/types";

const EMPTY_CHARTERS: Charter[] = [];
const EMPTY_SESSIONS: Session[] = [];

export default function ExploratoryPage() {
  const router = useRouter();
  const [expandedCharterId, setExpandedCharterId] = React.useState<string | null>(null);
  const charters = useLiveQuery(() => db.charters.orderBy("createdAt").reverse().toArray(), []) ?? EMPTY_CHARTERS;
  const sessions = useLiveQuery(() => db.sessions.toArray(), []) ?? EMPTY_SESSIONS;

  const sessionsByCharter = React.useMemo(() => {
    const map = new Map<string, typeof sessions>();
    for (const s of sessions) map.set(s.charterId, [...(map.get(s.charterId) ?? []), s]);
    return map;
  }, [sessions]);

  async function handleStartSession(charterId: string) {
    const session = await createSession(charterId, "You");
    router.push(`/exploratory/session/${session.id}`);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Exploratory Testing</h1>
          <p className="mt-1 text-sm text-muted-foreground">Charter-driven, session-based exploratory testing — timed sessions with a running log.</p>
        </div>
        <NewCharterDialog />
      </div>

      {charters.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Radar className="size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No charters yet — create one to start your first session.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {charters.map((c) => {
            const charterSessions = (sessionsByCharter.get(c.id) ?? []).slice().sort((a, b) => b.createdAt - a.createdAt);
            const count = charterSessions.length;
            const expanded = expandedCharterId === c.id;
            return (
              <div key={c.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium tracking-tight">{c.title}</h3>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete charter "${c.title}" and its ${count} session(s)?`)) void deleteCharter(c.id);
                    }}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Delete ${c.title}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">{c.mission}</p>
                {c.areas.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {c.areas.map((a) => (
                      <Badge key={a} variant="outline" className="text-[10px] font-normal">
                        {a}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {c.targetDurationMinutes}m target
                    </span>
                  </div>
                  <Button size="sm" className="gap-1.5" onClick={() => handleStartSession(c.id)}>
                    <Play className="size-3.5" />
                    Start Session
                  </Button>
                </div>
                {count > 0 && (
                  <div className="border-t border-border pt-2">
                    <button
                      type="button"
                      onClick={() => setExpandedCharterId(expanded ? null : c.id)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {expanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                      {count} session{count === 1 ? "" : "s"}
                    </button>
                    {expanded && (
                      <div className="mt-2 flex flex-col gap-1">
                        {charterSessions.map((s) => (
                          <Link
                            key={s.id}
                            href={`/exploratory/session/${s.id}`}
                            className="flex items-center justify-between rounded-md px-2 py-1 text-xs hover:bg-accent/50"
                          >
                            <span className="text-muted-foreground">{new Date(s.createdAt).toLocaleString()}</span>
                            <SessionStatusBadge status={s.status} className="text-[10px]" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

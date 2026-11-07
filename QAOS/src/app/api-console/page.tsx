"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/api-console/db";
import { createRequest, updateRequest } from "@/lib/api-console/repo/requests-repo";
import { pushHistory } from "@/lib/api-console/repo/history-repo";
import { sendRequest, runAssertions, type SendResult } from "@/lib/api-console/send-request";
import { CollectionSidebar } from "@/components/api-console/collection-sidebar";
import { RequestBuilder, type RequestDraft } from "@/components/api-console/request-builder";
import { ResponsePanel } from "@/components/api-console/response-panel";
import { HistoryPanel } from "@/components/api-console/history-panel";
import { toast } from "sonner";
import type { SavedRequest, AssertionResult, RequestHistoryEntry } from "@/lib/api-console/types";

const BLANK_DRAFT: RequestDraft = {
  name: "",
  method: "GET",
  url: "",
  params: [],
  headers: [],
  bodyType: "none",
  body: "",
  assertions: [],
};

export default function ApiConsolePage() {
  const [draft, setDraft] = React.useState<RequestDraft>(BLANK_DRAFT);
  const [selectedRequestId, setSelectedRequestId] = React.useState<string | null>(null);
  const [activeCollectionId, setActiveCollectionId] = React.useState<string | null>(null);
  const [sending, setSending] = React.useState(false);
  const [result, setResult] = React.useState<SendResult | null>(null);
  const [assertionResults, setAssertionResults] = React.useState<AssertionResult[] | null>(null);

  const environments = useLiveQuery(() => db.environments.toArray(), []) ?? [];
  const activeEnvironment = environments.find((e) => e.isActive) ?? null;

  function handleDraftChange(patch: Partial<RequestDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function handleSelectRequest(request: SavedRequest) {
    setSelectedRequestId(request.id);
    setActiveCollectionId(request.collectionId);
    setDraft({
      name: request.name,
      method: request.method,
      url: request.url,
      params: request.params,
      headers: request.headers,
      bodyType: request.bodyType,
      body: request.body,
      assertions: request.assertions,
    });
    setResult(null);
    setAssertionResults(null);
  }

  function handleNewRequest(collectionId: string) {
    setSelectedRequestId(null);
    setActiveCollectionId(collectionId);
    setDraft(BLANK_DRAFT);
    setResult(null);
    setAssertionResults(null);
  }

  function handleReplayHistory(entry: RequestHistoryEntry) {
    setDraft((prev) => ({ ...prev, method: entry.method, url: entry.url, name: entry.requestName || prev.name }));
    setResult(null);
    setAssertionResults(null);
  }

  async function handleSend() {
    if (!draft.url.trim()) return;
    setSending(true);
    try {
      const sendResult = await sendRequest(draft, activeEnvironment);
      const results = sendResult.error ? [] : runAssertions(draft.assertions, sendResult);
      setResult(sendResult);
      setAssertionResults(results);
      await pushHistory({
        requestId: selectedRequestId,
        requestName: draft.name || draft.url,
        method: draft.method,
        url: draft.url,
        status: sendResult.error ? null : sendResult.status,
        statusText: sendResult.statusText,
        durationMs: sendResult.durationMs,
        ok: sendResult.ok,
        assertionResults: results,
      });
      if (sendResult.error) toast.error(sendResult.error);
    } finally {
      setSending(false);
    }
  }

  async function handleSave() {
    if (!activeCollectionId) return;
    const name = draft.name.trim() || draft.url || "Untitled request";
    if (selectedRequestId) {
      await updateRequest(selectedRequestId, { ...draft, name });
      toast.success("Request saved");
    } else {
      const saved = await createRequest({ ...draft, name, collectionId: activeCollectionId });
      setSelectedRequestId(saved.id);
      toast.success("Request saved");
    }
  }

  return (
    <div className="grid h-[calc(100vh-56px)] grid-cols-1 md:grid-cols-[260px_1fr]">
      <CollectionSidebar selectedRequestId={selectedRequestId} onSelectRequest={handleSelectRequest} onNewRequest={handleNewRequest} />

      <div className="flex min-w-0 flex-col gap-4 overflow-y-auto p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">API Console</h1>
            <p className="text-sm text-muted-foreground">Build, send, and assert on API requests — sent via a same-origin proxy so CORS doesn&rsquo;t block you.</p>
          </div>
          <HistoryPanel onReplay={handleReplayHistory} />
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <RequestBuilder
            draft={draft}
            onChange={handleDraftChange}
            onSend={handleSend}
            onSave={handleSave}
            sending={sending}
            canSave={Boolean(activeCollectionId)}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <ResponsePanel result={result} assertionResults={assertionResults} />
        </div>
      </div>
    </div>
  );
}

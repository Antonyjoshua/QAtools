"use client";

import { Save, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { KeyValueEditor } from "@/components/api-console/key-value-editor";
import { AssertionsEditor } from "@/components/api-console/assertions-editor";
import { HTTP_METHODS, BODY_TYPES } from "@/lib/api-console/types";
import type { HttpMethod, KeyValue, BodyType, Assertion } from "@/lib/api-console/types";

export interface RequestDraft {
  name: string;
  method: HttpMethod;
  url: string;
  params: KeyValue[];
  headers: KeyValue[];
  bodyType: BodyType;
  body: string;
  assertions: Assertion[];
}

export function RequestBuilder({
  draft,
  onChange,
  onSend,
  onSave,
  sending,
  canSave,
}: {
  draft: RequestDraft;
  onChange: (patch: Partial<RequestDraft>) => void;
  onSend: () => void;
  onSave: () => void;
  sending: boolean;
  canSave: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Input
          value={draft.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Untitled request"
          className="h-8 max-w-xs text-sm font-medium"
        />
      </div>

      <div className="flex items-center gap-2">
        <Select value={draft.method} onValueChange={(v) => v !== null && onChange({ method: v as HttpMethod })}>
          <SelectTrigger className="h-9 w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {HTTP_METHODS.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={draft.url}
          onChange={(e) => onChange({ url: e.target.value })}
          placeholder="https://api.example.com/users or {{baseUrl}}/users"
          className="h-9 flex-1 font-mono text-sm"
        />
        <Button onClick={onSend} disabled={sending || !draft.url.trim()} className="gap-1.5">
          {sending ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
          Send
        </Button>
        <Button variant="outline" onClick={onSave} disabled={!canSave} className="gap-1.5">
          <Save className="size-3.5" />
          Save
        </Button>
      </div>

      <Tabs defaultValue="params">
        <TabsList>
          <TabsTrigger value="params">
            Params
            {draft.params.filter((p) => p.enabled).length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 text-[10px]">
                {draft.params.filter((p) => p.enabled).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="headers">
            Headers
            {draft.headers.filter((h) => h.enabled).length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 text-[10px]">
                {draft.headers.filter((h) => h.enabled).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="assertions">
            Assertions
            {draft.assertions.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 text-[10px]">
                {draft.assertions.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="params" className="pt-3">
          <KeyValueEditor rows={draft.params} onChange={(rows) => onChange({ params: rows })} />
        </TabsContent>

        <TabsContent value="headers" className="pt-3">
          <KeyValueEditor rows={draft.headers} onChange={(rows) => onChange({ headers: rows })} keyPlaceholder="Header" valuePlaceholder="Value" />
        </TabsContent>

        <TabsContent value="body" className="pt-3">
          <div className="flex flex-col gap-2">
            <Select value={draft.bodyType} onValueChange={(v) => v !== null && onChange({ bodyType: v as BodyType })}>
              <SelectTrigger className="h-8 w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BODY_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {draft.bodyType !== "none" && (
              <Textarea
                value={draft.body}
                onChange={(e) => onChange({ body: e.target.value })}
                rows={10}
                className="font-mono text-sm"
                placeholder={draft.bodyType === "json" ? '{\n  "key": "value"\n}' : "Request body…"}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="assertions" className="pt-3">
          <AssertionsEditor assertions={draft.assertions} onChange={(assertions) => onChange({ assertions })} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

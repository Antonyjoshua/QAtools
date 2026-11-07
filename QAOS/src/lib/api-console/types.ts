export const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"] as const;
export type HttpMethod = (typeof HTTP_METHODS)[number];

export interface KeyValue {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export const BODY_TYPES = ["none", "json", "text", "form"] as const;
export type BodyType = (typeof BODY_TYPES)[number];

export const ASSERTION_TYPES = ["status", "header", "bodyContains", "jsonPath", "responseTime"] as const;
export type AssertionType = (typeof ASSERTION_TYPES)[number];

export interface Assertion {
  id: string;
  type: AssertionType;
  /** header name (type "header") or JSON path like "data.id" (type "jsonPath"). Unused otherwise. */
  key?: string;
  /** Expected value — a status code as a string (type "status"), a substring (type "bodyContains"),
   * a header value (type "header"), or a JSON-path value (type "jsonPath"). Unused for "responseTime". */
  expected?: string;
  /** Max allowed response time in ms (type "responseTime" only). */
  maxMs?: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  createdAt: number;
}

export interface SavedRequest {
  id: string;
  collectionId: string;
  name: string;
  method: HttpMethod;
  url: string;
  params: KeyValue[];
  headers: KeyValue[];
  bodyType: BodyType;
  body: string;
  assertions: Assertion[];
  createdAt: number;
  updatedAt: number;
}

export interface Environment {
  id: string;
  name: string;
  variables: KeyValue[];
  isActive: boolean;
  createdAt: number;
}

export interface AssertionResult {
  assertionId: string;
  description: string;
  passed: boolean;
  message: string;
}

export interface RequestHistoryEntry {
  id: string;
  requestId: string | null;
  requestName: string;
  method: HttpMethod;
  url: string;
  status: number | null;
  statusText: string;
  durationMs: number;
  ok: boolean;
  assertionResults: AssertionResult[];
  timestamp: number;
}

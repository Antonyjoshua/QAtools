import { db } from "../db";
import { uid } from "../id";
import type { SavedRequest, HttpMethod, KeyValue, BodyType, Assertion } from "../types";

export interface NewSavedRequestInput {
  collectionId: string;
  name: string;
  method: HttpMethod;
  url: string;
  params: KeyValue[];
  headers: KeyValue[];
  bodyType: BodyType;
  body: string;
  assertions: Assertion[];
}

export async function listRequests(collectionId: string): Promise<SavedRequest[]> {
  return db.requests.where("collectionId").equals(collectionId).sortBy("createdAt");
}

export async function getRequest(id: string): Promise<SavedRequest | undefined> {
  return db.requests.get(id);
}

export async function createRequest(input: NewSavedRequestInput): Promise<SavedRequest> {
  const now = Date.now();
  const request: SavedRequest = { ...input, id: uid(), createdAt: now, updatedAt: now };
  await db.requests.add(request);
  return request;
}

export async function updateRequest(id: string, patch: Partial<SavedRequest>): Promise<void> {
  await db.requests.update(id, { ...patch, updatedAt: Date.now() });
}

export async function deleteRequest(id: string): Promise<void> {
  await db.requests.delete(id);
}

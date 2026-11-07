import { db } from "../db";
import { uid } from "../id";
import type { Collection } from "../types";

export async function listCollections(): Promise<Collection[]> {
  return db.collections.orderBy("createdAt").toArray();
}

export async function createCollection(name: string, description = ""): Promise<Collection> {
  const collection: Collection = { id: uid(), name, description, createdAt: Date.now() };
  await db.collections.add(collection);
  return collection;
}

export async function renameCollection(id: string, name: string): Promise<void> {
  await db.collections.update(id, { name });
}

export async function deleteCollection(id: string): Promise<void> {
  await db.transaction("rw", [db.collections, db.requests], async () => {
    await db.collections.delete(id);
    await db.requests.where("collectionId").equals(id).delete();
  });
}

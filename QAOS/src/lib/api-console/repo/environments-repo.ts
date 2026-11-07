import { db } from "../db";
import { uid } from "../id";
import type { Environment, KeyValue } from "../types";

export async function listEnvironments(): Promise<Environment[]> {
  return db.environments.orderBy("createdAt").toArray();
}

export async function createEnvironment(name: string, variables: KeyValue[] = []): Promise<Environment> {
  const environment: Environment = { id: uid(), name, variables, isActive: false, createdAt: Date.now() };
  await db.environments.add(environment);
  return environment;
}

export async function updateEnvironment(id: string, patch: Partial<Environment>): Promise<void> {
  await db.environments.update(id, patch);
}

export async function deleteEnvironment(id: string): Promise<void> {
  await db.environments.delete(id);
}

/** Only one environment is active at a time — activating one deactivates the rest. */
export async function setActiveEnvironment(id: string | null): Promise<void> {
  await db.transaction("rw", db.environments, async () => {
    const all = await db.environments.toArray();
    for (const env of all) {
      if (env.isActive !== (env.id === id)) {
        await db.environments.update(env.id, { isActive: env.id === id });
      }
    }
  });
}

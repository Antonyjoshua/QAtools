import { db } from "./db";
import { uid } from "@/lib/playground/id";
import { isBugActive } from "@/lib/playground/bug-registry/toggle-store";
import { TEST_ACCOUNTS } from "./constants";

export async function seedTestAccountsIfNeeded(): Promise<void> {
  // A single rw transaction makes the exists-check-then-insert atomic — IndexedDB serializes
  // overlapping rw transactions on the same store, so two concurrent callers (e.g. React Strict
  // Mode's double effect invocation) can't both see "missing" and race a duplicate insert.
  await db.transaction("rw", db.users, async () => {
    for (let i = 0; i < TEST_ACCOUNTS.length; i++) {
      const id = `seed-user-${i + 1}`;
      if (await db.users.get(id)) continue;
      const acc = TEST_ACCOUNTS[i];
      await db.users.add({
        id,
        email: acc.email,
        password: acc.password,
        name: i === 0 ? "Amy Tester" : "Dev User",
        createdAt: new Date().toISOString(),
      });
    }
  });
}

export interface LoginResult {
  ok: boolean;
  userId?: string;
  error?: string;
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await db.users.where("email").equals(normalizedEmail).first();

  if (!user) {
    // BUG-001: should say "No account found with that email" — instead always blames the password.
    return { ok: false, error: isBugActive("BUG-001") ? "Invalid password." : "No account found with that email." };
  }
  if (user.password !== password) {
    return { ok: false, error: "Invalid password." };
  }
  return { ok: true, userId: user.id };
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResult {
  ok: boolean;
  userId?: string;
  error?: string;
}

export async function register(input: RegisterInput): Promise<RegisterResult> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const existing = await db.users.where("email").equals(normalizedEmail).first();
  if (existing) {
    return { ok: false, error: "An account with that email already exists." };
  }

  // BUG-002: no minimum length enforced when active — a 1-character password is accepted.
  const minLength = isBugActive("BUG-002") ? 1 : 8;
  if (input.password.length < minLength) {
    return { ok: false, error: `Password must be at least ${minLength} characters.` };
  }

  const id = uid();
  await db.users.add({
    id,
    email: normalizedEmail,
    password: input.password,
    name: input.name.trim(),
    createdAt: new Date().toISOString(),
  });
  return { ok: true, userId: id };
}

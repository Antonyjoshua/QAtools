import { db } from "./db";
import { uid } from "./id";
import { doc, orderedList } from "./template-builders";
import type { Project, Module, Feature, BuildVersion, TestEnvironment, Label, ReusableStep } from "./types";

const LABEL_SEED: { name: string; color: string }[] = [
  { name: "Regression", color: "oklch(0.577 0.245 27)" },
  { name: "Smoke", color: "oklch(0.75 0.16 75)" },
  { name: "High Risk", color: "oklch(0.64 0.19 42)" },
  { name: "Release Blocker", color: "oklch(0.577 0.245 27)" },
  { name: "API", color: "oklch(0.6 0.18 280)" },
  { name: "UI", color: "oklch(0.58 0.135 168)" },
  { name: "Calculation", color: "oklch(0.6 0.16 45)" },
  { name: "Localization", color: "oklch(0.6 0.14 320)" },
];

const REUSABLE_STEPS_SEED: { name: string; steps: string[] }[] = [
  { name: "Login", steps: ["Navigate to the login page.", "Enter valid username and password.", "Click the Login button.", "Verify the dashboard loads."] },
  { name: "Create User", steps: ["Navigate to Admin > Users.", "Click 'Add User'.", "Fill in required user details.", "Click Save."] },
  { name: "Add Product", steps: ["Navigate to the product catalog.", "Click 'Add Product'.", "Fill in product name, price, and category.", "Click Save."] },
  { name: "Checkout", steps: ["Add a product to the cart.", "Navigate to the cart page.", "Click 'Proceed to Checkout'.", "Enter shipping and payment details.", "Click 'Place Order'."] },
  { name: "Generate Report", steps: ["Navigate to the Reports section.", "Select the report type and date range.", "Click 'Generate'.", "Verify the report loads with expected data."] },
  { name: "Upload File", steps: ["Navigate to the upload section.", "Click 'Choose File' or drag a file into the drop zone.", "Select a valid file.", "Click 'Upload'.", "Verify the file appears in the list."] },
  { name: "Submit Form", steps: ["Navigate to the form page.", "Fill in all required fields with valid data.", "Click 'Submit'.", "Verify the success confirmation appears."] },
];

// Memoized so React's dev-mode double-invoked effects (DbProvider's useEffect
// fires twice in a StrictMode dev render) share one run instead of each
// racing past the `projectCount === 0` check and both inserting a demo
// project — that race is what produced the duplicate "Demo E-Commerce App"
// project reported in practice.
let seedingPromise: Promise<void> | undefined;

export function ensureSeeded(): Promise<void> {
  if (!seedingPromise) seedingPromise = runSeed();
  return seedingPromise;
}

/**
 * Cleans up duplicates the pre-fix race condition may have already written
 * (each of Projects/Labels/ReusableSteps had its own independent `count === 0`
 * guard, all vulnerable to the same double-invoke race). Reparents anything
 * pointing at a duplicate onto the kept/canonical record before deleting the
 * duplicate. Safe to run every time — a no-op once there's nothing to merge.
 */
async function dedupeSeedData(): Promise<void> {
  const byName = <T extends { id: string }>(items: T[], name: (t: T) => string) => {
    const map = new Map<string, T[]>();
    for (const item of items) map.set(name(item), [...(map.get(name(item)) ?? []), item]);
    return map;
  };

  // Projects (only "Demo E-Commerce App" is ever seeded here; keep the oldest).
  for (const [, projects] of byName(await db.projects.toArray(), (p) => p.name)) {
    if (projects.length <= 1) continue;
    const [canonical, ...dupes] = projects.sort((a, b) => a.createdAt - b.createdAt);
    for (const dup of dupes) {
      for (const b of await db.buildVersions.where("projectId").equals(dup.id).toArray()) await db.buildVersions.update(b.id, { projectId: canonical.id });
      for (const e of await db.environments.where("projectId").equals(dup.id).toArray()) await db.environments.update(e.id, { projectId: canonical.id });
      for (const m of await db.modules.where("projectId").equals(dup.id).toArray()) await db.modules.update(m.id, { projectId: canonical.id });
      for (const bug of await db.bugs.where("projectId").equals(dup.id).toArray()) await db.bugs.update(bug.id, { projectId: canonical.id });
    }
    await db.projects.bulkDelete(dupes.map((d) => d.id));
  }

  // Modules within each project (reparent features/bugs off duplicates first).
  for (const project of await db.projects.toArray()) {
    for (const [, modules] of byName(await db.modules.where("projectId").equals(project.id).toArray(), (m) => m.name)) {
      if (modules.length <= 1) continue;
      const [canonical, ...dupes] = modules;
      for (const dup of dupes) {
        for (const f of await db.features.where("moduleId").equals(dup.id).toArray()) await db.features.update(f.id, { moduleId: canonical.id });
        for (const bug of await db.bugs.where("moduleId").equals(dup.id).toArray()) await db.bugs.update(bug.id, { moduleId: canonical.id });
      }
      await db.modules.bulkDelete(dupes.map((d) => d.id));
    }
  }

  // Features within each module.
  for (const module_ of await db.modules.toArray()) {
    for (const [, features] of byName(await db.features.where("moduleId").equals(module_.id).toArray(), (f) => f.name)) {
      if (features.length <= 1) continue;
      const [, ...dupes] = features;
      await db.features.bulkDelete(dupes.map((d) => d.id));
    }
  }

  // Labels and reusable steps are global lists, not relationally referenced
  // by id (bugs store label *names*, and reusable steps are copy-in-only), so
  // deduping them is a straight delete of the extras.
  for (const [, labels] of byName(await db.labels.toArray(), (l) => l.name)) {
    if (labels.length <= 1) continue;
    const [, ...dupes] = labels;
    await db.labels.bulkDelete(dupes.map((d) => d.id));
  }
  for (const [, steps] of byName(await db.reusableSteps.toArray(), (s) => s.name)) {
    if (steps.length <= 1) continue;
    const [, ...dupes] = steps;
    await db.reusableSteps.bulkDelete(dupes.map((d) => d.id));
  }
}

async function runSeed(): Promise<void> {
  await dedupeSeedData();
  const projectCount = await db.projects.count();
  if (projectCount === 0) {
    const projectId = uid();
    const project: Project = {
      id: projectId,
      name: "Demo E-Commerce App",
      description: "Sample project seeded to show BugForge's structure — rename or delete anytime.",
      isFavorite: true,
      createdAt: Date.now(),
    };
    await db.projects.add(project);

    const moduleNames = ["Authentication", "Product Catalog", "Cart", "Checkout", "Payments", "Search", "User Profile", "Notifications"];
    const modules: Module[] = moduleNames.map((name) => ({ id: uid(), projectId, name, isFavorite: false }));
    await db.modules.bulkAdd(modules);

    const featureByModule: Record<string, string[]> = {
      Authentication: ["Login", "Signup", "Forgot Password", "Social Login"],
      "Product Catalog": ["Product Listing", "Product Details", "Filters", "Sorting"],
      Cart: ["Add to Cart", "Update Quantity", "Remove Item"],
      Checkout: ["Shipping Info", "Order Review", "Order Confirmation"],
      Payments: ["Card Payment", "UPI Payment", "Wallet", "Refunds"],
      Search: ["Keyword Search", "Autocomplete", "Search Filters"],
      "User Profile": ["Edit Profile", "Order History", "Saved Addresses"],
      Notifications: ["Email Notifications", "Push Notifications"],
    };
    const features: Feature[] = [];
    for (const m of modules) {
      for (const fname of featureByModule[m.name] ?? []) {
        features.push({ id: uid(), moduleId: m.id, name: fname });
      }
    }
    await db.features.bulkAdd(features);

    const builds: BuildVersion[] = [
      { id: uid(), projectId, version: "1.0.0", releaseName: "Initial Release", createdAt: Date.now() - 90 * 86400000 },
      { id: uid(), projectId, version: "1.1.0", releaseName: "Cart & Checkout Improvements", createdAt: Date.now() - 45 * 86400000 },
      { id: uid(), projectId, version: "1.2.0", releaseName: "Search Revamp", createdAt: Date.now() - 10 * 86400000 },
    ];
    await db.buildVersions.bulkAdd(builds);

    const environments: TestEnvironment[] = [
      { id: uid(), projectId, name: "QA", url: "https://qa.demo-shop.test" },
      { id: uid(), projectId, name: "Staging", url: "https://staging.demo-shop.test" },
      { id: uid(), projectId, name: "Production", url: "https://demo-shop.test" },
    ];
    await db.environments.bulkAdd(environments);
  }

  const labelCount = await db.labels.count();
  if (labelCount === 0) {
    const labels: Label[] = LABEL_SEED.map((l) => ({ id: uid(), name: l.name, color: l.color, isCustom: false }));
    await db.labels.bulkAdd(labels);
  }

  const stepCount = await db.reusableSteps.count();
  if (stepCount === 0) {
    const steps: ReusableStep[] = REUSABLE_STEPS_SEED.map((s) => ({
      id: uid(),
      name: s.name,
      contentJSON: doc(orderedList(s.steps)),
      contentText: s.steps.join(" "),
      createdAt: Date.now(),
    }));
    await db.reusableSteps.bulkAdd(steps);
  }
}

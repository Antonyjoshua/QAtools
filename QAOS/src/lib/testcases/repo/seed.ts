import { db } from "../db";
import { createProject } from "./projects-repo";
import { createFolder } from "./folders-repo";
import { createSuite } from "./suites-repo";
import { createTestCase, type NewTestCaseInput } from "./testcases-repo";
import { addStep } from "./steps-repo";
import { createExecution, recordResult } from "./execution-repo";
import { ensureTagsExist } from "./tags-repo";
import { createRequirement } from "./requirements-repo";

let seedPromise: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
  if (!seedPromise) seedPromise = doSeed();
  return seedPromise;
}

async function doSeed(): Promise<void> {
  const count = await db.projects.count();
  if (count > 0) return;

  const project = await createProject(
    "E-Commerce Platform",
    "Web and mobile storefront — checkout, orders, and account management."
  );
  await ensureTagsExist(project.id, ["regression", "smoke", "critical-path", "payments"]);
  await createRequirement(project.id, "REQ-101", "Users can sign in with email and password");
  await createRequirement(project.id, "REQ-142", "Checkout supports saved payment methods");

  const auth = await createFolder(project.id, "Authentication");
  const login = await createFolder(project.id, "Login", auth.id);
  await createFolder(project.id, "Registration", auth.id);
  await createFolder(project.id, "Password Reset", auth.id);
  const dashboard = await createFolder(project.id, "Dashboard");
  const orders = await createFolder(project.id, "Orders");
  const checkout = await createFolder(project.id, "Checkout");

  const loginSmoke = await createSuite(project.id, login.id, "Smoke Testing", "Critical login paths that must pass every build.");
  const loginRegression = await createSuite(project.id, login.id, "Regression", "Full login regression coverage.");
  await createSuite(project.id, login.id, "Sanity", "Quick sanity checks after a hotfix.");
  const checkoutSuite = await createSuite(project.id, checkout.id, "Checkout Flow", "End-to-end checkout scenarios.");
  const ordersApi = await createSuite(project.id, orders.id, "API Testing", "Orders service API contract tests.");
  await createSuite(project.id, dashboard.id, "Accessibility", "Keyboard and screen-reader coverage for the dashboard.");

  const author = "You";

  async function seedCase(input: Partial<NewTestCaseInput> & { suiteId: string; title: string }, steps: { action: string; expectedResult: string }[]) {
    const testCase = await createTestCase(
      {
        projectId: project.id,
        description: "",
        objective: "",
        module: "",
        feature: "",
        priority: "Medium",
        severity: "Major",
        type: "Functional",
        status: "Ready",
        requirementId: "",
        sprint: "Sprint 14",
        releaseVersion: "1.0.5",
        environment: "Staging",
        browser: "Chrome",
        device: "Desktop",
        os: "Windows",
        tags: [],
        author,
        reviewer: "",
        estimatedTimeMinutes: 5,
        automationStatus: "Not Automated",
        automationScriptLink: "",
        preconditions: "",
        testData: "",
        expectedResult: "",
        actualResult: "",
        notes: "",
        ...input,
      },
      author
    );
    for (const s of steps) {
      await addStep(testCase.id, s.action, s.expectedResult);
    }
    return testCase;
  }

  const c1 = await seedCase(
    {
      suiteId: loginSmoke.id,
      title: "Successful login with valid credentials",
      module: "Authentication",
      feature: "Login",
      priority: "Critical",
      severity: "Blocker",
      type: "Smoke",
      requirementId: "REQ-101",
      tags: ["smoke", "critical-path"],
      preconditions: "User account exists and is active.",
      testData: "email: qa@example.com / password: Test1234!",
    },
    [
      { action: "Navigate to the login page", expectedResult: "Login form is displayed" },
      { action: "Enter a valid email and password", expectedResult: "Fields accept input" },
      { action: "Click Sign In", expectedResult: "User is redirected to the dashboard" },
    ]
  );

  const c2 = await seedCase(
    {
      suiteId: loginSmoke.id,
      title: "Login fails with incorrect password",
      module: "Authentication",
      feature: "Login",
      priority: "High",
      severity: "Major",
      type: "Smoke",
      requirementId: "REQ-101",
      tags: ["smoke"],
    },
    [
      { action: "Navigate to the login page", expectedResult: "Login form is displayed" },
      { action: "Enter a valid email with an incorrect password", expectedResult: "Fields accept input" },
      { action: "Click Sign In", expectedResult: "An 'invalid credentials' error is shown and the user stays on the login page" },
    ]
  );

  await seedCase(
    {
      suiteId: loginRegression.id,
      title: "Login form validates empty fields",
      module: "Authentication",
      feature: "Login",
      priority: "Medium",
      severity: "Minor",
      type: "Regression",
      status: "Approved",
      tags: ["regression"],
    },
    [
      { action: "Navigate to the login page", expectedResult: "Login form is displayed" },
      { action: "Click Sign In without entering anything", expectedResult: "Inline validation errors appear on both fields" },
    ]
  );

  const c4 = await seedCase(
    {
      suiteId: checkoutSuite.id,
      title: "Checkout with a saved payment method",
      module: "Checkout",
      feature: "Payments",
      priority: "Critical",
      severity: "Blocker",
      type: "Functional",
      requirementId: "REQ-142",
      tags: ["critical-path", "payments"],
      automationStatus: "Automated",
      automationScriptLink: "https://ci.example.com/jobs/checkout-saved-payment",
    },
    [
      { action: "Add an item to the cart and proceed to checkout", expectedResult: "Checkout page loads with order summary" },
      { action: "Select a previously saved payment method", expectedResult: "Payment method is selected" },
      { action: "Click Place Order", expectedResult: "Order confirmation page is displayed and a confirmation email is queued" },
    ]
  );

  await seedCase(
    {
      suiteId: checkoutSuite.id,
      title: "Checkout blocks submission with an expired card",
      module: "Checkout",
      feature: "Payments",
      priority: "High",
      severity: "Major",
      type: "Functional",
      status: "In Review",
      tags: ["payments"],
    },
    [
      { action: "Proceed to checkout with an expired card on file", expectedResult: "Card is flagged as expired" },
      { action: "Attempt to place the order", expectedResult: "Order is blocked with a clear 'update payment method' message" },
    ]
  );

  await seedCase(
    {
      suiteId: ordersApi.id,
      title: "GET /orders/{id} returns order details",
      module: "Orders",
      feature: "Orders API",
      priority: "High",
      severity: "Major",
      type: "API",
      status: "Approved",
      automationStatus: "Automated",
      tags: ["regression"],
    },
    [
      { action: "Send GET /orders/{id} with a valid order id", expectedResult: "200 OK with the order payload" },
      { action: "Send GET /orders/{id} with an unknown id", expectedResult: "404 Not Found" },
    ]
  );

  await seedCase(
    {
      suiteId: ordersApi.id,
      title: "Cancel order transitions status to Cancelled",
      module: "Orders",
      feature: "Orders API",
      priority: "Medium",
      severity: "Major",
      type: "API",
      status: "Draft",
      tags: [],
    },
    [{ action: "Send POST /orders/{id}/cancel for a pending order", expectedResult: "Order status becomes Cancelled and a webhook fires" }]
  );

  // A run in progress with a couple of results recorded, so the execution dashboard has real data.
  const run = await createExecution({
    projectId: project.id,
    name: "Regression Sprint 14",
    description: "Full regression pass ahead of the 1.0.5 release.",
    environment: "Staging",
    build: "1.0.5",
    testCaseIds: [c1.id, c2.id, c4.id],
  });
  await db.executions.update(run.id, { status: "In Progress", startedAt: Date.now() - 1000 * 60 * 40 });
  const results = await db.executionResults.where("executionId").equals(run.id).toArray();
  const r1 = results.find((r) => r.testCaseId === c1.id);
  const r2 = results.find((r) => r.testCaseId === c2.id);
  if (r1) await recordResult(r1.id, "Pass", author, "Looks good on Chrome/Windows.", 42);
  if (r2) await recordResult(r2.id, "Fail", author, "Error message text does not match the copy deck.", 55);
}

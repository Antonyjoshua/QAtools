import type { GeneratorModule } from "../types";
import { buildPerson } from "./personal";
import { pick, randInt, uuidv4 } from "../random";

export const automationGenerators: GeneratorModule[] = [
  {
    slug: "selenium-test-data",
    name: "Selenium Test Data",
    category: "automation",
    description: "Login test users with expected outcomes for Selenium WebDriver suites.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 8,
    generate: (ctx) => {
      const p = buildPerson("US");
      const valid = ctx.index % 3 !== 0;
      return {
        testCaseId: `TC-SEL-${String(ctx.index + 1).padStart(3, "0")}`,
        username: p.email,
        password: valid ? p.password : "wrongPassword123",
        expected: valid ? "login_success" : "login_failure",
        browser: pick(["chrome", "firefox", "edge"]),
      };
    },
  },
  {
    slug: "playwright-fixture",
    name: "Playwright Fixture",
    category: "automation",
    description: "JSON fixture data for Playwright test setup / storageState-style user data.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 6,
    generate: () => {
      const p = buildPerson("US");
      return {
        user: { email: p.email, password: p.password, fullName: p.fullName, role: pick(["admin", "editor", "viewer"]) },
        baseURL: "https://staging.example-app.test",
        viewport: { width: 1280, height: 720 },
      };
    },
  },
  {
    slug: "cypress-fixture",
    name: "Cypress Fixture",
    category: "automation",
    description: "JSON fixture data matching Cypress's cy.fixture() format.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 6,
    generate: () => {
      const p = buildPerson("US");
      return {
        id: uuidv4(),
        email: p.email,
        password: p.password,
        profile: { firstName: p.firstName, lastName: p.lastName, city: p.city },
      };
    },
  },
  {
    slug: "robot-framework-data",
    name: "Robot Framework Variables",
    category: "automation",
    description: "*** Variables *** and *** Test Cases *** blocks for Robot Framework suites.",
    outputKind: "code",
    language: "robotframework",
    supportsBulk: true,
    defaultCount: 5,
    generate: (ctx) => {
      const p = buildPerson("US");
      const n = ctx.index + 1;
      return [
        `*** Test Cases ***`,
        `Login Test ${n}`,
        `    [Documentation]    Verify login with generated credentials`,
        `    Open Browser    https://example.test/login    chrome`,
        `    Input Text    id=username    ${p.email}`,
        `    Input Password    id=password    ${p.password}`,
        `    Click Button    id=submit`,
        `    Page Should Contain    Welcome, ${p.firstName}`,
        `    Close Browser`,
      ].join("\n");
    },
  },
  {
    slug: "testng-dataprovider",
    name: "TestNG @DataProvider",
    category: "automation",
    description: "Java TestNG @DataProvider method populated with generated rows.",
    outputKind: "code",
    language: "java",
    supportsBulk: false,
    defaultCount: 1,
    options: [{ key: "rows", label: "Rows", type: "number", default: 5, min: 1, max: 50 }],
    generate: (ctx) => {
      const rows = Number(ctx.options.rows ?? 5);
      const data = Array.from({ length: rows }, () => {
        const p = buildPerson("US");
        return `        { "${p.email}", "${p.password}", "${p.fullName}" }`;
      });
      return [
        `@DataProvider(name = "userLoginData")`,
        `public Object[][] userLoginData() {`,
        `    return new Object[][] {`,
        data.join(",\n"),
        `    };`,
        `}`,
      ].join("\n");
    },
  },
  {
    slug: "junit-dataset",
    name: "JUnit 5 @MethodSource Dataset",
    category: "automation",
    description: "Java JUnit 5 parameterized test data via Stream<Arguments>.",
    outputKind: "code",
    language: "java",
    supportsBulk: false,
    defaultCount: 1,
    options: [{ key: "rows", label: "Rows", type: "number", default: 5, min: 1, max: 50 }],
    generate: (ctx) => {
      const rows = Number(ctx.options.rows ?? 5);
      const data = Array.from({ length: rows }, () => {
        const p = buildPerson("US");
        return `            Arguments.of("${p.email}", "${p.password}", ${randInt(18, 65)})`;
      });
      return [
        `static Stream<Arguments> userProvider() {`,
        `    return Stream.of(`,
        data.join(",\n"),
        `    );`,
        `}`,
        ``,
        `@ParameterizedTest`,
        `@MethodSource("userProvider")`,
        `void testLogin(String email, String password, int age) {`,
        `    // assertions go here`,
        `}`,
      ].join("\n");
    },
  },
  {
    slug: "api-mock-data",
    name: "API Mock Data (Automation)",
    category: "automation",
    description: "Mock response payloads for stubbing HTTP calls in automated tests (WireMock / MSW / Playwright route).",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: (ctx) => {
      const p = buildPerson("US");
      return {
        request: { method: "GET", path: `/api/users/${ctx.index + 1}` },
        response: {
          status: 200,
          body: { id: ctx.index + 1, name: p.fullName, email: p.email, active: true },
        },
      };
    },
  },
  {
    slug: "bug-repro-data",
    name: "Bug Reproduction Data",
    category: "automation",
    description: "Structured input/steps/expected-vs-actual data to attach to a bug report.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 5,
    generate: (ctx) => {
      const p = buildPerson("US");
      return {
        bugId: `BUG-${String(1000 + ctx.index).padStart(4, "0")}`,
        title: pick(["Form submits with empty required field", "Session expires prematurely on refresh", "Pagination skips a page after filter", "Price rounds incorrectly on checkout", "Special characters break search"]),
        stepsToReproduce: [`Log in as ${p.email}`, "Navigate to affected page", "Perform the failing action", "Observe the result"],
        expected: "Operation completes without error",
        actual: "Unexpected error / incorrect state observed",
        environment: { browser: pick(["Chrome 124", "Firefox 126", "Safari 17"]), os: pick(["Windows 11", "macOS 14", "Ubuntu 22.04"]) },
        severity: pick(["Low", "Medium", "High", "Critical"]),
      };
    },
  },
];

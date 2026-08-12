import type { Exercise } from "./types";

export const EXERCISES: Exercise[] = [
  {
    id: "ex-bug-1",
    type: "bug-finding",
    title: "Spot the bugs in this login form spec",
    prompt:
      "A login form requirement says: \"The Login button should be enabled when the user enters an email and password, and clicking it logs the user in.\" Given only this requirement, list at least 5 things a tester should question or test that the requirement doesn't address.",
    modelSolution:
      "1) What counts as a valid email format, and is it validated client-side, server-side, or both? 2) Is there a minimum/maximum password length? 3) What happens on wrong credentials — error message, lockout after N attempts? 4) Is the password field masked, and is there a 'show password' toggle? 5) What happens if the network request fails or times out? 6) Is there rate limiting / CAPTCHA after repeated failures? 7) Does pressing Enter submit the form, or only clicking the button? A good tester treats an incomplete requirement as a list of open questions, not a green light to assume the happy path.",
  },
  {
    id: "ex-bug-2",
    type: "bug-finding",
    title: "Find the flaw in this test case",
    prompt:
      "Test case: \"Step 1: Open the app. Step 2: Verify the app works correctly.\" What's wrong with this test case, and how would you rewrite it?",
    modelSolution:
      "\"Verify the app works correctly\" isn't testable — it has no specific expected result, so two different testers (or the same tester on two different days) could disagree on whether it passed. A good version names one specific behavior with a precise expected result, e.g.: \"Step 1: Launch the app. Expected: the login screen appears within 3 seconds, showing an email field, password field, and a disabled Login button.\" Precise, falsifiable expected results are what make a test case actually useful.",
  },
  {
    id: "ex-tcw-1",
    type: "test-case-writing",
    title: "Write test cases for a password reset feature",
    prompt:
      "A 'Forgot Password' feature: user enters their email, receives a reset link valid for 30 minutes, clicks it, and sets a new password (minimum 8 characters, at least 1 number). Write at least 8 test cases covering positive, negative, and edge cases.",
    modelSolution:
      "1) Valid email → reset link sent (positive). 2) Unregistered email → generic 'if this email exists, a link was sent' message (no account enumeration). 3) Malformed email → inline validation error, no request sent. 4) Reset link used within 30 minutes → succeeds. 5) Reset link used after 30 minutes → expired-link error, no password change. 6) Reset link used twice → second use is rejected. 7) New password exactly 8 characters with 1 number → accepted (boundary). 8) New password 7 characters → rejected (boundary). 9) New password with no number → rejected. 10) After successful reset, old password no longer works and new password does log in.",
  },
  {
    id: "ex-tcw-2",
    type: "test-case-writing",
    title: "Write test cases for a file upload feature",
    prompt: "A feature lets users upload a profile picture: JPG/PNG only, max 5MB. Write test cases covering file type, size boundaries, and failure handling.",
    modelSolution:
      "1) Upload a valid JPG under 5MB → succeeds. 2) Upload a valid PNG under 5MB → succeeds. 3) Upload a PDF or .exe renamed to .jpg → rejected (validate actual file content/MIME type, not just the extension). 4) Upload a file exactly at 5MB → accepted (boundary). 5) Upload a file at 5MB + 1 byte → rejected (boundary). 6) Upload with no file selected → Upload button stays disabled or shows a clear error. 7) Cancel/interrupt the upload mid-transfer → app recovers gracefully, no corrupted partial file saved. 8) Upload while offline → clear network error, not a silent failure.",
  },
  {
    id: "ex-auto-1",
    type: "automation-challenge",
    title: "Design a Playwright test for a login flow",
    prompt:
      "Using Playwright, write pseudocode/TypeScript for a test that: logs in with valid credentials, asserts the dashboard loads, and confirms a specific 'Welcome, <name>' message appears — using role-based locators and auto-retrying assertions, not fixed sleeps.",
    modelSolution:
      "test('user can log in and sees a personalized welcome', async ({ page }) => {\n  await page.goto('/login');\n  await page.getByLabel('Email').fill('user@example.com');\n  await page.getByLabel('Password').fill('correct-password');\n  await page.getByRole('button', { name: 'Log in' }).click();\n\n  await expect(page).toHaveURL(/\\/dashboard/);\n  await expect(page.getByRole('heading', { name: /Welcome, .*/ })).toBeVisible();\n});\n\nKey points: getByLabel/getByRole instead of brittle CSS selectors, expect(...).toHaveURL/toBeVisible auto-retry instead of a manual sleep, and the test asserts on the specific outcome (the welcome heading) rather than just 'no errors happened.'",
  },
  {
    id: "ex-auto-2",
    type: "automation-challenge",
    title: "Fix the flaky test",
    prompt:
      "This test fails intermittently in CI: `await page.click('.submit-btn'); await page.waitForTimeout(2000); expect(await page.textContent('.result')).toBe('Success');` What's wrong, and how would you fix it?",
    modelSolution:
      "The fixed 2-second sleep is a race condition waiting to happen: too short on a slow CI runner (test fails even though the app is fine), and wastes time on a fast run. Fix: replace the sleep with an assertion that waits for the actual condition, e.g. `await expect(page.locator('.result')).toHaveText('Success');` in Playwright, which polls with auto-retry until the text appears or a real timeout is hit — removing the guesswork entirely.",
  },
];

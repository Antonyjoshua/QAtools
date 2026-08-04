# Playwright Login Test

This workspace contains a basic Playwright test for the login page of
`https://ai-admin.scopethinkers.ai/`.

## Getting started

> **Note:** if you executed `npm init` or `npm install` inside
> `tests/` instead of the workspace root, the root directory will still be
> empty and `npm list` will show `(empty)`.  Make sure you run the commands
> below from `c:\Users\AntonyJoshua\AI-chatbot` so that `package.json` and
> `node_modules` live at the project root.



1. **Install dependencies**

   ```bash
   cd c:/Users/AntonyJoshua/AI-chatbot
   npm init -y
   npm i -D @playwright/test @types/node
   npx playwright install
   ```

   A `tsconfig.json` is also provided in the repo; it enables strict
   syntax and imports the `node` and `@playwright/test` types so that the
   sample spec compiles without errors.

2. **Run the test**

   ```bash
   npx playwright test tests/login.spec.ts
   ```

3. **Customize selectors**

   Open the login page in your browser, right‑click on the username,
   password and submit elements and choose "Inspect" to view the HTML.  Use
   the appropriate `input[name=...]`, `input#id`, or other selectors in the
   script above.

4. **Credentials**

   For safety you can supply credentials via environment variables:
   `ADMIN_USER` and `ADMIN_PASS`, or hard‑code them for local testing.

5. **Assertions**

   Update the regular expression in `expect(page).toHaveURL(/dashboard|home/);`
   so that it matches whatever URL the application navigates to after a
   successful login.

---

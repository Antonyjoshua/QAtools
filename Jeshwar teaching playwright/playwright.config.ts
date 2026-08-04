import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',

  // Run all tests in parallel
  fullyParallel: true,

  // Fail CI build if test.only is left in source
  forbidOnly: !!process.env.CI,

  // Retry failed tests once locally, twice on CI
  retries: process.env.CI ? 2 : 1,

  // Parallelism: reduce on CI to avoid flakiness
  workers: process.env.CI ? 1 : undefined,

  // Per-test timeout
  timeout: 30_000,

  // Assertion timeout
  expect: { timeout: 8_000 },

  // Reporters
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://jt-frontend.scopethinkers.com',

    // Capture trace on first retry — view with: npx playwright show-trace
    trace: 'on-first-retry',

    // Screenshot only on failure
    screenshot: 'only-on-failure',

    // Record video on first retry
    video: 'on-first-retry',

    headless: true,
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile viewports
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },
  ],

  outputDir: 'test-results/',
});

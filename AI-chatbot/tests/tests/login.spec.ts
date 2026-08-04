import { test, expect } from '@playwright/test';

const emailSel = 'input[name="email"]';
const passSel = 'input[name="password"]';
const submitSel = 'button[type="submit"]';
const errorSelector = '[role="alert"], .error, .form-error, .ant-form-item-explain, text=Invalid, text=incorrect, text=required';

test.describe('Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://ai-admin.scopethinkers.ai/', { waitUntil: 'domcontentloaded' });
  });

  test('should login successfully', async ({ page }) => {
    test.setTimeout(120000);
    await page.waitForSelector(emailSel);
    await page.fill(emailSel, 'admin@techcorp.com');
    await page.waitForSelector(passSel);
    await page.fill(passSel, 'Test@12345');

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click(submitSel)
    ]);

    await expect(page).not.toHaveURL(/.*login/);
  });

  test('empty fields show error', async ({ page }) => {
    await page.click(submitSel);
    const err = page.locator(errorSelector).first();
    await expect(err).toBeVisible();
    await expect(page).toHaveURL(/.*login|\/$/);
  });

  test('incorrect email shows error', async ({ page }) => {
    await page.fill(emailSel, 'wrong@example.com');
    await page.fill(passSel, 'Test@12345');
    await page.click(submitSel);
    const err = page.locator(errorSelector).first();
    await expect(err).toBeVisible();
    await expect(page).toHaveURL(/.*login|\/$/);
  });

  test('incorrect password shows error', async ({ page }) => {
    await page.fill(emailSel, 'admin@techcorp.com');
    await page.fill(passSel, 'wrongpassword');
    await page.click(submitSel);
    const err = page.locator(errorSelector).first();
    await expect(err).toBeVisible();
    await expect(page).toHaveURL(/.*login|\/$/);
  });

  test('incorrect email and password shows error', async ({ page }) => {
    await page.fill(emailSel, 'wrong@example.com');
    await page.fill(passSel, 'wrongpassword');
    await page.click(submitSel);
    const err = page.locator(errorSelector).first();
    await expect(err).toBeVisible();
    await expect(page).toHaveURL(/.*login|\/$/);
  });
});
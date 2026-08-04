import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage
 * --------
 * Every Page Object extends this class.
 * Contains reusable navigation, interaction, and assertion helpers
 * so individual page objects stay focused on their own UI elements.
 */
export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Navigation ───────────────────────────────────────────────────────────────

  async goto(path = '/') {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  // ── Interactions ─────────────────────────────────────────────────────────────

  async fill(locator: Locator, value: string) {
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(value);
  }

  async click(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async check(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.check();
  }

  async uncheck(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.uncheck();
  }

  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) ?? '';
  }

  async getInputValue(locator: Locator): Promise<string> {
    return locator.inputValue();
  }

  // ── Waits ────────────────────────────────────────────────────────────────────

  async waitForVisible(locator: Locator, timeout = 8_000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForURL(url: string | RegExp, timeout = 10_000) {
    await this.page.waitForURL(url, { timeout });
  }

  // ── Assertions ───────────────────────────────────────────────────────────────

  async assertVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async assertNotVisible(locator: Locator) {
    await expect(locator).not.toBeVisible();
  }

  async assertText(locator: Locator, expected: string | RegExp) {
    await expect(locator).toContainText(expected);
  }

  async assertExactText(locator: Locator, expected: string) {
    await expect(locator).toHaveText(expected);
  }

  async assertURL(expected: string | RegExp) {
    await expect(this.page).toHaveURL(expected);
  }

  async assertEnabled(locator: Locator) {
    await expect(locator).toBeEnabled();
  }

  async assertDisabled(locator: Locator) {
    await expect(locator).toBeDisabled();
  }

  async assertChecked(locator: Locator) {
    await expect(locator).toBeChecked();
  }

  async assertNotChecked(locator: Locator) {
    await expect(locator).not.toBeChecked();
  }

  async assertAttributeValue(locator: Locator, attribute: string, value: string) {
    await expect(locator).toHaveAttribute(attribute, value);
  }

  async assertInputValue(locator: Locator, expected: string) {
    await expect(locator).toHaveValue(expected);
  }
}

import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * SignUpPage
 * ----------
 * Page Object for the Create Account / Registration screen.
 *
 * NOTE: All locator selectors are marked TODO.
 *       Replace each placeholder string with the real CSS/XPath/role
 *       selector after inspecting the live page.
 */
export class SignUpPage extends BasePage {

  // ── Locators ─────────────────────────────────────────────────────────────────
  // TODO: Replace every 'TODO_*' string with the actual selector.

  readonly nameInput            = this.page.locator('TODO_NAME_INPUT');
  readonly emailInput           = this.page.locator('TODO_EMAIL_INPUT');
  readonly phoneInput           = this.page.locator('TODO_PHONE_INPUT');
  readonly passwordInput        = this.page.locator('TODO_PASSWORD_INPUT');
  readonly confirmPasswordInput = this.page.locator('TODO_CONFIRM_PASSWORD_INPUT');
  readonly submitButton         = this.page.locator('TODO_SUBMIT_BUTTON');
  readonly loginLink            = this.page.locator('TODO_LOGIN_LINK');   // "Already have an account?"

  // Inline field error messages
  readonly nameError            = this.page.locator('TODO_NAME_ERROR');
  readonly emailError           = this.page.locator('TODO_EMAIL_ERROR');
  readonly phoneError           = this.page.locator('TODO_PHONE_ERROR');
  readonly passwordError        = this.page.locator('TODO_PASSWORD_ERROR');
  readonly confirmPasswordError = this.page.locator('TODO_CONFIRM_PASSWORD_ERROR');

  // Toast / banner feedback
  readonly successToast         = this.page.locator('TODO_SUCCESS_TOAST');
  readonly errorToast           = this.page.locator('TODO_ERROR_TOAST');

  constructor(page: Page) {
    super(page);
  }

  // ── Navigation ───────────────────────────────────────────────────────────────

  async navigate() {
    // TODO: Update path if the sign-up URL is different (e.g. '/register', '/signup')
    await this.goto('/register');
  }

  // ── Actions ──────────────────────────────────────────────────────────────────

  async fillName(value: string) {
    await this.fill(this.nameInput, value);
  }

  async fillEmail(value: string) {
    await this.fill(this.emailInput, value);
  }

  async fillPhone(value: string) {
    await this.fill(this.phoneInput, value);
  }

  async fillPassword(value: string) {
    await this.fill(this.passwordInput, value);
  }

  async fillConfirmPassword(value: string) {
    await this.fill(this.confirmPasswordInput, value);
  }

  async clickSubmit() {
    await this.click(this.submitButton);
  }

  async clickLoginLink() {
    await this.click(this.loginLink);
  }

  /** Convenience: fill every field then submit. */
  async signUp(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) {
    await this.fillName(data.name);
    await this.fillEmail(data.email);
    await this.fillPhone(data.phone);
    await this.fillPassword(data.password);
    await this.fillConfirmPassword(data.confirmPassword);
    await this.clickSubmit();
  }

  // ── Assertions ───────────────────────────────────────────────────────────────

  async assertPageLoaded() {
    await this.assertVisible(this.submitButton);
    await this.assertVisible(this.emailInput);
  }

  async assertNameError(message?: string | RegExp) {
    await this.assertVisible(this.nameError);
    if (message) await this.assertText(this.nameError, message);
  }

  async assertEmailError(message?: string | RegExp) {
    await this.assertVisible(this.emailError);
    if (message) await this.assertText(this.emailError, message);
  }

  async assertPhoneError(message?: string | RegExp) {
    await this.assertVisible(this.phoneError);
    if (message) await this.assertText(this.phoneError, message);
  }

  async assertPasswordError(message?: string | RegExp) {
    await this.assertVisible(this.passwordError);
    if (message) await this.assertText(this.passwordError, message);
  }

  async assertConfirmPasswordError(message?: string | RegExp) {
    await this.assertVisible(this.confirmPasswordError);
    if (message) await this.assertText(this.confirmPasswordError, message);
  }

  async assertSignUpSuccess() {
    await this.assertVisible(this.successToast);
  }

  async assertSignUpError(message?: string | RegExp) {
    await this.assertVisible(this.errorToast);
    if (message) await this.assertText(this.errorToast, message);
  }
}

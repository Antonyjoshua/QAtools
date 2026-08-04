import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage
 * ---------
 * Page Object for the Sign In screen.
 * Covers both email+password login and phone+OTP login flows.
 *
 * NOTE: All locator selectors are marked TODO.
 *       Replace each placeholder string with the real CSS/XPath/role
 *       selector after inspecting the live page.
 */
export class LoginPage extends BasePage {

  // ── Locators — Email / Password flow ─────────────────────────────────────────
  // TODO: Replace every 'TODO_*' string with the actual selector.

  readonly emailInput         = this.page.locator('TODO_EMAIL_INPUT');
  readonly passwordInput      = this.page.locator('TODO_PASSWORD_INPUT');
  readonly passwordToggleBtn  = this.page.locator('TODO_PASSWORD_TOGGLE_BUTTON');
  readonly rememberMeCheckbox = this.page.locator('TODO_REMEMBER_ME_CHECKBOX');
  readonly loginButton        = this.page.locator('TODO_LOGIN_BUTTON');
  readonly forgotPasswordLink = this.page.locator('TODO_FORGOT_PASSWORD_LINK');
  readonly signUpLink         = this.page.locator('TODO_SIGN_UP_LINK');    // "Create account"

  // ── Locators — Phone / OTP flow ───────────────────────────────────────────────

  readonly phoneTabBtn        = this.page.locator('TODO_PHONE_TAB_BUTTON');
  readonly phoneInput         = this.page.locator('TODO_PHONE_INPUT');
  readonly sendOtpButton      = this.page.locator('TODO_SEND_OTP_BUTTON');
  readonly otpInput           = this.page.locator('TODO_OTP_INPUT');
  readonly verifyOtpButton    = this.page.locator('TODO_VERIFY_OTP_BUTTON');
  readonly resendOtpLink      = this.page.locator('TODO_RESEND_OTP_LINK');

  // ── Locators — Feedback ───────────────────────────────────────────────────────

  readonly errorMessage       = this.page.locator('TODO_ERROR_MESSAGE');
  readonly successMessage     = this.page.locator('TODO_SUCCESS_MESSAGE');

  constructor(page: Page) {
    super(page);
  }

  // ── Navigation ───────────────────────────────────────────────────────────────

  async navigate() {
    await this.goto('/');
  }

  // ── Actions — Email / Password ────────────────────────────────────────────────

  async fillEmail(value: string) {
    await this.fill(this.emailInput, value);
  }

  async fillPassword(value: string) {
    await this.fill(this.passwordInput, value);
  }

  async clickLogin() {
    await this.click(this.loginButton);
  }

  async clickForgotPassword() {
    await this.click(this.forgotPasswordLink);
  }

  async clickSignUp() {
    await this.click(this.signUpLink);
  }

  async togglePasswordVisibility() {
    await this.click(this.passwordToggleBtn);
  }

  async checkRememberMe() {
    await this.check(this.rememberMeCheckbox);
  }

  /** Convenience: fill credentials and submit. */
  async loginWithEmail(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  // ── Actions — Phone / OTP ─────────────────────────────────────────────────────

  async switchToPhoneLogin() {
    await this.click(this.phoneTabBtn);
  }

  async fillPhone(value: string) {
    await this.fill(this.phoneInput, value);
  }

  async clickSendOtp() {
    await this.click(this.sendOtpButton);
  }

  async fillOtp(value: string) {
    await this.fill(this.otpInput, value);
  }

  async clickVerifyOtp() {
    await this.click(this.verifyOtpButton);
  }

  async clickResendOtp() {
    await this.click(this.resendOtpLink);
  }

  /** Convenience: phone OTP end-to-end (OTP value must be intercepted externally). */
  async loginWithPhone(phone: string, otp: string) {
    await this.switchToPhoneLogin();
    await this.fillPhone(phone);
    await this.clickSendOtp();
    await this.fillOtp(otp);
    await this.clickVerifyOtp();
  }

  // ── Assertions ───────────────────────────────────────────────────────────────

  async assertPageLoaded() {
    await this.assertVisible(this.loginButton);
    await this.assertVisible(this.emailInput);
  }

  async assertLoginError(message?: string | RegExp) {
    await this.assertVisible(this.errorMessage);
    if (message) await this.assertText(this.errorMessage, message);
  }

  async assertLoginSuccess() {
    // TODO: Replace URL pattern with the actual post-login URL
    await this.waitForURL(/dashboard|home|profile/);
  }

  async assertPasswordIsHidden() {
    await this.assertAttributeValue(this.passwordInput, 'type', 'password');
  }

  async assertPasswordIsVisible() {
    await this.assertAttributeValue(this.passwordInput, 'type', 'text');
  }

  async assertRememberMeChecked() {
    await this.assertChecked(this.rememberMeCheckbox);
  }

  async assertRememberMeUnchecked() {
    await this.assertNotChecked(this.rememberMeCheckbox);
  }

  async assertOtpScreenShown() {
    await this.assertVisible(this.otpInput);
  }
}

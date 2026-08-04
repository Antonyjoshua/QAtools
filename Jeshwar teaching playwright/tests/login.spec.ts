import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { existingUser, invalidData } from '../test-data/users';

test.describe('Login', () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.assertPageLoaded();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SMOKE — Critical happy path
  // ═══════════════════════════════════════════════════════════════════════════

  test('should log in successfully with valid credentials @smoke', async () => {
    await loginPage.loginWithEmail(existingUser.email, existingUser.password);

    await loginPage.assertLoginSuccess();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // REGRESSION — Validation errors
  // ═══════════════════════════════════════════════════════════════════════════

  test('should show error when email field is empty @regression', async () => {
    await loginPage.fillPassword(existingUser.password);
    await loginPage.clickLogin();

    await loginPage.assertLoginError();
  });

  test('should show error when password field is empty @regression', async () => {
    await loginPage.fillEmail(existingUser.email);
    await loginPage.clickLogin();

    await loginPage.assertLoginError();
  });

  test('should show error when both fields are empty @regression', async () => {
    await loginPage.clickLogin();

    await loginPage.assertLoginError();
  });

  test('should show error for invalid email format @regression', async () => {
    await loginPage.fillEmail(invalidData.badEmail);
    await loginPage.fillPassword(existingUser.password);
    await loginPage.clickLogin();

    await loginPage.assertLoginError();
  });

  test('should show error for wrong password @regression', async () => {
    await loginPage.loginWithEmail(existingUser.email, invalidData.wrongPassword);

    await loginPage.assertLoginError();
  });

  test('should show error for unregistered email @regression', async () => {
    await loginPage.loginWithEmail(invalidData.unregisteredEmail, existingUser.password);

    await loginPage.assertLoginError();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // REGRESSION — UI behaviour
  // ═══════════════════════════════════════════════════════════════════════════

  test('password field should be masked by default @regression', async () => {
    await loginPage.fillPassword(existingUser.password);

    await loginPage.assertPasswordIsHidden();
  });

  test('password toggle should reveal and re-hide password @regression', async () => {
    await loginPage.fillPassword(existingUser.password);

    await loginPage.togglePasswordVisibility();
    await loginPage.assertPasswordIsVisible();

    await loginPage.togglePasswordVisibility();
    await loginPage.assertPasswordIsHidden();
  });

  test('remember me checkbox should be unchecked by default @regression', async () => {
    await loginPage.assertRememberMeUnchecked();
  });

  test('remember me checkbox should be checkable @regression', async () => {
    await loginPage.checkRememberMe();
    await loginPage.assertRememberMeChecked();
  });

  test('should navigate to forgot-password page via the link @regression', async ({ page }) => {
    await loginPage.clickForgotPassword();

    // TODO: Update URL pattern to match actual forgot-password route
    await expect(page).toHaveURL(/forgot|reset/);
  });

  test('should navigate to sign-up page via the create-account link @regression', async ({ page }) => {
    await loginPage.clickSignUp();

    // TODO: Update URL pattern to match actual sign-up route
    await expect(page).toHaveURL(/register|signup|sign-up/);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // REGRESSION — Edge cases
  // ═══════════════════════════════════════════════════════════════════════════

  test('should not log in with SQL injection in the email field @regression', async () => {
    await loginPage.loginWithEmail(invalidData.sqlInjection, existingUser.password);

    await loginPage.assertLoginError();
  });

  test('should not log in with excessively long email @regression', async () => {
    await loginPage.loginWithEmail(invalidData.longString, existingUser.password);

    await loginPage.assertLoginError();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SMOKE — Phone / OTP flow (happy path placeholder)
  // ═══════════════════════════════════════════════════════════════════════════

  test('should show OTP input after submitting a valid phone number @smoke', async () => {
    await loginPage.switchToPhoneLogin();
    await loginPage.fillPhone('9876543210');
    await loginPage.clickSendOtp();

    await loginPage.assertOtpScreenShown();
  });

  test('should show error for invalid phone number on OTP screen @regression', async () => {
    await loginPage.switchToPhoneLogin();
    await loginPage.fillPhone('123');              // too short / invalid
    await loginPage.clickSendOtp();

    await loginPage.assertLoginError();
  });

});

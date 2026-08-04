import { test, expect } from '@playwright/test';
import { SignUpPage } from '../pages/SignUpPage';
import { validUser, invalidData } from '../test-data/users';

test.describe('Sign Up', () => {

  let signUpPage: SignUpPage;

  test.beforeEach(async ({ page }) => {
    signUpPage = new SignUpPage(page);
    await signUpPage.navigate();
    await signUpPage.assertPageLoaded();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SMOKE — Critical happy path
  // ═══════════════════════════════════════════════════════════════════════════

  test('should create a new account with valid data @smoke', async () => {
    await signUpPage.signUp({
      name:            validUser.name,
      email:           validUser.email,
      phone:           validUser.phone,
      password:        validUser.password,
      confirmPassword: validUser.password,
    });

    await signUpPage.assertSignUpSuccess();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // REGRESSION — Validation errors
  // ═══════════════════════════════════════════════════════════════════════════

  test('should show error when all fields are empty @regression', async () => {
    await signUpPage.clickSubmit();

    await signUpPage.assertNameError();
    await signUpPage.assertEmailError();
    await signUpPage.assertPasswordError();
  });

  test('should show error for invalid email format @regression', async ({ page }) => {
    await signUpPage.fillName(validUser.name);
    await signUpPage.fillEmail(invalidData.badEmail);
    await signUpPage.fillPassword(validUser.password);
    await signUpPage.fillConfirmPassword(validUser.password);
    await signUpPage.clickSubmit();

    await signUpPage.assertEmailError();
  });

  test('should show error when passwords do not match @regression', async () => {
    await signUpPage.fillName(validUser.name);
    await signUpPage.fillEmail(validUser.email);
    await signUpPage.fillPassword(validUser.password);
    await signUpPage.fillConfirmPassword(invalidData.mismatchPassword);
    await signUpPage.clickSubmit();

    await signUpPage.assertConfirmPasswordError();
  });

  test('should show error for a weak password @regression', async () => {
    await signUpPage.fillName(validUser.name);
    await signUpPage.fillEmail(validUser.email);
    await signUpPage.fillPassword(invalidData.shortPassword);
    await signUpPage.fillConfirmPassword(invalidData.shortPassword);
    await signUpPage.clickSubmit();

    await signUpPage.assertPasswordError();
  });

  test('should show error for an already registered email @regression', async () => {
    await signUpPage.signUp({
      name:            validUser.name,
      email:           'existing@mailinator.com',   // pre-registered
      phone:           validUser.phone,
      password:        validUser.password,
      confirmPassword: validUser.password,
    });

    await signUpPage.assertSignUpError();
  });

  test('should show error for an invalid phone number @regression', async () => {
    await signUpPage.fillName(validUser.name);
    await signUpPage.fillEmail(validUser.email);
    await signUpPage.fillPhone('123');              // too short
    await signUpPage.fillPassword(validUser.password);
    await signUpPage.fillConfirmPassword(validUser.password);
    await signUpPage.clickSubmit();

    await signUpPage.assertPhoneError();
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // REGRESSION — Edge cases
  // ═══════════════════════════════════════════════════════════════════════════

  test('should navigate to Login page via the login link @regression', async ({ page }) => {
    await signUpPage.clickLoginLink();

    // TODO: Update URL pattern to match actual login route
    await expect(page).toHaveURL(/login|sign-in/);
  });

  test('should not accept SQL injection in the email field @regression', async () => {
    await signUpPage.fillEmail(invalidData.sqlInjection);
    await signUpPage.fillPassword(validUser.password);
    await signUpPage.fillConfirmPassword(validUser.password);
    await signUpPage.clickSubmit();

    // The app must reject — either show a validation error, not redirect to dashboard
    await signUpPage.assertEmailError();
  });

  test('should not accept XSS payload in the name field @regression', async ({ page }) => {
    await signUpPage.fillName(invalidData.xssPayload);
    await signUpPage.fillEmail(validUser.email);
    await signUpPage.fillPassword(validUser.password);
    await signUpPage.fillConfirmPassword(validUser.password);
    await signUpPage.clickSubmit();

    // Verify no alert() dialog was triggered
    let dialogTriggered = false;
    page.on('dialog', () => { dialogTriggered = true; });
    await page.waitForTimeout(1_000);
    expect(dialogTriggered).toBe(false);
  });

  test('should not allow excessively long inputs @regression', async () => {
    await signUpPage.fillName(invalidData.longString);
    await signUpPage.fillEmail(validUser.email);
    await signUpPage.fillPassword(validUser.password);
    await signUpPage.fillConfirmPassword(validUser.password);
    await signUpPage.clickSubmit();

    await signUpPage.assertNameError();
  });

});

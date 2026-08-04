package com.automation.tests;

import com.automation.pages.CreateAccountPage;
import com.automation.pages.DashboardPage;
import com.automation.pages.LoginPage;
import com.automation.utils.ConfigReader;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Account Creation Test
 * Flow: Launch URL → Click Create Account → Fill Form → Submit → Login → Verify Dashboard
 */
public class AccountCreationTest extends BaseTest {

    // Timestamp suffix makes username, email and phone unique on every run
    private static final String TIMESTAMP = LocalDateTime.now()
            .format(DateTimeFormatter.ofPattern("MMddHHmm"));

    private static final String FIRST_NAME = ConfigReader.getProperty("new_first_name");
    private static final String LAST_NAME  = ConfigReader.getProperty("new_last_name");
    private static final String USERNAME   = ConfigReader.getProperty("new_username_base") + TIMESTAMP;
    private static final String EMAIL      = ConfigReader.getProperty("new_username_base") + TIMESTAMP
                                             + ConfigReader.getProperty("new_email_domain");
    private static final String PHONE      = ConfigReader.getProperty("new_phone_prefix") + TIMESTAMP;
    private static final String PASSWORD   = ConfigReader.getProperty("new_password");
    private static final String CITY       = ConfigReader.getProperty("new_city");

    /**
     * Flow: Launch URL → Create Account → Login with new account → Verify Dashboard
     */
    @Test(description = "Create a new account and login with it to verify dashboard access")
    public void testCreateAccountAndLogin() {

        // ── Step 1: Verify login page loaded ─────────────────────────────────
        logger.info("Step 1: Application launched at login page");
        LoginPage loginPage = new LoginPage(driver);
        Assert.assertTrue(loginPage.isLoginPageDisplayed(),
                "Login page should be displayed on launch");

        // ── Step 2: Navigate to Create Account page ───────────────────────────
        logger.info("Step 2: Clicking Create An Account link");
        loginPage.clickCreateAccount();

        CreateAccountPage createAccountPage = new CreateAccountPage(driver);
        Assert.assertTrue(createAccountPage.isCreateAccountPageDisplayed(),
                "Create Account page should be displayed");
        logger.info("Step 2: Create Account page loaded successfully");

        // ── Step 3: Fill and submit the registration form ─────────────────────
        logger.info("Step 3: Filling registration form - username: " + USERNAME);
        createAccountPage.registerAccount(
                FIRST_NAME,
                LAST_NAME,
                USERNAME,
                EMAIL,
                PHONE,
                PASSWORD,
                CITY
        );

        // ── Step 4: Verify no form errors after submit ────────────────────────
        Assert.assertFalse(createAccountPage.isErrorDisplayed(),
                "No errors should appear after valid registration. Error: "
                + createAccountPage.getErrorMessage());

        // ── Step 5: Login with the newly created account ──────────────────────
        String currentUrl = driver.getCurrentUrl();
        logger.info("Step 5: Post-registration URL: " + currentUrl);

        if (loginPage.isLoginPageDisplayed()) {
            logger.info("Step 5: Redirected to login page — logging in with new account");
            DashboardPage dashboardPage = loginPage.login(USERNAME, PASSWORD);
            Assert.assertTrue(dashboardPage.isDashboardDisplayed(),
                    "Dashboard should be displayed after login with new account");
            logger.info("Step 5: Login successful — dashboard displayed");
        } else {
            logger.info("Step 5: Already on dashboard after registration");
            Assert.assertTrue(currentUrl.contains("Dashboard") || currentUrl.contains("Home"),
                    "Should be on dashboard or home after registration. URL: " + currentUrl);
        }

        logger.info("Test passed: Account created and login verified for username: " + USERNAME);
    }
}

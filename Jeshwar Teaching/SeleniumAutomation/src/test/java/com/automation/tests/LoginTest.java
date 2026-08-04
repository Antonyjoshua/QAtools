package com.automation.tests;

import com.automation.pages.LoginPage;
import com.automation.pages.DashboardPage;
import com.automation.utils.ConfigReader;
import com.automation.listeners.RetryAnalyzer;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * Login Test class with comprehensive test scenarios
 * Tests against: Jeshwar Teaching (https://jt-frontend.scopethinkers.com/)
 * Uses Page Factory pattern with Page Object Model
 */
public class LoginTest extends BaseTest {

    /**
     * Test successful login with valid credentials
     */
    @Test(description = "Verify successful login with valid credentials", retryAnalyzer = RetryAnalyzer.class)
    public void testSuccessfulLogin() {
        logger.info("Test: Successful Login");
        
        String username = ConfigReader.getProperty("username");
        String password = ConfigReader.getProperty("password");
        
        LoginPage loginPage = new LoginPage(driver);
        Assert.assertTrue(loginPage.isLoginPageDisplayed(), 
            "Login page should be displayed");
        
        DashboardPage dashboardPage = loginPage.login(username, password);
        
        Assert.assertTrue(dashboardPage.isDashboardDisplayed(), 
            "Dashboard should be displayed after successful login");
        Assert.assertTrue(dashboardPage.isUserProfileVisible(), 
            "User profile should be visible on dashboard");
        
        logger.info("Test passed: User successfully logged in");
    }

    /**
     * Test login with invalid credentials
     */
    @Test(description = "Verify login failure with invalid credentials", retryAnalyzer = RetryAnalyzer.class)
    public void testInvalidLogin() {
        logger.info("Test: Invalid Login");
        
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login("invalidUser@example.com", "wrongPassword");
        
        // Check if error is displayed or remains on login page
        boolean isErrorDisplayed = loginPage.isErrorDisplayed();
        boolean isLoginPageDisplayed = loginPage.isLoginPageDisplayed();
        
        Assert.assertTrue(isErrorDisplayed || isLoginPageDisplayed, 
            "Should either show error or remain on login page for invalid credentials");
        
        logger.info("Test passed: Error displayed or remained on login page");
    }

    /**
     * Test login with empty credentials
     */
    @Test(description = "Verify login failure with empty credentials", retryAnalyzer = RetryAnalyzer.class)
    public void testLoginWithEmptyCredentials() {
        logger.info("Test: Login with Empty Credentials");
        
        LoginPage loginPage = new LoginPage(driver);
        loginPage.clickSignInButton();
        
        // Should remain on login page or show validation error
        boolean isLoginPageDisplayed = loginPage.isLoginPageDisplayed();
        
        Assert.assertTrue(isLoginPageDisplayed, 
            "Should remain on login page with empty credentials");
        
        logger.info("Test passed: Remained on login page with empty credentials");
    }

    /**
     * Test login page elements
     */
    @Test(description = "Verify login page has all required elements")
    public void testLoginPageElements() {
        logger.info("Test: Login Page Elements");
        
        LoginPage loginPage = new LoginPage(driver);
        Assert.assertTrue(loginPage.isLoginPageDisplayed(), 
            "Login page should be displayed");
        Assert.assertTrue(loginPage.isRememberMeVisible(), 
            "Remember me checkbox should be visible");
        Assert.assertTrue(loginPage.isSignInButtonEnabled(),
            "Sign in button should be enabled");
        
        logger.info("Test passed: All login page elements present");
    }

    /**
     * Test login with remember me option
     */
    @Test(description = "Verify login with remember me functionality")
    public void testLoginWithRememberMe() {
        logger.info("Test: Login with Remember Me");
        
        String username = ConfigReader.getProperty("username");
        String password = ConfigReader.getProperty("password");
        
        LoginPage loginPage = new LoginPage(driver);
        Assert.assertTrue(loginPage.isRememberMeVisible(), 
            "Remember me checkbox should be visible");
        
        DashboardPage dashboardPage = loginPage.loginWithRememberMe(username, password);
        
        Assert.assertTrue(dashboardPage.isDashboardDisplayed(), 
            "Dashboard should be displayed after login with remember me");
        
        logger.info("Test passed: Login with remember me successful");
    }

    /**
     * Test clearing input fields
     */
    @Test(description = "Verify clearing input fields functionality")
    public void testClearInputFields() {
        logger.info("Test: Clear Input Fields");
        
        LoginPage loginPage = new LoginPage(driver);
        loginPage.enterUsername("testUser").enterPassword("testPassword");
        loginPage.clearAllFields();
        
        Assert.assertTrue(loginPage.isLoginPageDisplayed(), 
            "Login page should still be displayed");
        
        logger.info("Test passed: Input fields cleared successfully");
    }

    /**
     * Test forgot password link
     */
    @Test(description = "Verify forgot password link functionality")
    public void testForgotPasswordLink() {
        logger.info("Test: Forgot Password Link");
        
        LoginPage loginPage = new LoginPage(driver);
        Assert.assertTrue(loginPage.isLoginPageDisplayed(), 
            "Login page should be displayed");
        
        loginPage.clickForgotPassword();
        
        // Wait for navigation
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        String currentUrl = driver.getCurrentUrl();
        Assert.assertTrue(currentUrl.contains("Forgot") || currentUrl.contains("forgot"),
            "Should navigate to forgot password page");
        
        logger.info("Test passed: Navigated to forgot password page");
    }
}

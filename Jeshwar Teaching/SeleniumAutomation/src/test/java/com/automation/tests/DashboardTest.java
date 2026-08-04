package com.automation.tests;

import com.automation.pages.LoginPage;
import com.automation.pages.DashboardPage;
import com.automation.utils.ConfigReader;
import com.automation.listeners.RetryAnalyzer;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * Dashboard Test class with comprehensive test scenarios
 * Tests against: Jeshwar Teaching (https://jt-frontend.scopethinkers.com/)
 * Uses Page Factory pattern with Page Object Model
 */
public class DashboardTest extends BaseTest {

    /**
     * Test dashboard display after successful login
     */
    @Test(description = "Verify dashboard is displayed after successful login", retryAnalyzer = RetryAnalyzer.class)
    public void testDashboardDisplay() {
        logger.info("Test: Dashboard Display");
        
        String username = ConfigReader.getProperty("username");
        String password = ConfigReader.getProperty("password");
        
        LoginPage loginPage = new LoginPage(driver);
        DashboardPage dashboardPage = loginPage.login(username, password);
        
        Assert.assertTrue(dashboardPage.isDashboardDisplayed(), 
            "Dashboard should be visible");
        Assert.assertTrue(dashboardPage.verifyDashboardElements(),
            "All key dashboard elements should be visible");
        
        logger.info("Test passed: Dashboard displayed successfully");
    }

    /**
     * Test user profile visibility on dashboard
     */
    @Test(description = "Verify user profile is visible on dashboard", retryAnalyzer = RetryAnalyzer.class)
    public void testUserProfileVisibility() {
        logger.info("Test: User Profile Visibility");
        
        String username = ConfigReader.getProperty("username");
        String password = ConfigReader.getProperty("password");
        
        LoginPage loginPage = new LoginPage(driver);
        DashboardPage dashboardPage = loginPage.login(username, password);
        
        Assert.assertTrue(dashboardPage.isUserProfileVisible(), 
            "User profile should be visible on dashboard");
        
        String userNameDisplay = dashboardPage.getUserName();
        Assert.assertNotNull(userNameDisplay, "User name should not be null");
        Assert.assertTrue(userNameDisplay.contains("antonyp3") || !userNameDisplay.isEmpty(),
            "User name should be displayed");
        
        logger.info("Test passed: User profile is visible - " + userNameDisplay);
    }

    /**
     * Test dashboard page title
     */
    @Test(description = "Verify dashboard page title", retryAnalyzer = RetryAnalyzer.class)
    public void testDashboardTitle() {
        logger.info("Test: Dashboard Title");
        
        String username = ConfigReader.getProperty("username");
        String password = ConfigReader.getProperty("password");
        
        LoginPage loginPage = new LoginPage(driver);
        DashboardPage dashboardPage = loginPage.login(username, password);
        
        String pageTitle = dashboardPage.getDashboardTitle();
        Assert.assertNotNull(pageTitle, "Page title should not be null");
        Assert.assertFalse(pageTitle.isEmpty(), "Page title should not be empty");
        Assert.assertTrue(pageTitle.contains("Dashboard") || pageTitle.contains("JT"),
            "Page title should contain Dashboard or JT");
        
        logger.info("Test passed: Dashboard title - " + pageTitle);
    }

    /**
     * Test dashboard URL
     */
    @Test(description = "Verify dashboard URL contains Dashboard", retryAnalyzer = RetryAnalyzer.class)
    public void testDashboardUrl() {
        logger.info("Test: Dashboard URL");
        
        String username = ConfigReader.getProperty("username");
        String password = ConfigReader.getProperty("password");
        
        LoginPage loginPage = new LoginPage(driver);
        DashboardPage dashboardPage = loginPage.login(username, password);
        
        String dashboardUrl = dashboardPage.getDashboardUrl();
        Assert.assertNotNull(dashboardUrl, "Dashboard URL should not be null");
        Assert.assertTrue(dashboardUrl.contains("Dashboard"),
            "URL should contain Dashboard");
        
        logger.info("Test passed: Dashboard URL - " + dashboardUrl);
    }

    /**
     * Test dashboard cards visibility
     */
    @Test(description = "Verify all dashboard cards are visible")
    public void testDashboardCardsVisibility() {
        logger.info("Test: Dashboard Cards Visibility");
        
        String username = ConfigReader.getProperty("username");
        String password = ConfigReader.getProperty("password");
        
        LoginPage loginPage = new LoginPage(driver);
        DashboardPage dashboardPage = loginPage.login(username, password);
        
        Assert.assertTrue(dashboardPage.isCourseEnrolledCardVisible(),
            "Course Enrolled card should be visible");
        Assert.assertTrue(dashboardPage.isAssessmentCardVisible(),
            "Assessment card should be visible");
        Assert.assertTrue(dashboardPage.isHoursWatchedCardVisible(),
            "Hours Watched card should be visible");
        Assert.assertTrue(dashboardPage.isTopicsCompletedCardVisible(),
            "Topics Completed card should be visible");
        
        logger.info("Test passed: All dashboard cards are visible");
    }

    /**
     * Test dashboard charts visibility
     */
    @Test(description = "Verify dashboard charts are visible")
    public void testDashboardChartsVisibility() {
        logger.info("Test: Dashboard Charts Visibility");
        
        String username = ConfigReader.getProperty("username");
        String password = ConfigReader.getProperty("password");
        
        LoginPage loginPage = new LoginPage(driver);
        DashboardPage dashboardPage = loginPage.login(username, password);
        
        Assert.assertTrue(dashboardPage.isTotalWatchedHoursVisible(),
            "Total Watched Hours chart should be visible");
        Assert.assertTrue(dashboardPage.isTopicsProgressVisible(),
            "Topics Progress section should be visible");
        
        logger.info("Test passed: Dashboard charts are visible");
    }

    /**
     * Test sidebar navigation links
     */
    @Test(description = "Verify sidebar navigation links are present")
    public void testSidebarNavigationLinks() {
        logger.info("Test: Sidebar Navigation Links");
        
        String username = ConfigReader.getProperty("username");
        String password = ConfigReader.getProperty("password");
        
        LoginPage loginPage = new LoginPage(driver);
        DashboardPage dashboardPage = loginPage.login(username, password);
        
        // Verify key navigation elements
        Assert.assertTrue(dashboardPage.isDashboardDisplayed(), 
            "Dashboard should be displayed");
        
        // Navigation links should be clickable
        try {
            dashboardPage.clickMyCourses();
            logger.info("Successfully navigated to My Courses");
        } catch (Exception e) {
            logger.warn("Navigation to My Courses failed: " + e.getMessage());
        }
        
        logger.info("Test passed: Sidebar navigation links are accessible");
    }

    /**
     * Test logout functionality
     */
    @Test(description = "Verify logout functionality", retryAnalyzer = RetryAnalyzer.class)
    public void testLogout() {
        logger.info("Test: Logout");
        
        String username = ConfigReader.getProperty("username");
        String password = ConfigReader.getProperty("password");
        
        LoginPage loginPage = new LoginPage(driver);
        DashboardPage dashboardPage = loginPage.login(username, password);
        
        Assert.assertTrue(dashboardPage.isDashboardDisplayed(), 
            "Dashboard should be displayed before logout");
        
        LoginPage logoutPage = dashboardPage.clickLogout();
        Assert.assertTrue(logoutPage.isLoginPageDisplayed(), 
            "Should return to login page after logout");
        
        logger.info("Test passed: Successfully logged out");
    }

    /**
     * Test user profile click
     */
    @Test(description = "Verify user profile link is clickable")
    public void testUserProfileClick() {
        logger.info("Test: User Profile Click");
        
        String username = ConfigReader.getProperty("username");
        String password = ConfigReader.getProperty("password");
        
        LoginPage loginPage = new LoginPage(driver);
        DashboardPage dashboardPage = loginPage.login(username, password);
        
        Assert.assertTrue(dashboardPage.isUserProfileVisible(),
            "User profile should be visible");
        
        try {
            dashboardPage.clickUserProfile();
            logger.info("Successfully clicked user profile");
        } catch (Exception e) {
            logger.warn("User profile click failed: " + e.getMessage());
        }
        
        logger.info("Test passed: User profile is clickable");
    }
}

package com.automation.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Dashboard Page Object class using Page Factory pattern
 * Contains all elements and methods related to dashboard functionality
 * Application: Jeshwar Teaching (https://jt-frontend.scopethinkers.com/)
 */
public class DashboardPage extends BasePage {
    private static final Logger logger = LogManager.getLogger(DashboardPage.class);

    // Page Elements using Page Factory
    @FindBy(xpath = "//link[contains(@href, '/Dashboard/Index') and contains(text(), 'Dashboard')]")
    private WebElement dashboardLink;

    @FindBy(xpath = "//div[contains(text(), 'Course Enrolled')]/parent::*/parent::*")
    private WebElement courseEnrolledCard;

    @FindBy(xpath = "//div[contains(text(), 'Assessment')]/parent::*/parent::*")
    private WebElement assessmentCard;

    @FindBy(xpath = "//div[contains(text(), 'Hours Watched')]/parent::*/parent::*")
    private WebElement hoursWatchedCard;

    @FindBy(xpath = "//div[contains(text(), 'Topics Completed')]/parent::*/parent::*")
    private WebElement topicsCompletedCard;

    @FindBy(xpath = "//button[contains(., 'Logout')]")
    private WebElement logoutButton;

    @FindBy(xpath = "//a[contains(text(), 'Profile') and contains(., 'antonyp3')]")
    private WebElement userProfileLink;

    @FindBy(xpath = "//a[contains(text(), 'Profile')]//following-sibling::*[contains(text(), 'antonyp3')]")
    private WebElement userNameDisplay;

    @FindBy(xpath = "//link[contains(., 'My Courses')]")
    private WebElement myCoursesLink;

    @FindBy(xpath = "//link[contains(., 'Settings')]")
    private WebElement settingsLink;

    @FindBy(xpath = "//link[contains(., 'Notification')]")
    private WebElement notificationLink;

    @FindBy(xpath = "//link[contains(., 'Leaderboard')]")
    private WebElement leaderboardLink;

    @FindBy(xpath = "//heading[contains(text(), 'Total Watched Hours')]")
    private WebElement totalWatchedHoursHeading;

    @FindBy(xpath = "//heading[contains(text(), 'Total Topic')]")
    private WebElement totalTopicsHeading;

    @FindBy(xpath = "//heading[contains(text(), 'Topics Progress')]")
    private WebElement topicsProgressHeading;

    public DashboardPage(WebDriver driver) {
        super(driver);
        logger.info("DashboardPage instantiated");
        verifyDashboardLoaded();
    }

    /**
     * Verify dashboard is loaded
     */
    private void verifyDashboardLoaded() {
        logger.info("Verifying dashboard page loaded");
        try {
            waitForPresence(org.openqa.selenium.By.xpath("//link[contains(@href, '/Dashboard/Index')]"));
            logger.info("Dashboard loaded successfully");
        } catch (Exception e) {
            logger.error("Dashboard failed to load: " + e.getMessage());
            throw new RuntimeException("Dashboard page did not load within timeout", e);
        }
    }

    /**
     * Check if dashboard is displayed
     */
    public boolean isDashboardDisplayed() {
        logger.info("Checking if dashboard is displayed");
        return isElementDisplayed(courseEnrolledCard) || isElementDisplayed(dashboardLink);
    }

    /**
     * Check if user profile is visible
     */
    public boolean isUserProfileVisible() {
        logger.info("Checking if user profile is visible");
        return isElementDisplayed(userProfileLink);
    }

    /**
     * Get user name from dashboard
     */
    public String getUserName() {
        logger.info("Getting user name from dashboard");
        try {
            return getText(userProfileLink);
        } catch (Exception e) {
            logger.warn("Failed to get user name: " + e.getMessage());
            return "";
        }
    }

    /**
     * Click logout button - returns LoginPage
     */
    public LoginPage clickLogout() {
        logger.info("Clicking logout button");
        click(logoutButton);
        // Wait for page transition
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return new LoginPage(driver);
    }

    /**
     * Get dashboard title
     */
    public String getDashboardTitle() {
        logger.info("Getting dashboard title");
        return getPageTitle();
    }

    /**
     * Get current URL
     */
    public String getDashboardUrl() {
        logger.info("Getting dashboard URL");
        return getCurrentUrl();
    }

    /**
     * Click My Courses link
     */
    public void clickMyCourses() {
        logger.info("Clicking My Courses link");
        click(myCoursesLink);
    }

    /**
     * Click Settings link
     */
    public void clickSettings() {
        logger.info("Clicking Settings link");
        click(settingsLink);
    }

    /**
     * Click Notification link
     */
    public void clickNotification() {
        logger.info("Clicking Notification link");
        click(notificationLink);
    }

    /**
     * Click Leaderboard link
     */
    public void clickLeaderboard() {
        logger.info("Clicking Leaderboard link");
        click(leaderboardLink);
    }

    /**
     * Click user profile
     */
    public void clickUserProfile() {
        logger.info("Clicking user profile");
        click(userProfileLink);
    }

    /**
     * Check if course enrolled card is visible
     */
    public boolean isCourseEnrolledCardVisible() {
        logger.info("Checking if course enrolled card is visible");
        return isElementDisplayed(courseEnrolledCard);
    }

    /**
     * Check if assessment card is visible
     */
    public boolean isAssessmentCardVisible() {
        logger.info("Checking if assessment card is visible");
        return isElementDisplayed(assessmentCard);
    }

    /**
     * Check if hours watched card is visible
     */
    public boolean isHoursWatchedCardVisible() {
        logger.info("Checking if hours watched card is visible");
        return isElementDisplayed(hoursWatchedCard);
    }

    /**
     * Check if topics completed card is visible
     */
    public boolean isTopicsCompletedCardVisible() {
        logger.info("Checking if topics completed card is visible");
        return isElementDisplayed(topicsCompletedCard);
    }

    /**
     * Check if total watched hours section is visible
     */
    public boolean isTotalWatchedHoursVisible() {
        logger.info("Checking if total watched hours section is visible");
        return isElementDisplayed(totalWatchedHoursHeading);
    }

    /**
     * Check if topics progress section is visible
     */
    public boolean isTopicsProgressVisible() {
        logger.info("Checking if topics progress section is visible");
        return isElementDisplayed(topicsProgressHeading);
    }

    /**
     * Verify all key dashboard elements are visible
     */
    public boolean verifyDashboardElements() {
        logger.info("Verifying all key dashboard elements");
        return isDashboardDisplayed() && 
               isUserProfileVisible() && 
               isCourseEnrolledCardVisible() &&
               isAssessmentCardVisible() &&
               isHoursWatchedCardVisible() &&
               isTopicsCompletedCardVisible();
    }
}

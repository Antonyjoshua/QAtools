package com.automation.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Login Page Object class using Page Factory pattern
 * Contains all elements and methods related to login functionality
 * Application: Jeshwar Teaching (https://jt-frontend.scopethinkers.com/)
 */
public class LoginPage extends BasePage {
    private static final Logger logger = LogManager.getLogger(LoginPage.class);

    // Page Elements using Page Factory
    @FindBy(xpath = "//input[@placeholder='Enter your email or username']")
    private WebElement usernameInput;

    @FindBy(xpath = "//input[@placeholder='Enter your password']")
    private WebElement passwordInput;

    @FindBy(xpath = "//button[contains(., 'Sign In')]")
    private WebElement signInButton;

    @FindBy(xpath = "//input[@type='checkbox' and following-sibling::text()[contains(., 'Remember me')]]")
    private WebElement rememberMeCheckbox;

    @FindBy(xpath = "//a[contains(., 'Forgot password?')]")
    private WebElement forgotPasswordLink;

    @FindBy(xpath = "//a[contains(., 'Create an account')]")
    private WebElement createAccountLink;

    @FindBy(xpath = "//h2[contains(., 'Sign In')]")
    private WebElement signInTitle;

    @FindBy(xpath = "//button[contains(., 'Login Using OTP')]")
    private WebElement loginOtpButton;

    @FindBy(xpath = "//div[contains(@class, 'error') or contains(@class, 'alert-danger')]")
    private WebElement errorMessage;

    public LoginPage(WebDriver driver) {
        super(driver);
        logger.info("LoginPage instantiated");
    }

    /**
     * Enter username/email
     */
    public LoginPage enterUsername(String username) {
        logger.info("Entering username: " + username);
        enterText(usernameInput, username);
        return this;
    }

    /**
     * Enter password
     */
    public LoginPage enterPassword(String password) {
        logger.info("Entering password");
        enterText(passwordInput, password);
        return this;
    }

    /**
     * Click sign in button - returns DashboardPage on success
     */
    public DashboardPage clickSignInButton() {
        logger.info("Clicking sign in button");
        click(signInButton);
        // Wait for page transition
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return new DashboardPage(driver);
    }

    /**
     * Perform login - returns DashboardPage on success
     */
    public DashboardPage login(String username, String password) {
        logger.info("Performing login with username: " + username);
        enterUsername(username);
        enterPassword(password);
        return clickSignInButton();
    }

    /**
     * Perform login with remember me option
     */
    public DashboardPage loginWithRememberMe(String username, String password) {
        logger.info("Performing login with remember me option");
        enterUsername(username);
        enterPassword(password);
        
        if (!rememberMeCheckbox.isSelected()) {
            click(rememberMeCheckbox);
            logger.info("Remember me checkbox selected");
        }
        
        return clickSignInButton();
    }

    /**
     * Get error message text
     */
    public String getErrorMessage() {
        logger.info("Getting error message");
        try {
            return getText(errorMessage);
        } catch (Exception e) {
            logger.warn("Error message not found: " + e.getMessage());
            return "";
        }
    }

    /**
     * Check if error message is displayed
     */
    public boolean isErrorDisplayed() {
        logger.info("Checking if error message is displayed");
        return isElementDisplayed(errorMessage);
    }

    /**
     * Click forgot password link
     */
    public void clickForgotPassword() {
        logger.info("Clicking forgot password link");
        click(forgotPasswordLink);
    }

    /**
     * Click create account link
     */
    public void clickCreateAccount() {
        logger.info("Clicking create account link");
        click(createAccountLink);
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    /**
     * Click login using OTP button
     */
    public void clickLoginOtp() {
        logger.info("Clicking login using OTP button");
        click(loginOtpButton);
    }

    /**
     * Check if login page is displayed
     */
    public boolean isLoginPageDisplayed() {
        logger.info("Checking if login page is displayed");
        return isElementDisplayed(usernameInput) && isElementDisplayed(signInTitle);
    }

    /**
     * Get sign in title
     */
    public String getSignInTitle() {
        logger.info("Getting sign in page title");
        return getText(signInTitle);
    }

    /**
     * Check if remember me checkbox is visible
     */
    public boolean isRememberMeVisible() {
        logger.info("Checking if remember me checkbox is visible");
        return isElementDisplayed(rememberMeCheckbox);
    }

    /**
     * Check if remember me checkbox is selected
     */
    public boolean isRememberMeChecked() {
        logger.info("Checking if remember me checkbox is checked");
        return rememberMeCheckbox.isSelected();
    }

    /**
     * Clear all input fields
     */
    public LoginPage clearAllFields() {
        logger.info("Clearing all input fields");
        usernameInput.clear();
        passwordInput.clear();
        return this;
    }

    /**
     * Check if sign in button is enabled
     */
    public boolean isSignInButtonEnabled() {
        logger.info("Checking if sign in button is enabled");
        return signInButton.isEnabled();
    }
}

package com.automation.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Create Account Page Object using Page Factory pattern
 * Application: Jeshwar Teaching (https://jt-frontend.scopethinkers.com/)
 */
public class CreateAccountPage extends BasePage {
    private static final Logger logger = LogManager.getLogger(CreateAccountPage.class);

    @FindBy(xpath = "//h2[contains(., 'Create An Account')]")
    private WebElement pageTitle;

    @FindBy(id = "FirstName")
    private WebElement firstNameInput;

    @FindBy(id = "LastName")
    private WebElement lastNameInput;

    @FindBy(id = "UserName")
    private WebElement usernameInput;

    @FindBy(id = "Email")
    private WebElement emailInput;

    @FindBy(id = "PhoneNumber")
    private WebElement phoneInput;

    @FindBy(id = "Password")
    private WebElement passwordInput;

    @FindBy(id = "ConfirmPassword")
    private WebElement confirmPasswordInput;

    @FindBy(id = "City")
    private WebElement cityInput;

    // Selects the first gender radio button (Male)
    @FindBy(xpath = "//input[@type='radio' and @name='Gender'][1]")
    private WebElement genderRadio;

    @FindBy(id = "terms")
    private WebElement acceptTermsCheckbox;

    @FindBy(xpath = "//button[@type='submit' and contains(., 'Create Account')]")
    private WebElement createAccountButton;

    // Excludes single '*' required-field markers — only real validation messages
    @FindBy(xpath = "//span[contains(@class,'text-danger') and string-length(normalize-space(text())) > 1]")
    private WebElement errorMessage;

    // Confirmation popup shown after successful registration
    @FindBy(xpath = "//div[contains(@class,'modal') or @role='dialog' or contains(@class,'popup') or contains(@class,'success')]")
    private WebElement confirmationPopup;

    // Login button inside the confirmation popup
    @FindBy(xpath = "//div[contains(@class,'modal') or @role='dialog' or contains(@class,'popup') or contains(@class,'success')]//button[contains(normalize-space(.),'Login') or contains(normalize-space(.),'Log In')]")
    private WebElement loginButtonInPopup;

    public CreateAccountPage(WebDriver driver) {
        super(driver);
        logger.info("CreateAccountPage instantiated");
    }

    public CreateAccountPage enterFirstName(String firstName) {
        logger.info("Entering first name: " + firstName);
        enterText(firstNameInput, firstName);
        return this;
    }

    public CreateAccountPage enterLastName(String lastName) {
        logger.info("Entering last name: " + lastName);
        enterText(lastNameInput, lastName);
        return this;
    }

    public CreateAccountPage enterUsername(String username) {
        logger.info("Entering username: " + username);
        enterText(usernameInput, username);
        return this;
    }

    public CreateAccountPage enterEmail(String email) {
        logger.info("Entering email: " + email);
        enterText(emailInput, email);
        return this;
    }

    public CreateAccountPage enterPhone(String phone) {
        logger.info("Entering phone: " + phone);
        enterText(phoneInput, phone);
        return this;
    }

    public CreateAccountPage enterPassword(String password) {
        logger.info("Entering password");
        enterText(passwordInput, password);
        return this;
    }

    public CreateAccountPage enterConfirmPassword(String password) {
        logger.info("Entering confirm password");
        enterText(confirmPasswordInput, password);
        return this;
    }

    public CreateAccountPage enterCity(String city) {
        logger.info("Entering city: " + city);
        enterText(cityInput, city);
        return this;
    }

    public CreateAccountPage selectGender() {
        logger.info("Selecting gender");
        if (!genderRadio.isSelected()) {
            click(genderRadio);
        }
        return this;
    }

    public CreateAccountPage acceptTerms() {
        logger.info("Accepting terms and conditions");
        if (!acceptTermsCheckbox.isSelected()) {
            click(acceptTermsCheckbox);
        }
        return this;
    }

    public void clickCreateAccount() {
        logger.info("Clicking Create Account button");
        click(createAccountButton);
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    /**
     * Fill all fields and submit the registration form
     */
    public void registerAccount(String firstName, String lastName, String username,
                                String email, String phone, String password, String city) {
        logger.info("Filling registration form for username: " + username);
        enterFirstName(firstName);
        enterLastName(lastName);
        enterUsername(username);
        enterEmail(email);
        enterPhone(phone);
        enterPassword(password);
        enterConfirmPassword(password);
        enterCity(city);
        selectGender();
        acceptTerms();
        clickCreateAccount();
    }

    public boolean isCreateAccountPageDisplayed() {
        return isElementDisplayed(pageTitle);
    }

    public boolean isErrorDisplayed() {
        return isElementDisplayed(errorMessage);
    }

    public String getErrorMessage() {
        try {
            return getText(errorMessage);
        } catch (Exception e) {
            logger.warn("Error message not found: " + e.getMessage());
            return "";
        }
    }

    public boolean isConfirmationPopupDisplayed() {
        logger.info("Checking if confirmation popup is displayed");
        return isElementDisplayed(confirmationPopup);
    }

    public void clickLoginInPopup() {
        logger.info("Clicking Login button in confirmation popup");
        click(loginButtonInPopup);
    }
}

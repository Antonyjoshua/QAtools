# Selenium Automation Framework

A comprehensive automation framework for web application testing using Selenium WebDriver, TestNG, and Maven with CI/CD integration.

## Features

- **Selenium WebDriver 4.14.1** - Latest WebDriver API
- **TestNG Framework** - Powerful testing framework with reporting
- **Page Factory Pattern** - Automatic element initialization with @FindBy annotations
- **Page Object Model (POM)** - Robust, scalable, and maintainable design pattern
- **Fluent API** - Method chaining for readable test code
- **Explicit Waits** - Multiple wait strategies for reliability
- **Exception Handling** - Robust error management with retry mechanism
- **TestNG Listeners** - Enhanced test execution and failure handling
- **Retry Analyzer** - Automatic retry for flaky tests
- **WebDriverManager** - Automatic driver management
- **Maven** - Build and dependency management
- **Log4j2** - Comprehensive logging with file and console output
- **CI/CD Integration** - GitHub Actions and Jenkins support
- **Screenshot Capture** - Automatic screenshots on test failure
- **Configuration Management** - Externalized configuration properties
- **ThreadLocal Driver** - Thread-safe WebDriver management

## Prerequisites

- Java 11 or higher
- Maven 3.6.0 or higher
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SeleniumAutomation
```

2. Install dependencies:
```bash
mvn clean install
```

## Project Structure

```
SeleniumAutomation/
├── src/
│   ├── main/
│   │   ├── java/com/automation/
│   │   │   ├── pages/          # Page Object classes
│   │   │   └── utils/          # Utility classes
│   │   └── resources/
│   │       ├── config.properties
│   │       └── log4j2.xml
│   └── test/
│       └── java/com/automation/tests/    # Test classes
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions workflow
├── pom.xml                     # Maven configuration
├── testng.xml                  # TestNG configuration
└── Jenkinsfile                 # Jenkins pipeline
```

## Configuration

Edit `src/main/resources/config.properties` to configure:

- **Browser**: Chrome, Firefox
- **Base URL**: Application URL
- **Timeouts**: Implicit, explicit, page load timeouts
- **Screenshots**: Enable/disable and path
- **Logging**: Log level configuration

Example:
```properties
browser=chrome
headless=false
base_url=https://example.com
implicit_wait=10
explicit_wait=20
```

## Running Tests

### Run all tests:
```bash
mvn test
```

### Run specific test class:
```bash
mvn test -Dtest=LoginTest
```

### Run specific test method:
```bash
mvn test -Dtest=LoginTest#testSuccessfulLogin
```

### Run with specific browser:
```bash
mvn test -Dbrowser=firefox
```

### Run tests in headless mode:
```bash
mvn test -Dheadless=true
```

## Test Reports

After running tests, reports are generated in:
- **Surefire Reports**: `target/surefire-reports/`
- **TestNG Reports**: `test-output/`
- **Screenshots**: `test-output/screenshots/`
- **Logs**: `logs/`

## CI/CD Integration

### GitHub Actions

The project includes a GitHub Actions workflow that:
- Runs on push to main/develop branches
- Runs on pull requests
- Runs daily schedule
- Tests on Java 11 and 17
- Generates reports and artifacts

Workflow file: `.github/workflows/ci-cd.yml`

### Jenkins

The project includes a Jenkinsfile for Jenkins integration:

1. Create a new Pipeline job in Jenkins
2. Point to the `Jenkinsfile` in the repository
3. Configure webhook for automatic triggers

Workflow file: `Jenkinsfile`

## Page Objects

### LoginPage
Located in `src/main/java/com/automation/pages/LoginPage.java`

Uses Page Factory @FindBy annotations for element locators:
```java
@FindBy(id = "username")
private WebElement usernameInput;

@FindBy(id = "password")
private WebElement passwordInput;
```

Methods:
- `enterUsername(String username)` - Fluent API, returns this
- `enterPassword(String password)` - Fluent API, returns this
- `login(String username, String password)` - Returns DashboardPage
- `getErrorMessage()` - Returns error message text
- `isErrorDisplayed()` - Checks error visibility
- `isLoginPageDisplayed()` - Verifies login page loaded

### DashboardPage
Located in `src/main/java/com/automation/pages/DashboardPage.java`

Uses Page Factory @FindBy annotations:
```java
@FindBy(xpath = "//h1[@class='welcome']")
private WebElement welcomeMessage;

@FindBy(className = "user-profile")
private WebElement userProfile;
```

Methods:
- `isDashboardDisplayed()` - Checks dashboard visibility
- `isUserProfileVisible()` - Checks profile visibility
- `clickLogout()` - Returns LoginPage
- `getUserName()` - Gets user name from dashboard
- `verifyDashboardElements()` - Verifies all key elements
- `getNotificationCount()` - Gets notification badge count

## Page Factory Example

### Creating a Page Object with @FindBy
```java
public class LoginPage extends BasePage {
    
    // Automatic initialization via Page Factory
    @FindBy(id = "username")
    private WebElement usernameInput;
    
    @FindBy(id = "password")
    private WebElement passwordInput;
    
    @FindBy(id = "loginButton")
    private WebElement loginButton;
    
    public LoginPage(WebDriver driver) {
        super(driver);  // Calls PageFactory.initElements()
    }
    
    // Fluent API - returns this for method chaining
    public LoginPage enterUsername(String username) {
        enterText(usernameInput, username);
        return this;
    }
    
    // Page transition - returns new page object
    public DashboardPage clickLoginButton() {
        click(loginButton);
        return new DashboardPage(driver);
    }
}
```

### Using Page Factory in Tests
```java
public class LoginTest extends BaseTest {
    
    @Test
    public void testSuccessfulLogin() {
        LoginPage loginPage = new LoginPage(driver);
        
        // Fluent method chaining
        DashboardPage dashboard = loginPage
            .enterUsername("user@example.com")
            .enterPassword("password123")
            .clickLoginButton();
        
        Assert.assertTrue(dashboard.isDashboardDisplayed());
    }
}
```

## Utilities

### WebDriverUtil
Manages WebDriver initialization and cleanup with automatic driver management

### ConfigReader
Reads configuration from properties file with type conversion support

### ScreenshotUtil
Captures screenshots on test failure with timestamped naming

## Listeners & Test Execution

### TestListener
Located in `src/main/java/com/automation/listeners/TestListener.java`

- Automatically logs test start, success, failure, and skip events
- Captures screenshots on test failure
- Provides detailed execution metrics
- Enhanced test reporting

### RetryAnalyzer
Located in `src/main/java/com/automation/listeners/RetryAnalyzer.java`

- Automatically retries failed tests up to 2 times
- Handles flaky tests gracefully
- Reduces false negatives in CI/CD pipelines

**Usage**:
```java
@Test(retryAnalyzer = RetryAnalyzer.class)
public void testFlakySituation() {
    // Test will be retried up to 2 times if it fails
}
```

## Test Examples

### Example Test Class
```java
@Test(description = "Verify successful login")
public void testSuccessfulLogin() {
    LoginPage loginPage = new LoginPage(driver);
    loginPage.login("user@example.com", "password");
    
    DashboardPage dashboardPage = new DashboardPage(driver);
    Assert.assertTrue(dashboardPage.isDashboardDisplayed());
}
```

## Logging

Logging is configured via `log4j2.xml`. Logs are written to:
- Console output
- `logs/automation.log` file

## Best Practices

1. **Use Page Object Model** - Maintain page objects for each page
2. **Use Page Factory** - Automatic element initialization with @FindBy
3. **Use Explicit Waits** - Available in BasePage class
4. **Handle Exceptions** - Implement proper exception handling
5. **Use Descriptive Names** - Test and method names should be clear
6. **Keep Tests Independent** - Each test should be independent
7. **Use TestNG Annotations** - @BeforeMethod, @AfterMethod, @Test, etc.
8. **Log Actions** - Log important test actions using logger
9. **Fluent API** - Use method chaining for readable tests
10. **Page Transitions** - Return new page object on navigation

## Advanced Features

### Fluent API Usage
```java
// Chain methods for readable test code
DashboardPage dashboard = new LoginPage(driver)
    .enterUsername("user@example.com")
    .enterPassword("password123")
    .clickLoginButton();
```

### Wait Strategies
```java
// Multiple wait methods in BasePage
waitForElement(By locator)           // Visibility + Clickability
waitForClickable(By locator)         // Element clickable
waitForClickableElement(WebElement)  // WebElement clickable
waitForPresence(By locator)          // Element presence
waitForInvisibility(By locator)      // Wait until invisible
```

### Exception Handling
- `TimeoutException` - Element not found within timeout
- `StaleElementReferenceException` - Handled with retry mechanism
- `NoSuchElementException` - Graceful handling with logging
- `ElementNotInteractableException` - Error recovery support

### Stale Element Handling
BasePage automatically handles stale element exceptions with retry:
```java
protected void click(WebElement element) {
    try {
        waitForClickableElement(element);
        element.click();
    } catch (StaleElementReferenceException e) {
        // Auto-retry on stale element
        element.click();
    }
}
```

### Page Load Verification
```java
public class DashboardPage extends BasePage {
    private void verifyDashboardLoaded() {
        try {
            waitForClickableElement(dashboardContent);
            logger.info("Dashboard loaded successfully");
        } catch (Exception e) {
            throw new RuntimeException("Dashboard page did not load", e);
        }
    }
}
```

### Configuration Management
All configuration externalized in `src/main/resources/config.properties`:
```properties
browser=chrome
headless=false
base_url=https://example.com
implicit_wait=10
explicit_wait=20
page_load_timeout=30
screenshot_on_failure=true
```

### Logging
```java
logger.info("Performing login with username: " + username);
logger.debug("Getting text from element");
logger.warn("Element not displayed");
logger.error("Failed to take screenshot: " + e.getMessage());
```

## Architecture & Design Patterns

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.

See [PAGE_FACTORY_GUIDE.md](PAGE_FACTORY_GUIDE.md) for comprehensive Page Factory implementation guide.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please create an issue in the repository.

## Author

Automation Team

## Changelog

### Version 1.0.0
- Initial framework setup
- Page Object Model implementation
- TestNG and Selenium integration
- CI/CD configuration

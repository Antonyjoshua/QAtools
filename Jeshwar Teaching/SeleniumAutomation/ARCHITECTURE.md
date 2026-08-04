# Framework Architecture - Page Factory & Page Object Model

## Overview

This framework implements a robust, scalable, and maintainable test automation architecture using:
- **Page Factory Pattern** - Automatic element initialization
- **Page Object Model (POM)** - Separation of test logic and page interactions
- **TestNG Framework** - Advanced testing capabilities
- **Listeners** - Enhanced reporting and error handling

## Architecture Layers

```
┌─────────────────────────────────────────────────┐
│           Test Classes (LoginTest, DashboardTest)  │
│              - Test Scenarios                       │
│              - Assertions                           │
│              - Test Data                            │
└─────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────┐
│           Page Objects (LoginPage, DashboardPage)  │
│              - @FindBy Annotations                 │
│              - Element Interactions                │
│              - Fluent API Methods                  │
│              - Page Specific Logic                 │
└─────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────┐
│              BasePage                               │
│              - PageFactory Initialization          │
│              - Explicit Waits                      │
│              - Exception Handling                  │
│              - Common Element Methods              │
└─────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────┐
│           Utilities & Listeners                     │
│           - WebDriverUtil                          │
│           - ConfigReader                           │
│           - ScreenshotUtil                         │
│           - TestListener                           │
│           - RetryAnalyzer                          │
└─────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────┐
│         Selenium WebDriver & TestNG                │
│         - Browser Automation                       │
│         - Test Execution                           │
└─────────────────────────────────────────────────┘
```

## Key Components

### 1. Page Factory Pattern (@FindBy)

**File**: `src/main/java/com/automation/pages/`

```java
@FindBy(id = "username")
private WebElement usernameInput;

@FindBy(id = "loginButton")
private WebElement loginButton;
```

**Benefits**:
- Automatic element initialization via `PageFactory.initElements()`
- Lazy initialization - elements loaded when accessed
- Centralized locator management
- Better performance with proxy pattern

**Locator Strategies**:
- `@FindBy(id = "element_id")`
- `@FindBy(name = "element_name")`
- `@FindBy(className = "class_name")`
- `@FindBy(linkText = "link_text")`
- `@FindBy(partialLinkText = "partial_text")`
- `@FindBy(xpath = "xpath_expression")`
- `@FindBy(css = "css_selector")`

### 2. BasePage - Core Functionality

**File**: `src/main/java/com/automation/pages/BasePage.java`

Provides:
```
✓ PageFactory Initialization
✓ Explicit Waits (20s & 5s)
✓ WebElement Waits
✓ Stale Element Handling
✓ Click with Retry
✓ Text Entry with Verification
✓ Exception Handling
✓ iFrame Handling
✓ Element Presence/Visibility Checks
✓ Page Navigation Methods
```

### 3. Page Objects (LoginPage, DashboardPage)

**Pattern**: Extends BasePage + @FindBy annotations

**Example - LoginPage**:
```java
public class LoginPage extends BasePage {
    @FindBy(id = "username")
    private WebElement usernameInput;
    
    // Fluent API
    public LoginPage enterUsername(String username) {
        enterText(usernameInput, username);
        return this;
    }
    
    public DashboardPage clickLoginButton() {
        click(loginButton);
        return new DashboardPage(driver);
    }
}
```

**Features**:
- Fluent interface for method chaining
- Page transition returns new page object
- Encapsulation of page interactions
- Maintainable and readable test code

### 4. Test Classes

**File**: `src/test/java/com/automation/tests/`

**BaseTest**:
- Common setup/teardown logic
- WebDriver initialization
- TestNG listeners integration
- Screenshot on failure
- Configuration management

**Test Classes** (LoginTest, DashboardTest):
- Inherit from BaseTest
- Use Page Objects
- Implement test scenarios
- Support RetryAnalyzer

### 5. Listeners for Robustness

#### TestListener
```java
public class TestListener implements ITestListener {
    - onTestStart()    // Log test start
    - onTestSuccess()  // Log success
    - onTestFailure()  // Log failure + take screenshot
    - onTestSkipped()  // Log skip
}
```

**Benefits**:
- Automatic screenshot on failure
- Enhanced logging
- Better reporting
- Failure tracking

#### RetryAnalyzer
```java
public class RetryAnalyzer implements IRetryAnalyzer {
    - retry(ITestResult result)  // Retry failed tests
}
```

**Benefits**:
- Handles flaky tests automatically
- Configurable retry count
- Reduces false negatives
- Better CI/CD stability

### 6. Utilities

#### WebDriverUtil
- Automatic browser initialization
- WebDriverManager integration
- ThreadLocal driver management
- Safe driver cleanup

#### ConfigReader
- Centralized configuration
- Property file loading
- Type conversion (String, Int, Boolean)
- Default value support

#### ScreenshotUtil
- Screenshot capture on failure
- Timestamped file naming
- Configurable paths
- Error handling

## Wait Strategy

### Explicit Waits (Recommended)
```
20 seconds  - Standard wait for elements
5 seconds   - Short wait for quick checks
```

### Wait Methods in BasePage
```java
waitForElement(By)                 // Visibility + Clickability
waitForClickable(By)               // Element clickable
waitForClickableElement(WebElement)// WebElement clickable
waitForPresence(By)                // Element presence
waitForInvisibility(By)            // Wait until invisible
```

### Implicit Wait
```
10 seconds  - Set in config.properties
Page Load Timeout: 30 seconds
```

## Exception Handling

**Handled Exceptions**:
- `TimeoutException` - Element not found within timeout
- `StaleElementReferenceException` - Element reference stale
- `NoSuchElementException` - Element not found
- `ElementNotInteractableException` - Cannot interact with element

**Error Recovery**:
- Retry mechanism
- Screenshot capture
- Detailed logging
- Exception wrapping with context

## Scalability Features

### 1. Fluent API
```java
loginPage
    .enterUsername("user")
    .enterPassword("pass")
    .clickLoginButton()
    .verifyDashboardElements();
```

### 2. Page Transitions
```java
DashboardPage dashboard = loginPage.login(user, pass);
LoginPage loginPage = dashboard.clickLogout();
```

### 3. Reusable Methods
```java
// BasePage methods used by all pages
click(element)
enterText(element, text)
getText(element)
isElementDisplayed(element)
```

### 4. Configuration Management
```properties
browser=chrome
headless=false
base_url=https://example.com
implicit_wait=10
explicit_wait=20
screenshot_on_failure=true
```

### 5. Modular Test Structure
```
src/test/java/
├── tests/
│   ├── BaseTest.java          # Common setup
│   ├── LoginTest.java         # Login tests
│   ├── DashboardTest.java     # Dashboard tests
│   └── ...                     # Add more test classes
```

## Best Practices Implemented

✓ **Page Factory Pattern** - Automatic element initialization  
✓ **Page Object Model** - Clear separation of concerns  
✓ **Fluent API** - Readable and chainable methods  
✓ **Explicit Waits** - Reliable synchronization  
✓ **Exception Handling** - Robust error management  
✓ **Logging** - Comprehensive test logging  
✓ **Listeners** - Automatic failure handling  
✓ **Screenshots** - Visual failure evidence  
✓ **Retry Mechanism** - Flaky test handling  
✓ **Configuration Management** - Centralized settings  
✓ **ThreadLocal Driver** - Thread-safe WebDriver  
✓ **Page Transitions** - Type-safe navigation  

## Usage Example

```java
@Test
public void testLoginAndVerifyDashboard() {
    // Create page object
    LoginPage loginPage = new LoginPage(driver);
    
    // Fluent method chaining
    DashboardPage dashboard = loginPage
        .enterUsername("user@example.com")
        .enterPassword("password123")
        .clickLoginButton();
    
    // Verify dashboard
    Assert.assertTrue(dashboard.isDashboardDisplayed());
    Assert.assertTrue(dashboard.isUserProfileVisible());
    
    // Logout
    LoginPage logoutPage = dashboard.clickLogout();
    Assert.assertTrue(logoutPage.isLoginPageDisplayed());
}
```

## Extending the Framework

### Adding a New Page

1. Create class extending BasePage
```java
public class SettingsPage extends BasePage {
    @FindBy(id = "saveButton")
    private WebElement saveButton;
    
    public SettingsPage(WebDriver driver) {
        super(driver);
    }
}
```

2. Add elements with @FindBy
3. Implement page methods
4. Use in tests

### Adding a New Test

1. Create test class extending BaseTest
```java
public class SettingsTest extends BaseTest {
    @Test
    public void testSaveSettings() {
        // Test implementation
    }
}
```

2. Add to testng.xml
3. Run with Maven

## CI/CD Integration

- **GitHub Actions**: `.github/workflows/ci-cd.yml`
- **Jenkins**: `Jenkinsfile`
- Automatic test execution on push/PR
- Report generation
- Artifact upload

## Performance Optimizations

✓ Page Factory lazy initialization  
✓ Minimal explicit waits (20s default)  
✓ ThreadLocal driver management  
✓ Efficient element location strategies  
✓ Retry analyzer for flaky tests  
✓ Parallel test execution (configurable)  

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Stale element | BasePage handles with retry |
| Timeout | Check element locators, increase wait time |
| NoSuchElement | Verify element exists, check locator |
| Page load slow | Use pageLoadTimeout in config |
| Flaky tests | Enable RetryAnalyzer |

## Maintenance

- Update selectors in page objects when UI changes
- Add new page objects for new pages
- Update testng.xml when adding tests
- Keep config.properties in sync with environments

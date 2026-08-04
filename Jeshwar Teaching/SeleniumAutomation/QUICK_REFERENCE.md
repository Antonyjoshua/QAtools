# Quick Reference Guide

## Project Structure Overview

```
SeleniumAutomation/
│
├── src/main/java/com/automation/
│   ├── pages/                    # Page Objects with @FindBy
│   │   ├── BasePage.java         # Common methods + Page Factory init
│   │   ├── LoginPage.java        # Login page with fluent API
│   │   └── DashboardPage.java    # Dashboard page
│   │
│   ├── utils/                    # Utility Classes
│   │   ├── WebDriverUtil.java    # Driver initialization & cleanup
│   │   ├── ConfigReader.java     # Configuration management
│   │   └── ScreenshotUtil.java   # Screenshot on failure
│   │
│   ├── listeners/                # TestNG Listeners
│   │   ├── TestListener.java     # Test event logging
│   │   └── RetryAnalyzer.java    # Flaky test retry
│   │
│   └── resources/
│       ├── config.properties     # Application configuration
│       └── log4j2.xml           # Logging configuration
│
├── src/test/java/com/automation/tests/
│   ├── BaseTest.java             # Common test setup/teardown
│   ├── LoginTest.java            # Login test scenarios
│   └── DashboardTest.java        # Dashboard test scenarios
│
├── .github/workflows/
│   └── ci-cd.yml                # GitHub Actions CI/CD
│
├── pom.xml                       # Maven configuration
├── testng.xml                    # TestNG suite configuration
├── Jenkinsfile                   # Jenkins pipeline
│
└── Documentation/
    ├── README.md                 # Main documentation
    ├── ARCHITECTURE.md           # Architecture explanation
    ├── PAGE_FACTORY_GUIDE.md    # Page Factory patterns
    ├── SCALABILITY_GUIDE.md     # How to extend framework
    ├── GETTING_STARTED.md       # Quick start guide
    └── QUICK_REFERENCE.md       # This file
```

## Key Concepts

### Page Factory Pattern
```java
// Automatic element initialization with @FindBy
@FindBy(id = "username")
private WebElement usernameInput;

// Initialized automatically in BasePage constructor
PageFactory.initElements(driver, this);
```

### Page Object Model (POM)
```java
// Each page has its own class
public class LoginPage extends BasePage { }
public class DashboardPage extends BasePage { }

// Page-specific methods encapsulate interactions
public DashboardPage login(String user, String pass) { }
```

### Fluent API
```java
// Method chaining for readable tests
DashboardPage dashboard = new LoginPage(driver)
    .enterUsername("user@example.com")
    .enterPassword("password123")
    .clickLoginButton();
```

## Common Tasks

### Running Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=LoginTest

# Run specific test method
mvn test -Dtest=LoginTest#testSuccessfulLogin

# Run with headless browser
mvn test -Dheadless=true

# Run in parallel
mvn test -DparallelCount=4
```

### Creating a New Page Object

```java
public class ProductPage extends BasePage {
    
    @FindBy(id = "productTitle")
    private WebElement productTitle;
    
    @FindBy(id = "addToCartBtn")
    private WebElement addToCartButton;
    
    public ProductPage(WebDriver driver) {
        super(driver);
    }
    
    public String getProductTitle() {
        return getText(productTitle);
    }
    
    public void addToCart() {
        click(addToCartButton);
    }
}
```

### Writing a Test

```java
@Test
public void testAddProductToCart() {
    LoginPage loginPage = new LoginPage(driver);
    DashboardPage dashboard = loginPage.login("user@example.com", "password");
    
    // Navigate and test
    ProductPage product = new ProductPage(driver);
    product.addToCart();
    
    Assert.assertTrue(product.isProductAdded());
}
```

### Using Different Waits

```java
// Element visibility + clickability (20s)
waitForElement(By locator)

// Element clickable only (20s)
waitForClickable(By locator)

// Element presence (20s)
waitForPresence(By locator)

// Wait for invisibility (20s)
waitForInvisibility(By locator)

// WebElement clickable
waitForClickableElement(WebElement element)
```

### Exception Handling

```java
// BasePage handles these automatically:
// - TimeoutException
// - StaleElementReferenceException
// - NoSuchElementException
// - ElementNotInteractableException

// Just use the methods, exceptions are handled
click(element);           // Auto-retry on stale
enterText(element, text); // Clear + verify
getText(element);         // Safe retrieval
```

## Configuration

### config.properties

```properties
# Browser Settings
browser=chrome              # chrome, firefox
headless=false             # true for headless mode

# URLs
base_url=https://example.com
login_url=https://example.com/login

# Timeouts
implicit_wait=10           # seconds
explicit_wait=20           # seconds
page_load_timeout=30       # seconds

# Features
screenshot_on_failure=true # auto screenshot
log_level=INFO            # logging level
```

### testng.xml

```xml
<!-- Test suite configuration -->
<suite name="Web Automation" parallel="methods" thread-count="1">
    <listeners>
        <listener class-name="com.automation.listeners.TestListener"/>
    </listeners>
    
    <test name="Login Tests">
        <classes>
            <class name="com.automation.tests.LoginTest"/>
        </classes>
    </test>
</suite>
```

## Listeners

### TestListener
- Logs test start/success/failure/skip
- Captures screenshots on failure
- Provides execution metrics

### RetryAnalyzer
- Retries failed tests (max 2 times)
- Useful for flaky tests
- Use: `@Test(retryAnalyzer = RetryAnalyzer.class)`

## Best Practices

✓ Always extend BasePage for new pages
✓ Use @FindBy annotations for elements
✓ Use explicit waits from BasePage
✓ Implement fluent API in pages
✓ Return new page on navigation
✓ Add page load verification
✓ Log important actions
✓ Handle exceptions properly
✓ Keep tests independent
✓ Use meaningful names

❌ Don't use By locators directly in tests
❌ Don't hardcode waits
❌ Don't ignore exceptions
❌ Don't create large test methods
❌ Don't duplicate code
❌ Don't skip logging
❌ Don't assume element presence
❌ Don't use implicit waits only

## Locator Strategies

```java
@FindBy(id = "elementId")
@FindBy(name = "elementName")
@FindBy(className = "className")
@FindBy(css = "input[type='text']")
@FindBy(xpath = "//input[@id='username']")
@FindBy(linkText = "Click Here")
@FindBy(partialLinkText = "Click")
@FindBy(tagName = "input")

// Multiple locators (OR strategy)
@FindAll({
    @FindBy(id = "username"),
    @FindBy(name = "user")
})

// AND strategy
@FindBys({
    @FindBy(name = "form"),
    @FindBy(name = "username")
})
```

## CI/CD

### GitHub Actions
- Runs on push to main/develop
- Runs on pull requests
- Daily schedule
- Tests on Java 11 & 17
- Generates artifacts

### Jenkins
- Use Jenkinsfile in repository
- Create Pipeline job
- Configure webhook

## Troubleshooting

| Problem | Solution |
|---------|----------|
| WebDriver not found | WebDriverManager handles auto-download |
| Tests timeout | Increase timeouts in config.properties |
| Stale element | Framework auto-retries on stale |
| No screenshots | Enable in config.properties |
| Flaky tests | Use @Test(retryAnalyzer = RetryAnalyzer.class) |
| Maven error | Run `mvn clean install -U` |

## Documentation Links

- [README.md](README.md) - Full documentation
- [ARCHITECTURE.md](ARCHITECTURE.md) - Detailed architecture
- [PAGE_FACTORY_GUIDE.md](PAGE_FACTORY_GUIDE.md) - Page Factory patterns
- [SCALABILITY_GUIDE.md](SCALABILITY_GUIDE.md) - Framework extension
- [GETTING_STARTED.md](GETTING_STARTED.md) - Quick start

## Quick Commands

```bash
# Build
mvn clean compile

# Test
mvn test

# Run specific tests
mvn test -Dtest=LoginTest

# Generate reports
mvn surefire-report:report

# Check style
mvn checkstyle:check

# Full lifecycle
mvn clean install test
```

## File Locations

| File | Location |
|------|----------|
| Page Objects | src/main/java/com/automation/pages/ |
| Tests | src/test/java/com/automation/tests/ |
| Utilities | src/main/java/com/automation/utils/ |
| Listeners | src/main/java/com/automation/listeners/ |
| Config | src/main/resources/config.properties |
| Logs | logs/automation.log |
| Screenshots | test-output/screenshots/ |
| Reports | target/surefire-reports/ |

## Support

For issues or questions:
1. Check documentation files
2. Review ARCHITECTURE.md
3. See PAGE_FACTORY_GUIDE.md
4. Refer to SCALABILITY_GUIDE.md
5. Check logs in logs/ directory

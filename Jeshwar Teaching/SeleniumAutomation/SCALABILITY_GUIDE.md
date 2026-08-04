# Framework Scalability & Extension Guide

## Overview

This framework is designed to be highly scalable and extensible. This guide shows you how to expand it with new pages, tests, and features.

## Adding New Page Objects

### Step 1: Create the Page Class

```java
package com.automation.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class SettingsPage extends BasePage {
    
    @FindBy(id = "settingsTitle")
    private WebElement settingsTitle;
    
    @FindBy(id = "profileSettings")
    private WebElement profileSettings;
    
    @FindBy(id = "securitySettings")
    private WebElement securitySettings;
    
    @FindBy(id = "saveButton")
    private WebElement saveButton;
    
    @FindBy(id = "successMessage")
    private WebElement successMessage;
    
    public SettingsPage(WebDriver driver) {
        super(driver);
        logger.info("SettingsPage initialized");
        verifyPageLoaded();
    }
    
    private void verifyPageLoaded() {
        waitForPresence(By.id("settingsTitle"));
        logger.info("Settings page verified");
    }
    
    public String getSettingsTitle() {
        return getText(settingsTitle);
    }
    
    public SettingsPage clickProfileSettings() {
        click(profileSettings);
        return this;
    }
    
    public void saveSettings() {
        click(saveButton);
        waitForPresence(By.id("successMessage"));
    }
}
```

### Step 2: Import and Use in Tests

```java
public class SettingsTest extends BaseTest {
    
    @Test
    public void testUpdateProfileSettings() {
        LoginPage loginPage = new LoginPage(driver);
        DashboardPage dashboard = loginPage.login("user@example.com", "password");
        
        // Navigate to settings
        SettingsPage settings = new SettingsPage(driver);
        settings.clickProfileSettings();
        settings.saveSettings();
        
        Assert.assertTrue(settings.isSuccessMessageDisplayed());
    }
}
```

### Step 3: Add to testng.xml

```xml
<test name="Settings Tests">
    <classes>
        <class name="com.automation.tests.SettingsTest"/>
    </classes>
</test>
```

## Adding New Test Classes

### Step 1: Create Test Class

```java
package com.automation.tests;

import org.testng.Assert;
import org.testng.annotations.Test;
import com.automation.listeners.RetryAnalyzer;

public class CheckoutTest extends BaseTest {
    
    @Test(description = "Complete checkout process", retryAnalyzer = RetryAnalyzer.class)
    public void testCompleteCheckout() {
        // Test implementation
    }
    
    @Test(description = "Apply discount code", retryAnalyzer = RetryAnalyzer.class)
    public void testApplyDiscount() {
        // Test implementation
    }
}
```

### Step 2: Run New Tests

```bash
# Run only new test class
mvn test -Dtest=CheckoutTest

# Run specific test method
mvn test -Dtest=CheckoutTest#testCompleteCheckout

# Run all tests
mvn test
```

## Extending BasePage Functionality

### Add Custom Methods to BasePage

```java
// In BasePage.java

/**
 * Double click on element
 */
protected void doubleClick(WebElement element) {
    try {
        logger.info("Double clicking element");
        Actions actions = new Actions(driver);
        actions.doubleClick(element).perform();
    } catch (Exception e) {
        logger.error("Error double clicking: " + e.getMessage());
        throw new RuntimeException("Failed to double click", e);
    }
}

/**
 * Hover over element
 */
protected void hoverOver(WebElement element) {
    try {
        logger.info("Hovering over element");
        Actions actions = new Actions(driver);
        actions.moveToElement(element).perform();
    } catch (Exception e) {
        logger.error("Error hovering: " + e.getMessage());
        throw new RuntimeException("Failed to hover", e);
    }
}

/**
 * Drag and drop
 */
protected void dragAndDrop(WebElement source, WebElement target) {
    try {
        logger.info("Dragging and dropping elements");
        Actions actions = new Actions(driver);
        actions.dragAndDrop(source, target).perform();
    } catch (Exception e) {
        logger.error("Error in drag and drop: " + e.getMessage());
        throw new RuntimeException("Failed to drag and drop", e);
    }
}

/**
 * Select dropdown by visible text
 */
protected void selectDropdownByText(WebElement dropdown, String text) {
    try {
        logger.info("Selecting dropdown option: " + text);
        Select select = new Select(dropdown);
        select.selectByVisibleText(text);
    } catch (Exception e) {
        logger.error("Error selecting dropdown: " + e.getMessage());
        throw new RuntimeException("Failed to select dropdown", e);
    }
}

/**
 * Get all options from dropdown
 */
protected List<String> getAllDropdownOptions(WebElement dropdown) {
    Select select = new Select(dropdown);
    return select.getOptions()
        .stream()
        .map(WebElement::getText)
        .collect(Collectors.toList());
}

/**
 * Switch to window by title
 */
protected void switchToWindowByTitle(String title) {
    logger.info("Switching to window: " + title);
    for (String windowHandle : driver.getWindowHandles()) {
        driver.switchTo().window(windowHandle);
        if (driver.getTitle().equals(title)) {
            return;
        }
    }
}

/**
 * Accept alert
 */
protected void acceptAlert() {
    try {
        logger.info("Accepting alert");
        wait.until(ExpectedConditions.alertIsPresent()).accept();
    } catch (Exception e) {
        logger.error("Error accepting alert: " + e.getMessage());
        throw new RuntimeException("Failed to accept alert", e);
    }
}

/**
 * Get alert text
 */
protected String getAlertText() {
    try {
        logger.info("Getting alert text");
        return wait.until(ExpectedConditions.alertIsPresent()).getText();
    } catch (Exception e) {
        logger.error("Error getting alert text: " + e.getMessage());
        throw new RuntimeException("Failed to get alert text", e);
    }
}
```

### Update Imports in BasePage

```java
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.Select;
import java.util.List;
import java.util.stream.Collectors;
```

## Creating Page Inheritance Hierarchy

### Common Elements Page

```java
public class BasePage extends BasePage {
    
    @FindBy(id = "header")
    protected WebElement header;
    
    @FindBy(id = "footer")
    protected WebElement footer;
    
    @FindBy(className = "user-menu")
    protected WebElement userMenu;
    
    @FindBy(id = "logoutButton")
    protected WebElement logoutButton;
    
    // Common methods
    public void logout() {
        click(userMenu);
        click(logoutButton);
    }
}
```

### Specific Pages Extending Common

```java
public class ProductPage extends CommonPage {
    
    @FindBy(className = "product-title")
    private WebElement productTitle;
    
    // Inherits logout() and other common methods
}
```

## Data-Driven Testing

### Create Data Provider

```java
public class TestData {
    
    @DataProvider(name = "loginData")
    public static Object[][] getLoginData() {
        return new Object[][] {
            {"validUser@example.com", "password123", true},
            {"invalidUser@example.com", "wrongPassword", false},
            {"", "", false}
        };
    }
    
    @DataProvider(name = "productData")
    public static Object[][] getProductData() {
        return new Object[][] {
            {"Laptop", 5},
            {"Mouse", 2},
            {"Keyboard", 1}
        };
    }
}
```

### Use Data Provider in Test

```java
public class DataDrivenTest extends BaseTest {
    
    @Test(dataProvider = "loginData", dataProviderClass = TestData.class)
    public void testLoginWithMultipleCredentials(String username, String password, boolean shouldSucceed) {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login(username, password);
        
        if (shouldSucceed) {
            Assert.assertTrue(new DashboardPage(driver).isDashboardDisplayed());
        } else {
            Assert.assertTrue(loginPage.isErrorDisplayed());
        }
    }
}
```

## Custom Annotations

### Create Custom Annotation

```java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface SlowTest {
    String description() default "";
    long timeout() default 10000;
}
```

### Use in Tests

```java
@SlowTest(description = "Complex flow test", timeout = 30000)
@Test
public void testComplexFlow() {
    // Test implementation
}
```

## Parallel Test Execution

### Configure in testng.xml

```xml
<suite name="Web Automation Test Suite" 
       parallel="methods" 
       thread-count="5">
    <!-- tests -->
</suite>
```

### Run Parallel Tests

```bash
mvn test -DparallelCount=5
```

## Environment-Specific Configuration

### Create Multiple Config Files

```
src/main/resources/
├── config.properties         # Default
├── config.dev.properties     # Dev environment
├── config.qa.properties      # QA environment
├── config.prod.properties    # Production
```

### Load Environment-Specific Config

```java
public class ConfigReader {
    
    static {
        String environment = System.getProperty("env", "default");
        String configFile = "config." + environment + ".properties";
        // Load properties
    }
}
```

### Run Tests Against Specific Environment

```bash
mvn test -Denv=qa
mvn test -Denv=prod
```

## Implementing Custom Listeners

### Create Custom Listener

```java
public class CustomListener implements ITestListener {
    
    @Override
    public void onTestStart(ITestResult result) {
        System.out.println("Test: " + result.getMethodName() + " started");
    }
    
    @Override
    public void onTestSuccess(ITestResult result) {
        System.out.println("Test: " + result.getMethodName() + " passed");
    }
}
```

### Register Listener

```java
@Listeners(CustomListener.class)
public class MyTest extends BaseTest {
    @Test
    public void myTest() {
        // Test code
    }
}
```

## CI/CD Integration Extensions

### Add SonarQube Analysis

```xml
<!-- In pom.xml -->
<plugin>
    <groupId>org.sonarsource.scanner.maven</groupId>
    <artifactId>sonar-maven-plugin</artifactId>
    <version>3.9.1.2184</version>
</plugin>
```

```bash
mvn clean test sonar:sonar \
  -Dsonar.projectKey=seleniumAutomation \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=your_token
```

### Add Code Coverage

```xml
<!-- In pom.xml -->
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.8</version>
</plugin>
```

## Scalability Checklist

- ✓ Create new page objects for each page
- ✓ Use @FindBy annotations for all elements
- ✓ Extend BasePage for common functionality
- ✓ Keep test methods focused and independent
- ✓ Use data providers for multiple test data
- ✓ Implement custom listeners for specific needs
- ✓ Use configuration management for environments
- ✓ Maintain centralized locator definitions
- ✓ Document page objects and methods
- ✓ Follow naming conventions consistently
- ✓ Use parallel execution for faster test runs
- ✓ Implement proper error handling
- ✓ Add logging at appropriate levels
- ✓ Capture screenshots on failures
- ✓ Use retry analyzer for flaky tests

## Performance Tips

1. **Use ThreadLocal Driver** - Already implemented in framework
2. **Parallel Execution** - Configure thread-count in testng.xml
3. **Lazy Initialization** - Page Factory provides this automatically
4. **Efficient Waits** - Use appropriate wait timeouts
5. **Minimize Network Calls** - Mock services when possible
6. **Resource Cleanup** - Ensure proper teardown in BaseTest
7. **Cache Page Objects** - Reuse instances when possible
8. **Use Headless Mode** - Faster execution in CI/CD
9. **Batch Operations** - Group related assertions
10. **Monitor Performance** - Log timing information

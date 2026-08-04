# Page Factory & Page Object Model - Implementation Guide

## What is Page Factory?

Page Factory is a class provided by Selenium that provides support for a more optimized way to create page objects using annotations instead of `By` locators.

### Before Page Factory (Traditional POM)
```java
public class LoginPage {
    private WebDriver driver;
    private By usernameField = By.id("username");
    private By passwordField = By.id("password");
    
    public void login(String user, String pass) {
        driver.findElement(usernameField).sendKeys(user);
        driver.findElement(passwordField).sendKeys(pass);
    }
}
```

### After Page Factory (Modern POM)
```java
public class LoginPage extends BasePage {
    @FindBy(id = "username")
    private WebElement usernameField;
    
    @FindBy(id = "password")
    private WebElement passwordField;
    
    public LoginPage(WebDriver driver) {
        super(driver);  // Initializes Page Factory
    }
    
    public void login(String user, String pass) {
        usernameField.sendKeys(user);
        passwordField.sendKeys(pass);
    }
}
```

## Benefits of Page Factory

| Feature | Benefit |
|---------|---------|
| Lazy Initialization | Elements loaded only when accessed |
| Cleaner Code | Annotations instead of By locators |
| Reusability | Centralized element definitions |
| Maintainability | Changes in one place |
| Performance | Proxy pattern optimization |
| Type Safety | Direct WebElement references |

## Locator Strategies with @FindBy

### 1. ID Locator
```java
@FindBy(id = "element_id")
private WebElement element;
```

### 2. Name Locator
```java
@FindBy(name = "element_name")
private WebElement element;
```

### 3. Class Name Locator
```java
@FindBy(className = "class_name")
private WebElement element;
```

### 4. CSS Selector
```java
@FindBy(css = "input[type='text']")
private WebElement element;
```

### 5. XPath
```java
@FindBy(xpath = "//input[@id='username']")
private WebElement element;
```

### 6. Link Text
```java
@FindBy(linkText = "Click Here")
private WebElement element;
```

### 7. Partial Link Text
```java
@FindBy(partialLinkText = "Click")
private WebElement element;
```

### 8. Tag Name
```java
@FindBy(tagName = "input")
private WebElement element;
```

### 9. Multiple Locators with @FindBys
```java
@FindBys({
    @FindBy(name = "form"),
    @FindBy(name = "username")
})
private WebElement element;
```

### 10. OR Locator with @FindAll
```java
@FindAll({
    @FindBy(id = "username"),
    @FindBy(name = "user"),
    @FindBy(xpath = "//input[@class='user-input']")
})
private WebElement element;  // First match is used
```

## Creating Your First Page Object

### Step 1: Define the Page Class
```java
package com.automation.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class HomePage extends BasePage {
    
    public HomePage(WebDriver driver) {
        super(driver);  // PageFactory.initElements() called here
    }
}
```

### Step 2: Add Elements using @FindBy
```java
public class HomePage extends BasePage {
    
    @FindBy(id = "searchBox")
    private WebElement searchBox;
    
    @FindBy(xpath = "//button[@class='search-btn']")
    private WebElement searchButton;
    
    @FindBy(className = "product-list")
    private WebElement productList;
    
    public HomePage(WebDriver driver) {
        super(driver);
    }
}
```

### Step 3: Implement Page Methods
```java
public class HomePage extends BasePage {
    
    @FindBy(id = "searchBox")
    private WebElement searchBox;
    
    @FindBy(xpath = "//button[@class='search-btn']")
    private WebElement searchButton;
    
    public HomePage searchFor(String query) {
        logger.info("Searching for: " + query);
        enterText(searchBox, query);
        click(searchButton);
        return this;
    }
    
    public boolean isSearchResultsDisplayed() {
        return isElementDisplayed(productList);
    }
}
```

### Step 4: Use in Tests
```java
public class HomeTest extends BaseTest {
    
    @Test
    public void testSearch() {
        HomePage home = new HomePage(driver);
        home.searchFor("laptop")
            .verifySearchResults();
    }
}
```

## Advanced Page Object Patterns

### 1. Fluent API Pattern
```java
public class LoginPage extends BasePage {
    
    @FindBy(id = "username")
    private WebElement usernameField;
    
    @FindBy(id = "password")
    private WebElement passwordField;
    
    @FindBy(id = "loginBtn")
    private WebElement loginButton;
    
    // Fluent methods return 'this'
    public LoginPage enterUsername(String username) {
        enterText(usernameField, username);
        return this;  // Return page for chaining
    }
    
    public LoginPage enterPassword(String password) {
        enterText(passwordField, password);
        return this;
    }
    
    // Returns different page on navigation
    public DashboardPage clickLogin() {
        click(loginButton);
        return new DashboardPage(driver);
    }
    
    // Usage
    DashboardPage dashboard = new LoginPage(driver)
        .enterUsername("user@example.com")
        .enterPassword("password123")
        .clickLogin();
}
```

### 2. Page Inheritance
```java
// Base page with common elements
public class CommonPage extends BasePage {
    
    @FindBy(id = "header")
    protected WebElement header;
    
    @FindBy(className = "logout-btn")
    protected WebElement logoutButton;
    
    public CommonPage(WebDriver driver) {
        super(driver);
    }
}

// Specific page extending common page
public class ProductPage extends CommonPage {
    
    @FindBy(className = "product-title")
    private WebElement productTitle;
    
    @FindBy(id = "addToCart")
    private WebElement addToCartButton;
    
    public ProductPage(WebDriver driver) {
        super(driver);
    }
    
    public String getProductTitle() {
        return getText(productTitle);
    }
}
```

### 3. Dynamic Elements with IndexedElementList
```java
public class ProductListPage extends BasePage {
    
    @FindBy(className = "product-item")
    private List<WebElement> productItems;
    
    public ProductListPage(WebDriver driver) {
        super(driver);
    }
    
    public void clickProductByIndex(int index) {
        if (index < productItems.size()) {
            click(productItems.get(index));
        }
    }
    
    public int getProductCount() {
        return productItems.size();
    }
}
```

### 4. Optional Elements
```java
public class HomePage extends BasePage {
    
    @FindBy(id = "banner")
    private WebElement banner;
    
    @FindBy(className = "newsletter")
    private WebElement newsletter;
    
    public HomePage(WebDriver driver) {
        super(driver);
    }
    
    public boolean isBannerPresent() {
        return isElementPresent(By.id("banner"));
    }
    
    public boolean isNewsletterVisible() {
        return isElementDisplayed(newsletter);
    }
}
```

## Complete Example: E-commerce Page Objects

### ProductCatalogPage.java
```java
public class ProductCatalogPage extends BasePage {
    
    @FindBy(id = "searchInput")
    private WebElement searchInput;
    
    @FindBy(xpath = "//button[contains(text(), 'Search')]")
    private WebElement searchButton;
    
    @FindBy(className = "product-card")
    private List<WebElement> productCards;
    
    @FindBy(id = "priceFilter")
    private WebElement priceFilter;
    
    @FindBy(className = "sort-dropdown")
    private WebElement sortDropdown;
    
    @FindBy(className = "pagination")
    private WebElement pagination;
    
    public ProductCatalogPage(WebDriver driver) {
        super(driver);
        logger.info("ProductCatalogPage loaded");
    }
    
    public ProductCatalogPage searchProduct(String productName) {
        logger.info("Searching for product: " + productName);
        enterText(searchInput, productName);
        click(searchButton);
        waitForPresence(By.className("product-card"));
        return this;
    }
    
    public ProductDetailPage selectProduct(int productIndex) {
        if (productIndex < productCards.size()) {
            click(productCards.get(productIndex));
            return new ProductDetailPage(driver);
        }
        throw new IndexOutOfBoundsException("Product index out of range");
    }
    
    public int getProductCount() {
        return productCards.size();
    }
    
    public ProductCatalogPage filterByPrice(String maxPrice) {
        enterText(priceFilter, maxPrice);
        return this;
    }
    
    public ProductCatalogPage sortBy(String sortOption) {
        click(sortDropdown);
        // Additional logic for selection
        return this;
    }
}
```

### ProductDetailPage.java
```java
public class ProductDetailPage extends BasePage {
    
    @FindBy(className = "product-title")
    private WebElement productTitle;
    
    @FindBy(className = "product-price")
    private WebElement productPrice;
    
    @FindBy(className = "product-description")
    private WebElement productDescription;
    
    @FindBy(id = "addToCartBtn")
    private WebElement addToCartButton;
    
    @FindBy(className = "quantity-input")
    private WebElement quantityInput;
    
    @FindBy(xpath = "//button[contains(text(), 'Back')]")
    private WebElement backButton;
    
    public ProductDetailPage(WebDriver driver) {
        super(driver);
        logger.info("ProductDetailPage loaded");
        verifyPageLoaded();
    }
    
    private void verifyPageLoaded() {
        try {
            waitForClickableElement(addToCartButton);
            logger.info("Product detail page verified");
        } catch (Exception e) {
            logger.error("Product detail page failed to load: " + e.getMessage());
            throw new RuntimeException("Product detail page not loaded", e);
        }
    }
    
    public String getProductTitle() {
        return getText(productTitle);
    }
    
    public String getProductPrice() {
        return getText(productPrice);
    }
    
    public String getProductDescription() {
        return getText(productDescription);
    }
    
    public CartPage addToCart() {
        logger.info("Adding product to cart");
        click(addToCartButton);
        return new CartPage(driver);
    }
    
    public CartPage addToCartWithQuantity(int quantity) {
        enterText(quantityInput, String.valueOf(quantity));
        click(addToCartButton);
        return new CartPage(driver);
    }
    
    public ProductCatalogPage goBack() {
        click(backButton);
        return new ProductCatalogPage(driver);
    }
}
```

### CartPage.java
```java
public class CartPage extends BasePage {
    
    @FindBy(className = "cart-item")
    private List<WebElement> cartItems;
    
    @FindBy(className = "item-price")
    private List<WebElement> itemPrices;
    
    @FindBy(id = "totalPrice")
    private WebElement totalPrice;
    
    @FindBy(id = "checkoutBtn")
    private WebElement checkoutButton;
    
    @FindBy(xpath = "//button[contains(text(), 'Remove')]")
    private List<WebElement> removeButtons;
    
    @FindBy(className = "empty-cart-message")
    private WebElement emptyCartMessage;
    
    public CartPage(WebDriver driver) {
        super(driver);
        logger.info("CartPage loaded");
    }
    
    public int getCartItemCount() {
        return cartItems.size();
    }
    
    public String getTotalPrice() {
        return getText(totalPrice);
    }
    
    public CartPage removeItem(int itemIndex) {
        if (itemIndex < removeButtons.size()) {
            click(removeButtons.get(itemIndex));
        }
        return this;
    }
    
    public CheckoutPage proceedToCheckout() {
        click(checkoutButton);
        return new CheckoutPage(driver);
    }
    
    public boolean isCartEmpty() {
        return isElementDisplayed(emptyCartMessage);
    }
}
```

### Test Example
```java
public class PurchaseFlowTest extends BaseTest {
    
    @Test
    public void testCompleteProductPurchase() {
        ProductCatalogPage catalog = new ProductCatalogPage(driver);
        
        ProductDetailPage product = catalog
            .searchProduct("Laptop")
            .selectProduct(0);
        
        String title = product.getProductTitle();
        String price = product.getProductPrice();
        
        logger.info("Product: " + title + ", Price: " + price);
        
        CartPage cart = product.addToCartWithQuantity(1);
        
        Assert.assertEquals(cart.getCartItemCount(), 1);
        
        CheckoutPage checkout = cart.proceedToCheckout();
        
        // Continue with checkout flow
    }
}
```

## Tips for Scalable Framework

1. **Use Inheritance** - Extend BasePage for common functionality
2. **Group Related Elements** - Keep related WebElements together
3. **Use Fluent API** - Return `this` for method chaining
4. **Page Transitions** - Return new page object on navigation
5. **Verification Methods** - Add page load verification
6. **Logging** - Log important actions
7. **Exception Handling** - Handle element not found gracefully
8. **Waits** - Use explicit waits from BasePage
9. **Comments** - Document complex selectors
10. **Modular Tests** - Use page methods in tests

## Common Mistakes to Avoid

❌ **Using WebDriver in tests** - Always use page objects
❌ **Hardcoding locators** - Define as @FindBy
❌ **No error handling** - Wrap in try-catch
❌ **Poor naming** - Use descriptive method names
❌ **Missing waits** - Always use explicit waits
❌ **No logging** - Add comprehensive logging
❌ **Large methods** - Keep methods focused
❌ **Ignoring page verification** - Verify page loaded

✓ **DO use Page Factory** - For automatic initialization
✓ **DO extend BasePage** - For common methods
✓ **DO implement fluent API** - For readable tests
✓ **DO handle exceptions** - Graceful failure
✓ **DO document selectors** - For maintenance
✓ **DO use explicit waits** - For reliability
✓ **DO keep it DRY** - Don't repeat code
✓ **DO add logging** - For debugging

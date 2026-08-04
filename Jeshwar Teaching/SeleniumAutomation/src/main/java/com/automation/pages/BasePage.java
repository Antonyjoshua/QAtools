package com.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import java.time.Duration;

/**
 * Base Page Object class containing common page methods and Page Factory initialization
 * Implements POM with Page Factory for robust and scalable test automation
 */
public class BasePage {
    protected static final Logger logger = LogManager.getLogger(BasePage.class);
    protected WebDriver driver;
    protected WebDriverWait wait;
    protected WebDriverWait shortWait;
    protected static final int EXPLICIT_WAIT_TIMEOUT = 20;
    protected static final int SHORT_WAIT_TIMEOUT = 5;

    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(EXPLICIT_WAIT_TIMEOUT));
        this.shortWait = new WebDriverWait(driver, Duration.ofSeconds(SHORT_WAIT_TIMEOUT));
        
        // Initialize Page Factory elements
        PageFactory.initElements(driver, this);
        logger.info(this.getClass().getSimpleName() + " initialized with Page Factory");
    }

    /**
     * Wait for element to be visible with retry mechanism
     */
    protected WebElement waitForElement(By locator) {
        try {
            logger.debug("Waiting for element visibility: " + locator);
            return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
        } catch (TimeoutException e) {
            logger.error("Timeout waiting for element: " + locator);
            throw new RuntimeException("Element not found within timeout: " + locator, e);
        }
    }

    /**
     * Wait for element to be clickable
     */
    protected WebElement waitForClickable(By locator) {
        try {
            logger.debug("Waiting for element to be clickable: " + locator);
            return wait.until(ExpectedConditions.elementToBeClickable(locator));
        } catch (TimeoutException e) {
            logger.error("Timeout waiting for element to be clickable: " + locator);
            throw new RuntimeException("Element not clickable within timeout: " + locator, e);
        }
    }

    /**
     * Wait for element to be clickable with WebElement
     */
    protected void waitForClickableElement(WebElement element) {
        try {
            logger.debug("Waiting for WebElement to be clickable");
            wait.until(ExpectedConditions.elementToBeClickable(element));
        } catch (TimeoutException e) {
            logger.error("Timeout waiting for WebElement to be clickable");
            throw new RuntimeException("WebElement not clickable within timeout", e);
        }
    }

    /**
     * Click element with retry mechanism
     */
    protected void click(WebElement element) {
        try {
            logger.info("Clicking WebElement");
            waitForClickableElement(element);
            element.click();
            logger.debug("Successfully clicked element");
        } catch (StaleElementReferenceException e) {
            logger.warn("Stale element reference, retrying click");
            try {
                Thread.sleep(500);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                logger.error("Thread interrupted during sleep: " + ie.getMessage());
            }
            element.click();
        } catch (Exception e) {
            logger.error("Error clicking element: " + e.getMessage());
            throw new RuntimeException("Failed to click element", e);
        }
    }

    /**
     * Click element by locator
     */
    protected void click(By locator) {
        try {
            logger.info("Clicking element: " + locator);
            WebElement element = waitForClickable(locator);
            element.click();
            logger.debug("Successfully clicked element");
        } catch (Exception e) {
            logger.error("Error clicking element " + locator + ": " + e.getMessage());
            throw new RuntimeException("Failed to click element: " + locator, e);
        }
    }

    /**
     * Enter text with clear and verification
     */
    protected void enterText(WebElement element, String text) {
        try {
            logger.info("Entering text: " + text);
            waitForClickableElement(element);
            element.clear();
            element.sendKeys(text);
            
            // Verify text was entered correctly
            if (!element.getAttribute("value").contains(text)) {
                logger.warn("Text verification failed, attempting again");
                element.clear();
                element.sendKeys(text);
            }
            logger.debug("Text entered successfully");
        } catch (Exception e) {
            logger.error("Error entering text: " + e.getMessage());
            throw new RuntimeException("Failed to enter text", e);
        }
    }

    /**
     * Enter text by locator
     */
    protected void enterText(By locator, String text) {
        try {
            logger.info("Entering text: " + text + " in element: " + locator);
            WebElement element = waitForElement(locator);
            element.clear();
            element.sendKeys(text);
            logger.debug("Text entered successfully");
        } catch (Exception e) {
            logger.error("Error entering text in " + locator + ": " + e.getMessage());
            throw new RuntimeException("Failed to enter text", e);
        }
    }

    /**
     * Get text from element
     */
    protected String getText(WebElement element) {
        try {
            logger.debug("Getting text from WebElement");
            waitForClickableElement(element);
            String text = element.getText();
            logger.info("Retrieved text: " + text);
            return text;
        } catch (Exception e) {
            logger.error("Error getting text: " + e.getMessage());
            throw new RuntimeException("Failed to get text", e);
        }
    }

    /**
     * Get text by locator
     */
    protected String getText(By locator) {
        try {
            logger.debug("Getting text from element: " + locator);
            String text = waitForElement(locator).getText();
            logger.info("Retrieved text: " + text);
            return text;
        } catch (Exception e) {
            logger.error("Error getting text from " + locator + ": " + e.getMessage());
            throw new RuntimeException("Failed to get text", e);
        }
    }

    /**
     * Get attribute value
     */
    protected String getAttribute(WebElement element, String attribute) {
        try {
            logger.debug("Getting attribute: " + attribute);
            return element.getAttribute(attribute);
        } catch (Exception e) {
            logger.error("Error getting attribute: " + e.getMessage());
            throw new RuntimeException("Failed to get attribute", e);
        }
    }

    /**
     * Check if element is displayed
     */
    protected boolean isElementDisplayed(WebElement element) {
        try {
            return element.isDisplayed();
        } catch (NoSuchElementException e) {
            logger.warn("Element not found");
            return false;
        } catch (Exception e) {
            logger.warn("Element not displayed: " + e.getMessage());
            return false;
        }
    }

    /**
     * Check if element is displayed by locator
     */
    protected boolean isElementDisplayed(By locator) {
        try {
            return driver.findElement(locator).isDisplayed();
        } catch (NoSuchElementException e) {
            logger.warn("Element not found: " + locator);
            return false;
        } catch (Exception e) {
            logger.warn("Element not displayed: " + locator);
            return false;
        }
    }

    /**
     * Check if element exists
     */
    protected boolean isElementPresent(By locator) {
        try {
            driver.findElement(locator);
            return true;
        } catch (NoSuchElementException e) {
            logger.warn("Element not present: " + locator);
            return false;
        }
    }

    /**
     * Wait for element presence
     */
    protected WebElement waitForPresence(By locator) {
        try {
            logger.debug("Waiting for element presence: " + locator);
            return wait.until(ExpectedConditions.presenceOfElementLocated(locator));
        } catch (TimeoutException e) {
            logger.error("Timeout waiting for element presence: " + locator);
            throw new RuntimeException("Element not present within timeout: " + locator, e);
        }
    }

    /**
     * Wait for element invisibility
     */
    protected void waitForInvisibility(By locator) {
        try {
            logger.debug("Waiting for element invisibility: " + locator);
            wait.until(ExpectedConditions.invisibilityOfElementLocated(locator));
        } catch (TimeoutException e) {
            logger.warn("Element still visible after timeout: " + locator);
        }
    }

    /**
     * Switch to iframe
     */
    protected void switchToFrame(WebElement frameElement) {
        try {
            logger.info("Switching to iframe");
            driver.switchTo().frame(frameElement);
        } catch (Exception e) {
            logger.error("Error switching to frame: " + e.getMessage());
            throw new RuntimeException("Failed to switch to frame", e);
        }
    }

    /**
     * Switch to default content
     */
    protected void switchToDefaultContent() {
        try {
            logger.info("Switching to default content");
            driver.switchTo().defaultContent();
        } catch (Exception e) {
            logger.error("Error switching to default content: " + e.getMessage());
            throw new RuntimeException("Failed to switch to default content", e);
        }
    }

    /**
     * Get page title
     */
    public String getPageTitle() {
        logger.debug("Getting page title");
        return driver.getTitle();
    }

    /**
     * Get current URL
     */
    public String getCurrentUrl() {
        logger.debug("Getting current URL");
        return driver.getCurrentUrl();
    }

    /**
     * Refresh page
     */
    public void refreshPage() {
        logger.info("Refreshing page");
        driver.navigate().refresh();
    }
}

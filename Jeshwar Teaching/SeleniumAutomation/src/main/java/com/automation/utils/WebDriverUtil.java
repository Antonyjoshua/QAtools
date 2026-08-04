package com.automation.utils;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * WebDriver Manager utility class to handle browser initialization and cleanup
 */
public class WebDriverUtil {
    private static final Logger logger = LogManager.getLogger(WebDriverUtil.class);
    private static ThreadLocal<WebDriver> driver = new ThreadLocal<>();

    /**
     * Initialize WebDriver based on browser type
     */
    public static WebDriver initializeDriver(String browserName, boolean headless) {
        logger.info("Initializing WebDriver for browser: " + browserName);
        
        switch (browserName.toLowerCase()) {
            case "chrome":
                WebDriverManager.chromedriver().setup();
                ChromeOptions chromeOptions = new ChromeOptions();
                if (headless) {
                    chromeOptions.addArguments("--headless");
                }
                chromeOptions.addArguments("--no-sandbox");
                chromeOptions.addArguments("--disable-dev-shm-usage");
                driver.set(new ChromeDriver(chromeOptions));
                break;

            case "firefox":
                WebDriverManager.firefoxdriver().setup();
                FirefoxOptions firefoxOptions = new FirefoxOptions();
                if (headless) {
                    firefoxOptions.addArguments("--headless");
                }
                driver.set(new FirefoxDriver(firefoxOptions));
                break;

            default:
                logger.warn("Browser type not recognized. Defaulting to Chrome.");
                WebDriverManager.chromedriver().setup();
                driver.set(new ChromeDriver());
        }
        
        driver.get().manage().window().maximize();
        logger.info("WebDriver initialized successfully");
        return driver.get();
    }

    /**
     * Get the current WebDriver instance
     */
    public static WebDriver getDriver() {
        if (driver.get() == null) {
            logger.warn("WebDriver is not initialized");
        }
        return driver.get();
    }

    /**
     * Quit the WebDriver and clean up resources
     */
    public static void quitDriver() {
        try {
            if (driver.get() != null) {
                driver.get().quit();
                logger.info("WebDriver closed successfully");
            }
        } catch (Exception e) {
            logger.error("Error closing WebDriver: " + e.getMessage());
        } finally {
            driver.remove();
        }
    }
}

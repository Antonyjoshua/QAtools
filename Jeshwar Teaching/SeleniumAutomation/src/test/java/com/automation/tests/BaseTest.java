package com.automation.tests;

import com.automation.utils.ConfigReader;
import com.automation.utils.WebDriverUtil;
import com.automation.utils.ScreenshotUtil;
import com.automation.listeners.TestListener;
import org.openqa.selenium.WebDriver;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Listeners;
import org.testng.annotations.Optional;
import org.testng.annotations.Parameters;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Base Test class containing common setup and teardown logic
 * Implements robust test initialization and cleanup with TestNG listeners
 */
@Listeners(TestListener.class)
public class BaseTest {
    protected static final Logger logger = LogManager.getLogger(BaseTest.class);
    protected WebDriver driver;

    @Parameters({"headless"})
    @BeforeMethod(alwaysRun = true)
    public void setUp(@Optional String headlessParam) {
        try {
            logger.info("Starting test setup...");

            // Initialize WebDriver
            String browser = ConfigReader.getProperty("browser", "chrome");
            // XML parameter takes priority; falls back to config.properties
            boolean headless = (headlessParam != null)
                    ? Boolean.parseBoolean(headlessParam)
                    : ConfigReader.getPropertyAsBoolean("headless");
            
            driver = WebDriverUtil.initializeDriver(browser, headless);
            logger.info("WebDriver initialized successfully - Browser: " + browser);
            
            // Navigate to application
            String baseUrl = ConfigReader.getProperty("base_url");
            driver.navigate().to(baseUrl);
            logger.info("Navigated to: " + baseUrl);
            
            // Set page load timeout
            int pageLoadTimeout = ConfigReader.getPropertyAsInt("page_load_timeout");
            driver.manage().timeouts().pageLoadTimeout(java.time.Duration.ofSeconds(pageLoadTimeout));
            
            // Set implicit wait
            int implicitWait = ConfigReader.getPropertyAsInt("implicit_wait");
            driver.manage().timeouts().implicitlyWait(java.time.Duration.ofSeconds(implicitWait));
            
            logger.info("Test setup completed successfully");
            
        } catch (Exception e) {
            logger.error("Error during test setup: " + e.getMessage());
            throw new RuntimeException("Failed to setup test", e);
        }
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown(ITestResult result) {
        try {
            logger.info("Starting test teardown...");
            
            // Capture screenshot on failure
            if (!result.isSuccess()) {
                logger.error("Test failed: " + result.getMethod().getMethodName());
                
                if (ConfigReader.getPropertyAsBoolean("screenshot_on_failure")) {
                    try {
                        String screenshotPath = ScreenshotUtil.takeScreenshot(
                            driver, 
                            result.getMethod().getMethodName()
                        );
                        logger.info("Screenshot saved at: " + screenshotPath);
                        result.setAttribute("screenshot", screenshotPath);
                    } catch (Exception e) {
                        logger.warn("Failed to take screenshot: " + e.getMessage());
                    }
                }
            } else {
                logger.info("Test passed: " + result.getMethod().getMethodName());
            }
            
            // Close WebDriver
            WebDriverUtil.quitDriver();
            logger.info("WebDriver closed successfully");
            
        } catch (Exception e) {
            logger.error("Error during test teardown: " + e.getMessage());
        } finally {
            logger.info("Test teardown completed");
        }
    }

    /**
     * Get current WebDriver instance
     */
    protected WebDriver getDriver() {
        return driver;
    }
}


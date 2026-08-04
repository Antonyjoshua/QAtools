package com.automation.utils;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Screenshot utility for capturing screenshots during test execution
 */
public class ScreenshotUtil {
    private static final Logger logger = LogManager.getLogger(ScreenshotUtil.class);

    /**
     * Capture and save screenshot
     */
    public static String takeScreenshot(WebDriver driver, String testName) {
        try {
            String screenshotPath = ConfigReader.getProperty("screenshot_path", "./test-output/screenshots/");
            File screenshotDir = new File(screenshotPath);
            
            if (!screenshotDir.exists()) {
                screenshotDir.mkdirs();
            }

            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy_MM_dd_HH_mm_ss");
            String fileName = testName + "_" + dtf.format(LocalDateTime.now()) + ".png";
            String filePath = screenshotPath + fileName;

            TakesScreenshot takesScreenshot = (TakesScreenshot) driver;
            File sourceFile = takesScreenshot.getScreenshotAs(OutputType.FILE);
            File destFile = new File(filePath);
            FileUtils.copyFile(sourceFile, destFile);

            logger.info("Screenshot saved: " + filePath);
            return filePath;
        } catch (Exception e) {
            logger.error("Failed to take screenshot: " + e.getMessage());
            return null;
        }
    }
}

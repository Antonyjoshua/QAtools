package com.automation.listeners;

import org.testng.ITestListener;
import org.testng.ITestResult;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * TestNG Listener for test execution events
 * Handles test start, success, failure, and skip scenarios
 */
public class TestListener implements ITestListener {
    private static final Logger logger = LogManager.getLogger(TestListener.class);

    @Override
    public void onTestStart(ITestResult result) {
        logger.info("==========================================");
        logger.info("Test Started: " + result.getMethod().getMethodName());
        logger.info("Test Class: " + result.getTestClass().getName());
        logger.info("==========================================");
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        logger.info("✓ Test PASSED: " + result.getMethod().getMethodName());
        logger.info("Duration: " + (result.getEndMillis() - result.getStartMillis()) + "ms");
        logger.info("==========================================\n");
    }

    @Override
    public void onTestFailure(ITestResult result) {
        logger.error("✗ Test FAILED: " + result.getMethod().getMethodName());
        logger.error("Failure Message: " + result.getThrowable().getMessage());
        logger.error("Stack Trace:", result.getThrowable());
        logger.error("Duration: " + (result.getEndMillis() - result.getStartMillis()) + "ms");
        logger.info("Screenshot and details captured in tearDown method");
        logger.error("==========================================\n");
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        logger.warn("⊗ Test SKIPPED: " + result.getMethod().getMethodName());
        logger.warn("Skip Message: " + result.getThrowable());
        logger.warn("==========================================\n");
    }

    @Override
    public void onTestFailedButWithinSuccessPercentage(ITestResult result) {
        logger.info("Test Failed but within success percentage: " + result.getMethod().getMethodName());
    }
}

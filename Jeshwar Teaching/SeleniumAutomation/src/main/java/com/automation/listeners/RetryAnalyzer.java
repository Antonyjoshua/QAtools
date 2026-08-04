package com.automation.listeners;

import org.testng.IRetryAnalyzer;
import org.testng.ITestResult;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Retry Analyzer for flaky tests
 * Automatically retries failed tests up to a specified number of times
 */
public class RetryAnalyzer implements IRetryAnalyzer {
    private static final Logger logger = LogManager.getLogger(RetryAnalyzer.class);
    private static final int MAX_RETRY_COUNT = 2;
    private int retryCount = 0;

    @Override
    public boolean retry(ITestResult result) {
        if (retryCount < MAX_RETRY_COUNT) {
            retryCount++;
            logger.warn("Retrying test: " + result.getMethod().getMethodName() + 
                       " (Attempt " + (retryCount + 1) + " of " + (MAX_RETRY_COUNT + 1) + ")");
            return true;
        }
        return false;
    }

    /**
     * Get current retry count
     */
    public int getRetryCount() {
        return retryCount;
    }

    /**
     * Reset retry count
     */
    public void resetRetryCount() {
        retryCount = 0;
    }
}

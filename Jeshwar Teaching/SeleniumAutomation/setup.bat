@echo off
REM Selenium Automation Framework Setup Script for Windows

echo ==========================================
echo Selenium Automation Framework Setup
echo ==========================================

REM Check Java installation
echo Checking Java installation...
java -version
if %errorlevel% neq 0 (
    echo Java is not installed. Please install Java 11 or higher.
    exit /b 1
)

REM Check Maven installation
echo Checking Maven installation...
mvn -version
if %errorlevel% neq 0 (
    echo Maven is not installed. Please install Maven 3.6.0 or higher.
    exit /b 1
)

REM Build project
echo Building project...
mvn clean install

if %errorlevel% equ 0 (
    echo ==========================================
    echo Setup completed successfully!
    echo ==========================================
    echo.
    echo Next steps:
    echo 1. Update config.properties with your application URL
    echo 2. Update page objects with your application selectors
    echo 3. Run tests: mvn test
) else (
    echo Setup failed. Please check the error messages above.
    exit /b 1
)

pause

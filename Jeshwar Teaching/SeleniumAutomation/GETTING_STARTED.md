# Selenium Automation Framework - Setup Guide

## Quick Start Guide

### 1. Prerequisites
- Java 11 or higher
- Maven 3.6.0+
- Git
- Browser: Chrome or Firefox

### 2. Clone & Setup

```bash
# Clone the repository
git clone <repository-url>
cd SeleniumAutomation

# Build the project
mvn clean install
```

### 3. Update Configuration
Edit `src/main/resources/config.properties`:
```properties
browser=chrome
base_url=https://your-app-url.com
headless=false
```

### 4. Update Selectors
Update page objects in `src/main/java/com/automation/pages/` with your application selectors.

### 5. Create Your Tests
Create test classes in `src/test/java/com/automation/tests/` extending `BaseTest`.

### 6. Run Tests

```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=LoginTest

# Run with headless browser
mvn test -Dheadless=true
```

### 7. View Reports
- TestNG Reports: `test-output/index.html`
- Surefire Reports: `target/surefire-reports/`
- Screenshots: `test-output/screenshots/`
- Logs: `logs/automation.log`

## CI/CD Setup

### GitHub Actions
- Workflow: `.github/workflows/ci-cd.yml`
- Automatically runs on push/PR to main/develop
- Tests on Java 11 and 17
- Generates reports and artifacts

### Jenkins
- Workflow: `Jenkinsfile`
- Create a Pipeline job pointing to Jenkinsfile
- Configure webhook for automatic triggers

## Framework Architecture

```
Page Object Model (POM)
    ↓
Base Test Class (Setup/Teardown)
    ↓
Test Classes
    ↓
Utilities (WebDriver, Config, Screenshot)
    ↓
Configuration (Properties, Log4j)
```

## Project Statistics

- **Framework**: Selenium 4.14.1 + TestNG 7.9.0
- **Build Tool**: Maven 3.6.0+
- **Language**: Java 11+
- **Structure**: Maven Standard Directory Layout
- **Design Pattern**: Page Object Model
- **CI/CD**: GitHub Actions, Jenkins

## Key Features

✓ Automatic WebDriver management
✓ ConfigReader for externalized config
✓ Screenshot on test failure
✓ Comprehensive logging with Log4j2
✓ TestNG reporting and configuration
✓ GitHub Actions workflow
✓ Jenkins pipeline support
✓ Page Object Model pattern
✓ Base test class with setup/teardown
✓ Exception handling and waits

## Troubleshooting

| Issue | Solution |
|-------|----------|
| WebDriver not found | WebDriverManager handles this automatically |
| Tests failing | Check logs/automation.log and screenshots folder |
| Config not loading | Verify config.properties path and properties |
| Maven compilation fails | Run `mvn clean install -U` to force update |

## Next Steps

1. Configure your application URL and credentials
2. Update page selectors for your application
3. Write your test cases
4. Setup CI/CD pipeline
5. Run tests and generate reports

---
For more details, see README.md

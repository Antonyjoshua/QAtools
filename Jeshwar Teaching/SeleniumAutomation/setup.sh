#!/bin/bash

# Selenium Automation Framework Setup Script

echo "=========================================="
echo "Selenium Automation Framework Setup"
echo "=========================================="

# Check Java installation
echo "Checking Java installation..."
java -version
if [ $? -ne 0 ]; then
    echo "Java is not installed. Please install Java 11 or higher."
    exit 1
fi

# Check Maven installation
echo "Checking Maven installation..."
mvn -version
if [ $? -ne 0 ]; then
    echo "Maven is not installed. Please install Maven 3.6.0 or higher."
    exit 1
fi

# Build project
echo "Building project..."
mvn clean install

if [ $? -eq 0 ]; then
    echo "=========================================="
    echo "Setup completed successfully!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Update config.properties with your application URL"
    echo "2. Update page objects with your application selectors"
    echo "3. Run tests: mvn test"
else
    echo "Setup failed. Please check the error messages above."
    exit 1
fi

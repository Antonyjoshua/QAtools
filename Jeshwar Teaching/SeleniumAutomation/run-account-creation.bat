@echo off
set MAVEN_HOME=C:\Program Files\apache-maven-3.9.16
set JAVA_HOME=C:\Program Files\Java\jdk-26

echo Running Account Creation Test...
"%MAVEN_HOME%\bin\mvn.cmd" test -DsuiteXmlFile=testsuite/account-creation-testng.xml

pause

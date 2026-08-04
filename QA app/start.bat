@echo off
echo Starting QA Assistant...
echo.
echo Server will run on http://localhost:3001
echo App will open on   http://localhost:3000
echo.
echo Press Ctrl+C to stop.
echo.
cd /d "%~dp0"
npm run dev

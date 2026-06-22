@echo off
echo ===================================================
echo Setting up Jenkins Environment for Playwright
echo ===================================================

echo [1/3] Installing NPM Dependencies...
call npm install

echo [2/3] Installing Playwright Browsers...
call npx playwright install chromium

echo [3/3] Cleaning up old Allure results...
call npm run clean:allure

echo ===================================================
echo Environment setup completed successfully!
echo You can now run your test scripts.
echo ===================================================

import { test, expect } from "../fixture/hooks-fixture"
import data from "../test-data/testdata.json"

// All authentication tests need a fresh session (no pre-existing login)
test.describe("Authentication Tests", () => {

    test.use({
        storageState: {
            cookies: [],
            origins: []
        }
    });

    // ─────────────────────────────────────────────
    // 1. Functional Test Cases (Happy Path)
    // ─────────────────────────────────────────────

    test.describe("Valid Login Scenarios (Data-Driven)", () => {

        for (const user of data.validLoginUsers) {
            test(`Valid Login: ${user.description} (${user.username})`, { tag: ['@QA', '@UAT', '@smoke', '@regression', '@sanity'] }, async ({ loginPage, productsPage, page }) => {

                // 1. Navigate to login page
                await loginPage.openSauceDemo();

                // 2. Login with valid credentials
                await loginPage.loginSauceDemo(user.username, user.password);

                // 3. Verify redirect to inventory page and products are visible
                await expect(page).toHaveURL(/.*inventory.html/);
                await expect(productsPage.productName.first()).toBeVisible();
            });
        }
    });

    // ─────────────────────────────────────────────
    // 2. Negative Test Cases (Data-Driven)
    // ─────────────────────────────────────────────

    test.describe("Negative Login Scenarios (Data-Driven)", () => {

        for (const scenario of data.negativeLoginTests) {
            test(`Negative Login: ${scenario.description}`, { tag: ['@QA', '@UAT', '@regression', '@negativeTest', '@validation'] }, async ({ loginPage }) => {

                // 1. Navigate to login page
                await loginPage.openSauceDemo();

                // 2. Attempt login with test credentials
                await loginPage.loginSauceDemo(scenario.username, scenario.password);

                // 3. Verify error message is displayed
                await expect(loginPage.errorMessage).toBeVisible();
                const errorText = await loginPage.getErrorMessage();
                expect(errorText).toContain(scenario.expectedError);
            });
        }
    });

    // ─────────────────────────────────────────────
    // 3. Security & UI Tests
    // ─────────────────────────────────────────────

    test.describe("Security & UI Validations", () => {

        test("Password Masking: Characters should be hidden in password field", { tag: ['@QA', '@UAT', '@regression', '@ui', '@sanity'] }, async ({ loginPage }) => {

            // 1. Navigate to login page
            await loginPage.openSauceDemo();

            // 2. Verify the password field has type="password" (characters are masked)
            await expect(loginPage.userPasswordInput).toHaveAttribute("type", "password");
        });

        test("Unauthorized Access: Direct navigation to inventory without login", { tag: ['@QA', '@UAT', '@regression', '@negativeTest', '@sanity'] }, async ({ loginPage, page }) => {

            // 1. Attempt to navigate directly to the inventory page
            await loginPage.openProductPage();

            // 2. Verify user is redirected back to login page
            await expect(page).toHaveURL(process.env.BASE_URL!);

            // 3. Verify the error message is displayed
            await expect(loginPage.errorMessage).toBeVisible();
            const errorText = await loginPage.getErrorMessage();
            expect(errorText).toContain("Epic sadface: You can only access '/inventory.html' when you are logged in.");
        });

        test("Logout Redirection: User cannot use Back button after logout", { tag: ['@QA', '@UAT', '@regression', '@navigation', '@sanity'] }, async ({ loginPage, sideBar, page }) => {

            // 1. Login successfully
            await loginPage.openSauceDemo();
            await loginPage.loginSauceDemo("standard_user", "secret_sauce");
            await expect(page).toHaveURL(/.*inventory.html/);

            // 2. Logout via sidebar
            await sideBar.clickLogoutButton();
            await expect(loginPage.loginButton).toBeVisible();

            // 3. Press browser Back button
            await page.goBack();

            // 4. Verify user cannot return to inventory — should see login or error
            await expect(loginPage.errorMessage).toBeVisible();
            const errorText = await loginPage.getErrorMessage();
            expect(errorText).toContain("Epic sadface: You can only access '/inventory.html' when you are logged in.");
        });
    });

    // ─────────────────────────────────────────────
    // 4. Visual Regression Tests
    // ─────────────────────────────────────────────

    test.describe("Visual Regression Tests", () => {

        test("Verify Login Page visual layout", { tag: ['@QA', '@UAT', '@visual', '@regression'] }, async ({ loginPage, page }) => {
            // 1. Navigate to login page
            await loginPage.openSauceDemo();

            // 2. Perform visual snapshot comparison
            // This will create a baseline image on the first run
            await expect(page).toHaveScreenshot('login-page.png', {
                fullPage: true,
                animations: 'disabled'
            });
        });

    });

});

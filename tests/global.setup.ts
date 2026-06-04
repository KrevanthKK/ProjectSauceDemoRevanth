import { expect, test } from '../fixture/pom-fixture';

test("Global setup for sauce demo application", async ({ page, loginPage, productsPage }) => {
    // Validate environment variables
    if (!process.env.USER_NAME || !process.env.PASSWORD) {
        throw new Error("Missing USER_NAME or PASSWORD environment variables. Please check your GitHub Secrets.");
    }

    await loginPage.openSauceDemo();
    await loginPage.loginSauceDemo(process.env.USER_NAME, process.env.PASSWORD);
    
    // Increased timeout for CI stability
    await page.waitForURL(process.env.BASE_URL! + "inventory.html", { timeout: 60000 });
    
    await expect(productsPage.productPageTitle).toHaveText("Products");
    
    await page.context().storageState({
        path: './playwright/.auth/auth.json'
    });
});
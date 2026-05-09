import {test, expect} from "../fixture/hooks-fixture"
import data from "../test-data/testdata.json"

test.describe("Cart Content Validation", () => {


    test("Verify all product details in the cart", { tag: ['@QA', '@UAT', '@smoke', '@regression', '@cart', '@ui', '@sanity'] }, async ({ cartPageFixture }) => {
        const item = data.productItemVerification
        // Use soft assertions so one failure doesn't stop the whole check
        await expect.soft(cartPageFixture.productName).toHaveText(item.product_name);
        await expect.soft(cartPageFixture.productDesc).toContainText(item.product_desc.substring(0, 20)); // Using substring to avoid issues with long text
        await expect.soft(cartPageFixture.productPrice).toHaveText(item.product_price);
        await expect.soft(cartPageFixture.shoppingBadge).toHaveText("1");
        
    });

    test("Verify 'Remove' functionality and badge update", { tag: ['@QA', '@UAT', '@smoke', '@regression', '@cart', '@ui'] }, async ({ cartPageFixture }) => {
        await cartPageFixture.clickCartRemoveButton();
        await expect.soft(cartPageFixture.productName).not.toBeVisible()
        await expect.soft(cartPageFixture.shoppingBadge).not.toBeVisible();
    });

    test("Verify: The application redirects you back to the main inventory page", { tag: ['@QA', '@UAT', '@regression', '@navigation', '@cart'] }, async ({ productsPage, cartPageFixture }) => {
        await cartPageFixture.clickContinueShoppingButton()
        await expect(productsPage.productName.first()).toBeVisible()
    });

    test('Verify: The application redirects you to the "Checkout: Your Information" step.', { tag: ['@QA', '@UAT', '@smoke', '@regression', '@navigation', '@checkout', '@cart'] }, async ({ cartPageFixture, checkOutFillInfo }) => {
        await cartPageFixture.clickCheckOutButton()
        expect(await checkOutFillInfo.isOnPersonInfoCartPage()).toBeTruthy()
    });

    test("Cart Persistence: Refresh the page and verify the item remains in the cart (testing session storage).", { tag: ['@QA', '@UAT', '@regression', '@cart', '@sessionStorage'] }, async ({ cartPageFixture,page }) => {
        await cartPageFixture.pageReload()
        await expect.soft(cartPageFixture.shoppingBadge).toHaveText("1");
    })
});

test("Verify the Cart Page is empty when user directly went to cart", { tag: ['@QA', '@UAT', '@regression', '@cart', '@ui', '@negativeTest'] }, async ({ productsPage, cartPage, gotoURL }) => {
        await productsPage.clickCartButton();
        await expect.soft(cartPage.productName).not.toBeVisible()
        await expect.soft(cartPage.shoppingBadge).not.toBeVisible();
    });

test("Cart Persistence & Removal: 2 items to 1 and session persistence", { tag: ['@QA', '@UAT', '@regression', '@cart', '@sessionStorage', '@e2e'] }, async ({ gotoURL, productsPage, cartPage, sideBar, loginPage, page }) => {
    
    // 1. Add two items to the cart
    await productsPage.addProductOnProductName("Sauce Labs Backpack");
    await productsPage.addProductOnProductName("Sauce Labs Bike Light");
    await expect(productsPage.shoppingCartBadge).toHaveText("2");

    // 2. Go to cart and remove one item
    await productsPage.clickCartButton();
    await cartPage.cartRemoveButton.first().click(); // Removes the first item
    
    // 3. Validation: Verify badge decreases to 1
    await expect(cartPage.shoppingBadge).toHaveText("1");

    // 4. Logout and log back in to test session persistence
    await sideBar.clickLogoutButton();
    await loginPage.loginSauceDemo(process.env.USER_NAME!, process.env.PASSWORD!);
    
    // 5. Expected Result: The count is still 1 and item remains removed
    await expect(productsPage.shoppingCartBadge).toHaveText("1");
    await productsPage.clickCartButton();
    await expect(cartPage.productName).toHaveCount(1);
});

test.describe("Footer Module Validations in checkout finish page", () => {


    test("Verify footer copyright text displays correctly", { tag: ['@QA', '@UAT', '@regression', '@footer', '@ui'] }, async ({ footerModule, cartPageFixture }) => {
        await footerModule.isFooternoteAvailable();
    });
    test("Verify social media icons in checkout finish page", { tag: ['@QA', '@UAT', '@regression'] }, async ({ footerModule, context, cartPageFixture }) => {

        // 1. Validate Twitter (X)
        const [twitterPage] = await Promise.all([
            context.waitForEvent('page'), // Listen for the new tab
            footerModule.clickTwitter(),  // Click the icon
        ]);
        await expect(twitterPage).toHaveURL("https://x.com/saucelabs");
        await twitterPage.close();

        // 2. Validate Facebook
        const [facebookPage] = await Promise.all([
            context.waitForEvent('page'),
            footerModule.clickFacebook(),
        ]);
        await expect(facebookPage).toHaveURL(/.*facebook.com\/saucelabs/);
        await facebookPage.close();

        // 3. Validate LinkedIn
        const [linkedinPage] = await Promise.all([
            context.waitForEvent('page'),
            footerModule.clickLinkedin(),
        ]);
        // LinkedIn often shows an 'Authwall' or login screen first
        await expect(linkedinPage).toHaveURL(/.*linkedin.com\/company\/sauce-labs/);
        await linkedinPage.close();
    })

})

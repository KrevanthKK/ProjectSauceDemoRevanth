import { test, expect } from "../fixture/hooks-fixture"
import ProductsPage from "../pages/ProductsPage";
import data from "../test-data/testdata.json"

test.describe("Product Information Validation", () => {

    test("Validate that the title of the selected product", { tag: ['@QA', '@UAT', '@smoke', '@regression', '@productDetail', '@ui', '@sanity'] }, async ({ productItemPageFixture }) => {
        expect(await productItemPageFixture.pageURL()).toBeTruthy
        expect(await productItemPageFixture.specificProductName(data.productItemVerification.product_name)).toEqual(data.productItemVerification.product_name)
    })

    test("Check that the text describing the product is present and not empty", { tag: ['@QA', '@UAT', '@regression', '@productDetail', '@ui'] }, async ({ productItemPageFixture }) => {
        expect(await productItemPageFixture.pageURL()).toBeTruthy()
        expect(await productItemPageFixture.specificProductdesc()).toEqual(data.productItemVerification.product_desc)
    })
    test("Ensure the price is displayed correctly", { tag: ['@QA', '@UAT', '@regression', '@productDetail', '@ui'] }, async ({ productItemPageFixture }) => {
        expect(await productItemPageFixture.pageURL()).toBeTruthy()
        expect(await productItemPageFixture.specificProductPrice()).toEqual(data.productItemVerification.product_price)
    })

    test("Validate that the image is visible", { tag: ['@QA', '@UAT', '@regression', '@productDetail', '@ui'] }, async ({ productItemPageFixture }) => {
        expect(await productItemPageFixture.isValidImage()).toBeTruthy()
    })

});

test("Complete 'Add to Cart' flow and navigation check", { tag: ['@QA', '@UAT', '@smoke', '@regression', '@productDetail', '@cart', '@navigation', '@sanity'] }, async ({ productsPage, productItemPageFixture, page }) => {

    await test.step("Verify the add to cart is available", async () => {
        await productItemPageFixture.isAddtocartAvailable()
    })

    // await test.step("clear or reset the application using reset button", async () => {
    //     await sideBar.clickResetButton()
    //     await sideBar.clickCrossButton()
    // })

    await test.step("Action add to cart", async () => {
        await productItemPageFixture.clickAddtoCartButton()
    })

    await test.step("Verify the remove is available", async () => {
        await page.waitForLoadState("networkidle")
        await productItemPageFixture.isRemoveButtonsAvailabe()
    })

    await test.step("verify the bage has count of 1", async () => {
        await expect(productItemPageFixture.shoppingCartBadge).toContainText("1")
    })

    await test.step("Verify the remove button is available", async () => {
        await productItemPageFixture.clickRemoveButton()
    })

    await test.step("Navigate back to the product Page", async () => {
        await page.waitForLoadState("networkidle")
        await productItemPageFixture.backToProductButton()
        await productsPage.verifyProductPageTitle()
    })

})

test.describe("Footer Module Validations in Product item page", () => {

    test.beforeEach(async ({ productsPage, gotoURL }) => {
        await productsPage.clickUsingProductName(data.productItemVerification.product_name)
    });

    test("Verify footer copyright text displays correctly", { tag: ['@QA', '@UAT', '@regression', '@footer', '@ui'] }, async ({ footerModule }) => {
        await footerModule.isFooternoteAvailable();
    });

    test("Verify social media icons open correct URLs in new tabs", { tag: ['@QA', '@UAT', '@regression', '@footer', '@social', '@navigation'] }, async ({ footerModule, context, page }) => {

        // 1. Validate Twitter (X)
        const [twitterPage] = await Promise.all([
            context.waitForEvent('page'), // Listen for the new tab
            footerModule.clickTwitter(),  // Click the icon
        ]);
        await expect(twitterPage).toHaveURL(/.*x.com\/saucelabs/);

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
    });
})
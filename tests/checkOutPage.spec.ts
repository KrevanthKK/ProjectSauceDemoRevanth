import { test, expect } from "../fixture/hooks-fixture"
import data from "../test-data/testdata.json"
import { FakerUtils } from "../utilis/faker"

test.describe("Checkout Overviw : Item Details Validation", () => {

    const item = data.productItemVerification

    test("Verify Product details in CheckOut Overview", { tag: ['@QA', '@UAT', '@smoke', '@regression', '@checkout', '@ui', '@sanity'] }, async ({ cartFinishPage }) => {
        cartFinishPage.verifyProductDetails(item.product_name, item.product_price)
        expect(await cartFinishPage.getProductdesc()).toEqual(item.product_desc)
    })
    test("Payment Information: Verify the dummy card info is present", { tag: ['@QA', '@UAT', '@regression', '@checkout', '@ui'] }, async ({ cartFinishPage }) => {
        expect(cartFinishPage.paymentInfoValue).toHaveText(/SauceCard #\d{5}/i)
    })

    test("Shipping Information: Verify the delivery method", { tag: ['@QA', '@UAT', '@regression', '@checkout', '@ui'] }, async ({ cartFinishPage }) => {
        expect(cartFinishPage.shippingInfoValue).toHaveText("Free Pony Express Delivery!")
    })



})

test.describe("The 'Math' Validation (Price Total)", () => {

    test.beforeEach("Select multiple Product and navigate to the cartOverview Page", async ({ gotoURL, productsPage, cartPage, checkOutFillInfo, }) => {

        await productsPage.addProductOnProductName("Sauce Labs Bolt T-Shirt")
        await productsPage.addProductOnProductName("Sauce Labs Fleece Jacket")
        await productsPage.addProductOnProductName("Sauce Labs Onesie")
        await productsPage.clickCartButton()
        await expect(cartPage.productName).toHaveCount(3)
        await cartPage.clickCheckOutButton()
        const product = FakerUtils.generateUserData()
        await checkOutFillInfo.fillCheckoutForm(product.firstName, product.lastName, product.zipcode)
    })

    test("Verify the tax in CheckOut Overview", { tag: ['@QA', '@UAT', '@regression', '@checkout', '@validation', '@e2e'] }, async ({ checkOutOverView, gotoURL }) => {
        const targetTax = 0.08
        const totalProdcutPrice = await checkOutOverView.getPriceFromProduct()
        const taxAmount = await checkOutOverView.getAmount(checkOutOverView.taxLabel)
        const roundOfTaxAmount = Number((totalProdcutPrice * targetTax).toFixed(2))
        console.log("roundOfTaxAmount: " + roundOfTaxAmount )
        test.step("verify the tax Amount", async () => {
            expect(roundOfTaxAmount).toBe(taxAmount)
        })
        test.step("Verify the total amount", async () => {
            expect(await checkOutOverView.getAmount(checkOutOverView.totalPrice)).toBe(totalProdcutPrice + taxAmount)
        })

    })

    
})
test.describe("Checkout Overview: Navigation", () => {

    test("Should navigate to 'Complete' page on Finish", { tag: ['@QA', '@UAT', '@smoke', '@regression', '@checkout', '@navigation', '@sanity'] }, async ({ cartFinishPage, page, checkOutFinishPage }) => {
        await cartFinishPage.clickFinish();
        await expect(page).toHaveURL(/.*checkout-complete.html/);
        expect(await checkOutFinishPage.verifyThankYouNote()).toEqual("Thank you for your order!");
    });

    test("Should navigate back to 'Products' page on Cancel", { tag: ['@QA', '@UAT', '@regression', '@checkout', '@navigation'] }, async ({ page, cartFinishPage, productsPage }) => {
        await cartFinishPage.clickCancel();
        await expect(page).toHaveURL(/.*inventory.html/);
        expect(productsPage.productPageTitle).toHaveText("Products")
    });
});

test("Verify social media icons in Cart Finish page", { tag: ['@QA', '@UAT', '@regression'] }, async ({ footerModule, context, cartFinishPage }) => {

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
    });
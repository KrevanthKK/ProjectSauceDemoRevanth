import { test, expect } from "../fixture/hooks-fixture"
import { FakerUtils } from "../utilis/faker"
import data from "../test-data/testdata.json"



test.describe("Verify CheckOut Inoformation fill page", async () => {


    test("Form Input Validation", { tag: ['@QA', '@UAT', '@smoke', '@regression', '@checkout', '@sanity', '@navigation'] }, async ({ checkOutFillInfoFixture, page }) => {
        const userData = FakerUtils.generateUserData();

        await checkOutFillInfoFixture.fillCheckoutForm(
            userData.firstName,
            userData.lastName,
            userData.zipcode
        );
        await expect(page).toHaveURL(/.*checkout-step-two.html/);
    });

    test("Verify the user gets errors message", { tag: ['@QA', '@UAT', '@regression', '@checkout', '@validation'] }, async ({ checkOutFillInfoFixture, checkOutOverView }) => {
        const userData = FakerUtils.generateUserData();

        await checkOutFillInfoFixture.fillCheckoutForm(
            userData.firstName,
            userData.lastName,
            userData.zipcode
        );
        expect(await checkOutOverView.isInOverviewPage()).toBeTruthy()

    });

    test("verify user navigate back to the cart page", { tag: ['@QA', '@UAT', '@regression', '@checkout', '@navigation'] }, async ({ checkOutFillInfoFixture, cartPage }) => {
        await checkOutFillInfoFixture.clickCancelButton()
        expect(cartPage.isOnCartPage()).toBeTruthy()
    })
})

test.describe("Checkout Sad Path Validations", () => {

    test("Should show error when all fields are empty", { tag: ['@QA', '@UAT', '@regression', '@checkout', '@validation', '@negativeTest'] }, async ({ checkOutFillInfoFixture }) => {
        await checkOutFillInfoFixture.clickContinueButton();
        const error = await checkOutFillInfoFixture.getErrorMessage();
        expect(error).toContain("Error: First Name is required");
        expect.soft(checkOutFillInfoFixture.verifyFirstNameError()).toBeTruthy()
        expect.soft(checkOutFillInfoFixture.verifyLastNameError()).toBeTruthy()
        expect.soft(checkOutFillInfoFixture.verifyZipCodeError()).toBeTruthy()
    });

    test("Should show error when Zip Code is missing", { tag: ['@QA', '@UAT', '@regression', '@checkout', '@validation', '@negativeTest'] }, async ({ checkOutFillInfoFixture }) => {
        const faker = FakerUtils.generateUserData();

        // Fill only Name and Last Name
        await checkOutFillInfoFixture.firtNameInputField.fill(faker.firstName);
        await checkOutFillInfoFixture.lastNameInputField.fill(faker.lastName);
        await checkOutFillInfoFixture.zipCodeField.fill(""); // Keep it empty

        await checkOutFillInfoFixture.clickContinueButton();
        const error = await checkOutFillInfoFixture.getErrorMessage();
        expect(error).toContain("Error: Postal Code is required");
        expect.soft(checkOutFillInfoFixture.verifyZipCodeError()).toBeTruthy()
    });

    test("Should show error when Last Name is missing", { tag: ['@QA', '@UAT', '@regression', '@checkout', '@validation', '@negativeTest'] }, async ({ checkOutFillInfoFixture }) => {
        const faker = FakerUtils.generateUserData();

        // Fill only Name and Last Name
        await checkOutFillInfoFixture.firtNameInputField.fill(faker.firstName);
        await checkOutFillInfoFixture.lastNameInputField.fill("");
        await checkOutFillInfoFixture.zipCodeField.fill(faker.zipcode);

        await checkOutFillInfoFixture.clickContinueButton();
        const error = await checkOutFillInfoFixture.getErrorMessage();
        expect(error).toContain("Error: Last Name is required");
        expect.soft(checkOutFillInfoFixture.verifyLastNameError()).toBeTruthy()
    });


    test("Should show error when First Name is missing", { tag: ['@QA', '@UAT', '@regression', '@checkout', '@validation', '@negativeTest'] }, async ({ checkOutFillInfoFixture }) => {
        const faker = FakerUtils.generateUserData();

        // Fill only Name and Last Name
        await checkOutFillInfoFixture.firtNameInputField.fill("");
        await checkOutFillInfoFixture.lastNameInputField.fill(faker.firstName);
        await checkOutFillInfoFixture.zipCodeField.fill(faker.zipcode);

        await checkOutFillInfoFixture.clickContinueButton();
        const error = await checkOutFillInfoFixture.getErrorMessage();
        expect(error).toContain("Error: First Name is required");
        expect.soft(checkOutFillInfoFixture.verifyFirstNameError()).toBeTruthy()
    });
});

test.describe("Footer Module Validations in fill Info item page", () => {


    test("Verify footer copyright text displays correctly", { tag: ['@QA', '@UAT', '@regression', '@footer', '@ui'] }, async ({ footerModule, checkOutFillInfoFixture }) => {
        await footerModule.isFooternoteAvailable();
    });
    test("Verify social media icons in Personal Info page", { tag: ['@QA', '@UAT', '@regression'] }, async ({ footerModule, context, checkOutFillInfoFixture }) => {

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

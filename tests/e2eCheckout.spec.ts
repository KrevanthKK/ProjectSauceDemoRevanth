import { test, expect } from "../fixture/hooks-fixture"
import { FakerUtils } from "../utils/faker"

test.describe("End to End Checkout Flow", () => {

    test("Standard User Checkout Flow (The 'Happy Path')", { tag: ['@QA', '@UAT', '@smoke', '@regression', '@e2e', '@sanity'] }, async ({ productsPage, cartPage, checkOutFillInfo, checkOutOverView, checkOutFinishPage, page, gotoURL }) => {
        
        await test.step("1. Add specific item to the cart", async () => {
            await productsPage.addProductOnProductName("Sauce Labs Backpack");
        });
        
        await test.step("2. Navigate to the Shopping Cart", async () => {
            await productsPage.clickCartButton();
            await expect(page).toHaveURL(/.*cart.html/);
        });
        
        await test.step("3. Proceed to Checkout Information step", async () => {
            await cartPage.clickCheckOutButton();
            await expect(page).toHaveURL(/.*checkout-step-one.html/);
        });
        
        const userData = FakerUtils.generateUserData();
        await test.step("4. Fill out the checkout information form", async () => {
            await checkOutFillInfo.fillCheckoutForm(
                userData.firstName,
                userData.lastName,
                userData.zipcode
            );
        });
        
        await test.step("5. Verify navigation to the Overview page", async () => {
            await expect(page).toHaveURL(/.*checkout-step-two.html/);
        });
        
        await test.step("6. Complete the order", async () => {
            await checkOutOverView.clickFinish();
        });
        
        await test.step("7. Verify order completion and success message", async () => {
            await expect(page).toHaveURL(/.*checkout-complete.html/);
            const thankYouNote = await checkOutFinishPage.verifyThankYouNote();
            expect(thankYouNote).toEqual("Thank you for your order!");
        });
    });

});

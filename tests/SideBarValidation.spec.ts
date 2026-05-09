import { describe } from "node:test"
import { test,expect } from "../fixture/hooks-fixture"

test.describe("Validating side bar form sauce demo application", () => {
    test.use({
        storageState:
        {
            cookies: [],
            origins: []
        }
    });

    test.beforeEach("Login into sauce demo application", async({page,loginPage,productsPage})=>{
        await loginPage.openSauceDemo()
        await loginPage.loginSauceDemo(process.env.USER_NAME!,process.env.PASSWORD!)
        
    })

    test("Verify the user can able to navigate all products page", { tag: ['@QA', '@UAT', '@regression', '@sidebar', '@navigation'] }, async ({ sideBar, productsPage }) => {
        await sideBar.clickAllItemsButton()
        expect(await productsPage.isOnProductPage(),"User should navigate to the product page").toBeTruthy()
    })

    test("Verify the user can able to navigate about Page", { tag: ['@QA', '@UAT', '@regression', '@sidebar', '@navigation'] }, async ({ sideBar, page }) => {
        await sideBar.clickAboutButton()
        expect(await page.locator('a').filter({ hasText: 'Book a Demo' }).first(),"User unable to reach About Page").toHaveText("Book a Demo")
    })
    

    test("Verify the user can able to logout", { tag: ['@QA', '@UAT', '@smoke', '@regression', '@sidebar', '@sanity', '@navigation'] }, async ({ sideBar, page, loginPage }) => {
        await sideBar.clickLogoutButton()
        await expect(loginPage.loginButton,"Logout functionality is not working").toBeVisible()
    })

    test("verify the all the reset button is worling correctly", { tag: ['@QA', '@UAT', '@regression', '@sidebar', '@sanity'] }, async ({ productsPage, sideBar, page }) => {
        await sideBar.clickResetButton()
        await sideBar.clickCrossButton()
        await expect(productsPage.productName.first(),"Reset Options is not working").toHaveText("Sauce Labs Backpack")
    })
})
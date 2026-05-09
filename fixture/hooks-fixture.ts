import { test as baseExtend } from "../fixture/pom-fixture"
import { FakerUtils } from "../utilis/faker"
import data from "../test-data/testdata.json"
import { CheckOutOverview } from "../pages/CheckOutOverview"
import CartPage from "../pages/CartPage"
import CheckOutInfoPage from "../pages/CheckOutFillInfo"
import ProductItemPage from "../pages/ProductItemPage"

type hooksFixture = {
    gotoURL: void
    cartFinishPage: CheckOutOverview
    cartPageFixture: CartPage
    checkOutFillInfoFixture: CheckOutInfoPage
    productItemPageFixture: ProductItemPage
}

export const test = baseExtend.extend<hooksFixture>({
    gotoURL: async ({ loginPage, sideBar }, use) => {
        await loginPage.openProductPage()
        // Reset app state to ensure isolation in parallel runs
        // await sideBar.clickResetButton()
        //await sideBar.clickCrossButton()
        await use()
    },
    cartFinishPage: async ({ gotoURL, productsPage, cartPage, checkOutFillInfo, checkOutOverView }, use) => {
        const item = data.productItemVerification
        await productsPage.addProductOnProductName(item.product_name)
        await productsPage.clickCartButton()
        await cartPage.clickCheckOutButton()
        const user = FakerUtils.generateUserData()
        await checkOutFillInfo.fillCheckoutForm(user.firstName, user.lastName, user.zipcode)
        await use(checkOutOverView)
    },
    cartPageFixture: async ({ gotoURL, productsPage, cartPage }, use) => {
        await productsPage.addProductOnProductName(data.productItemVerification.product_name)
        await productsPage.clickCartButton()
        await use(cartPage)
    },
    checkOutFillInfoFixture: async ({ gotoURL, productsPage, cartPage, checkOutFillInfo }, use) => {
        await productsPage.addProductOnProductName(data.productItemVerification.product_name)
        await productsPage.clickCartButton()
        await cartPage.clickCheckOutButton()
        await use(checkOutFillInfo)
    },
    productItemPageFixture: async ({ gotoURL, productsPage, productItemPage }, use) => {
        await productsPage.clickUsingProductName(data.productItemVerification.product_name)
        await use(productItemPage)
    }
})

export { expect } from '@playwright/test'

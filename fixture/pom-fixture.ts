import { test as baseExtend } from "@playwright/test"
import LoginPage from "../pages/LoginPage"
import ProductsPage from "../pages/ProductsPage"
import SideBar from "../pages/SideBar"
import ProductItemPage from "../pages/ProductItemPage"
import FooterModule from "../pages/FooterModule"
import CartPage from "../pages/CartPage"
import CheckOutInfoPage from "../pages/CheckOutFillInfo"
import { CheckOutOverview } from "../pages/CheckOutOverview"
import { CheckOutFinishPage } from "../pages/CheckOutFinishPage"

type sauceFixtureType = {
    loginPage: LoginPage
    productsPage: ProductsPage
    sideBar: SideBar
    productItemPage: ProductItemPage
    footerModule: FooterModule
    cartPage: CartPage
    checkOutFillInfo: CheckOutInfoPage
    checkOutOverView: CheckOutOverview
    checkOutFinishPage: CheckOutFinishPage
}

export const test = baseExtend.extend<sauceFixtureType>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page))
    },
    productsPage: async ({ page }, use) => {
        await use(new ProductsPage(page))
    },
    sideBar: async ({ page }, use) => {
        await use(new SideBar(page))
    },
    productItemPage: async ({ page }, use) => {
        await use(new ProductItemPage(page))
    },
    footerModule: async ({ page }, use) => {
        await use(new FooterModule(page))
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page))
    },
    checkOutFillInfo: async ({ page }, use) => {
        await use(new CheckOutInfoPage(page))
    },
    checkOutOverView: async ({ page }, use) => {
        await use(new CheckOutOverview(page))
    },
    checkOutFinishPage: async ({ page }, use) => {
        await use(new CheckOutFinishPage(page))
    }
})

export { expect } from "@playwright/test"
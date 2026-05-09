import {expect, test} from '../fixture/pom-fixture'


test("Global setup for sauce demo application",async({page, loginPage,productsPage})=>{
    loginPage.openSauceDemo()
    loginPage.loginSauceDemo(process.env.USER_NAME!,process.env.PASSWORD!)
    await page.waitForURL(process.env.BASE_URL!+"inventory.html")
    expect(await productsPage.productPageTitle).toHaveText("Products")
    await page.context().storageState({
      path: './playwright/.auth/auth.json'
    })

});
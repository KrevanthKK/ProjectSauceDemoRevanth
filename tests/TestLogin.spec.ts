import { test, expect } from '../fixture/hooks-fixture';
import ProductsPage from '../pages/ProductsPage';
import data from "../test-data/testdata.json"



test("Verify the Product count in Sauce demo product page", { tag: ['@QA', '@UAT', '@regression', '@sanity', '@ui'] }, async ({ productsPage, gotoURL }) => {
    expect(productsPage.productName, "The product page should have only 6 products").toHaveCount(6)
})

test("verify the user select the multiple product and check count in cart badge", { tag: ['@QA', '@UAT', '@smoke', '@regression', '@cart', '@ui'] }, async ({ productsPage, page, gotoURL }) => {
    for (const item of data.produce_Name) {
        await productsPage.addProductOnProductName(`${item.product}`)
    }
    expect(productsPage.shoppingCartBadge, "Only 2 products added into the cart").toHaveText("2")
})

test("verify the user select the 2 product and 1 remove product from cart", { tag: ['@QA', '@UAT', '@regression', '@cart', '@ui'] }, async ({ productsPage, page, gotoURL }) => {

    await productsPage.addProductOnProductName("Shirt")
    expect(productsPage.shoppingCartBadge, "Adding Product using partial text").toHaveText("2")
    await productsPage.removeProductFromCart("Sauce Labs Bolt T-Shirt")
    expect(productsPage.shoppingCartBadge, "Remove Sauce Labs Bolt T-Shirt from cart").toHaveText("1")
    await page.waitForTimeout(5000)
})

test('Verify Add to Cart: Click "Add to Cart" for a specific product and verify the button text changes to "Remove".', { tag: ['@QA', '@UAT', '@smoke', '@cart', '@ui'] }, async ({ productsPage, gotoURL }) => {
    await productsPage.addProductOnProductName(data.checkingRemoveButton)
    expect(productsPage.isRemoveButtonAvailable(data.checkingRemoveButton)).toBeTruthy()
})

test('Verify sorting Option z-a', { tag: ['@QA', '@UAT', '@regression', '@sorting', '@ui'] }, async ({ productsPage, gotoURL }) => {
    await test.step("1. Select Z-A sorting and verify active option", async () => {
        await productsPage.dropDown("za")
        await expect.soft(productsPage.activeOption).toHaveText("Name (Z to A)")
    })

    await test.step("2. Verify product names are sorted alphabetically descending", async () => {
        const productname = await productsPage.getAllProductInventoryNames()
        const sorting = [...productname].sort().reverse()
        expect(productname).toEqual(sorting)
    })
})

test('Verify sorting Option a-z', { tag: ['@QA', '@UAT', '@regression', '@sorting', '@ui'] }, async ({ productsPage, gotoURL }) => {
    await test.step("1. Select A-Z sorting and verify active option", async () => {
        await productsPage.dropDown("az")
        await expect.soft(productsPage.activeOption).toHaveText("Name (A to Z)")
    })

    await test.step("2. Verify product names are sorted alphabetically ascending", async () => {
        const productname = await productsPage.getAllProductInventoryNames()
        const sorting = [...productname].sort()
        expect(productname).toEqual(sorting)
    })
})
test('Verify sorting Option low to High', { tag: ['@QA', '@UAT', '@regression', '@sorting', '@ui'] }, async ({ productsPage, gotoURL }) => {
    await test.step("1. Select Price (low to high) and verify active option", async () => {
        await productsPage.dropDown("lohi")
        await expect.soft(productsPage.activeOption).toHaveText("Price (low to high)")
    })

    await test.step("2. Verify product prices are sorted ascending", async () => {
        const productPrice = await productsPage.getAllProductPrices()
        const sortPrice = [...productPrice].sort((a, b) => a - b)
        expect(productPrice).toEqual(sortPrice)
    })
})

test('Verify sorting Option High to low', { tag: ['@QA', '@UAT', '@regression', '@sorting', '@ui'] }, async ({ productsPage, gotoURL }) => {
    await test.step("1. Select Price (high to low) and verify active option", async () => {
        await productsPage.dropDown("hilo")
        await expect.soft(productsPage.activeOption).toHaveText("Price (high to low)")
    })

    await test.step("2. Verify product prices are sorted descending", async () => {
        const productPrice = await productsPage.getAllProductPrices()
        const sortPrice = [...productPrice].sort((a, b) => a - b).reverse()
        expect(productPrice).toEqual(sortPrice)
    })
})

test.describe("Verify all Product Details", () => {
    for (const item of data.ProductDetailsCheck) {
        test(`Verify Product Details: ${item.product_name}`, { tag: ['@QA', '@UAT', '@regression', '@ui', '@validation'] }, async ({ productsPage, gotoURL }) => {
            const [name, desc, price] = await productsPage.getProductDetail(item.product_name)
            expect.soft(name, "Product Name not match").toEqual(item.product_name)
            expect.soft(desc, "product description is not match").toEqual(item.product_desc)
            expect.soft(price, "product price is not match").toEqual(item.product_price)
        })
    }
})

test('Verify the "Swag Labs" logo and the "Products" page title are visible', { tag: ['@QA', '@UAT', '@smoke', '@sanity', '@ui'] }, async ({ productsPage, gotoURL }) => {

    await productsPage.verifyLogoIsPresent()
    await productsPage.verifyProductPageTitle()
})

test('Product Detail Navigation', { tag: ['@QA', '@UAT', '@smoke', '@navigation', '@productDetail'] }, async ({ productsPage, gotoURL, productItemPage }) => {

    await productsPage.clickUsingProductName("Test.allTheThings() T-Shirt (Red)")
    expect(productItemPage.pageURL()).toBeTruthy()
})

test("Verify that every product has a valid image displayed", { tag: ['@QA', '@UAT', '@regression', '@ui'] }, async ({ productsPage, gotoURL }) => {
    expect(productsPage.isValidImage("Test.allTheThings() T-Shirt (Red)")).toBeTruthy()

})

test.describe("Validate the each product have valid image", async () => {
    for (const item of data.ProductDetailsCheck) {
        test(`Validate the image in product ${item.product_name}`, { tag: ['@QA', '@UAT', '@regression', '@ui'] }, async ({ productsPage, gotoURL }) => {
            expect(productsPage.isValidImage(item.product_name)).toBeTruthy()
        })
    }
})


test.describe("Footer Module Validations in Products page", () => {

    test("Verify footer copyright text displays correctly", { tag: ['@QA', '@UAT', '@regression', '@footer', '@ui'] }, async ({ footerModule, gotoURL }) => {
        await footerModule.isFooternoteAvailable();
    });

    test("Verify social media icons in Products page", { tag: ['@QA', '@UAT', '@regression', '@footer', '@social', '@navigation'] }, async ({ footerModule, context, gotoURL }) => {

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
})
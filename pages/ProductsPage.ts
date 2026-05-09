import { Page, Locator, expect } from "@playwright/test"
import ProductLogo from "./ProductLogo"

interface IProductActions {
    addProductOnProductName(productname: string): Promise<void>;
    removeProductFromCart(productname: string): Promise<void>;
    dropDown(option: "hilo" | "lohi" | "az" | "za"): Promise<void>;
    clickUsingProductName(productname: string): Promise<void>;
}

// 2. Data Retrieval Interface: Getting names, prices, counts
interface IProductData {
    numberOfProducts(): Promise<number>;
    getAllProductInventoryNames(): Promise<string[]>;
    getAllProductPrices(): Promise<number[]>;
    getProductDetail(productname: string): Promise<[string, string, number]>;
}

// 3. Validation Interface: Page titles, Visibility, Image checks
interface IProductValidations {
    verifyProductPageTitle(): Promise<void>;
    isRemoveButtonAvailable(productname: string): Promise<void>;
    isOnProductPage(): Promise<boolean>;
    isValidImage(productname: string): Promise<boolean>;
}
export default class ProductsPage extends ProductLogo implements IProductActions, IProductData, IProductValidations {


    readonly productPageTitle: Locator
    readonly productSortContainer: Locator
    readonly productName: Locator
    readonly productDescription: Locator
    readonly productPrice: Locator
    readonly addToCartButton: Locator

    readonly shoppingCartBadge: Locator
    readonly productInventory: Locator
    readonly removeButton: Locator
    readonly sortingProduct: Locator
    readonly activeOption: Locator
    readonly productImage: Locator



    constructor(page: Page) {
        super(page)
        this.productPageTitle = page.locator('[data-test="title"]')
        this.productSortContainer = page.getByRole('combobox')
        this.productInventory = page.locator(".inventory_item")
        this.productName = page.locator("div.inventory_item_name")
        this.productDescription = page.locator("div.inventory_item_desc")
        this.productPrice = page.locator("div.inventory_item_price")
        this.addToCartButton = page.getByRole('button', { name: 'Add to cart' })
        this.shoppingCartBadge = page.locator('span.shopping_cart_badge')
        this.removeButton = page.getByRole('button', { name: 'Remove' })
        this.sortingProduct = page.getByRole('combobox')
        this.activeOption = page.locator(".active_option")
        this.productImage = page.locator("img.inventory_item_img")



    }
    async verifyProductPageTitle() {
        await expect(this.productPageTitle, "Produt page title should be present").toHaveText("Products")
    }

    async numberOfProducts() {
        const countofProduct = await this.productInventory.allInnerTexts()
        return countofProduct.length
    }


    async addProductOnProductName(productname: string) {
        let item = this.productInventory.filter({ hasText: `${productname}` })
        let count = await item.count()
        if (count === 0) {
            throw new Error("Product is not present : " + productname)
        } else
            for (let i = 0; i < count; i++) {
                await item.nth(i).getByRole('button').click()

            }

    }


    async removeProductFromCart(productname: string) {
        const item = this.productInventory.filter({ hasText: `${productname}` })
        if (await item.count() === 0) {
            throw new Error("Product is not available : " + productname)
        } else
            await item.getByRole('button').click()

    }

    async isRemoveButtonAvailable(productname: string) {
        const item = this.productInventory.filter({ hasText: `${productname}` })
        if (await item.count() === 0) {
            throw new Error("Product is not available : " + productname)
        } else
            await expect(item.getByRole('button')).toHaveText("Remove")
    }

    async isOnProductPage(): Promise<boolean> {
        return this.page.url().includes('/inventory.html')

    }

    async dropDown(option: "hilo" | "lohi" | "az" | "za"): Promise<void> {
        await this.sortingProduct.selectOption(option)
    }

    async getAllProductInventoryNames(): Promise<string[]> {
        return await this.productName.allInnerTexts()
    }

    async getAllProductPrices(): Promise<number[]> {
        const price = await this.productPrice.allInnerTexts()
        return price.map((p) => parseFloat(p.replace("$", "")))
    }

    async getProductDetail(productname: string): Promise<[string, string, number]> {
        const [name, desc, price] = await Promise.all([
            this.getSpecificProductName(productname),
            this.getSpecificProductDesc(productname),
            this.getSpecificProductPrice(productname)
        ])
        return [name, desc, price]
    }

    async getSpecificProductName(productname: string) {
        const item = this.productInventory.getByText(productname, { exact: true });
        await expect(item, "Product is not available in page").toBeVisible();
        const productName = await item.innerText()
        return productName
    }

    async getSpecificProductPrice(productname: string) {
        let item = this.productInventory.filter({ hasText: `${productname}` })
        const productPrice = await item.locator("div.inventory_item_price").innerText()
        const productPriceInt = parseFloat(productPrice.replace("$", ""))
        return productPriceInt
    }

    async getSpecificProductDesc(productname: string) {
        let item = this.productInventory.filter({ hasText: `${productname}` })
        const productdesc = await item.locator("div.inventory_item_desc").innerText()
        return productdesc
    }

    async clickUsingProductName(productname: string) {
        let item = this.productInventory.filter({ hasText: `${productname}` })
        const clickProduct = await item.locator("div.inventory_item_name").click()
    }

    async isValidImage(productname: string) {
        let item = this.productInventory.filter({ hasText: productname })
        const clickProduct = await item.locator("img.inventory_item_img").getAttribute("src")
        return (
            clickProduct !== null &&           // 1. Must not be null
            clickProduct.length > 0 &&         // 2. Must not be empty (Added && here)
            clickProduct.includes('.jpg')      // 3. Must contain extension
        )
    }

    // /**
    //  * select product using product Name
    //  * @param productname 
    //  */
    // async addProductOnProductNameUsingLoop(productname: string) {
    //     for (let i = 0; i < await this.numberOfProducts(); i++) {
    //         if (await this.productName.nth(i).innerText() == productname) {
    //             await this.addToCartButton.nth(i).click()
    //             break
    //         } 
    //     }

    // }

    // /**
    //  * remove product from cart in product page
    //  * @param productname 
    //  */
    // async removeProductOnProductNameUsingLoop(productname: string) {
    //     for (let i = 0; i < await this.numberOfProducts(); i++) {

    //         if (await this.productName.nth(i).innerText() == productname) {
    //             await this.removeButton.nth(i).click()
    //             break
    //         }
    //     }
    // }



}
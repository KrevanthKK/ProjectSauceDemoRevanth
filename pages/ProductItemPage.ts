import { Page, expect, Locator } from "@playwright/test"
import ProductLogo from "../pages/ProductLogo"

interface IProductItemActions {
    backToProductButton(): Promise<void>;
    clickAddtoCartButton(): Promise<void>;
    clickRemoveButton(): Promise<void>;
}

// 2. Data Retrieval: Getting info about the specific item
interface IProductItemData {
    specificProductName(productname: string): Promise<string>;
    specificProductPrice(): Promise<string>;
    specificProductdesc(): Promise<string>;
}

// 3. Validations: UI state and URL checks
interface IProductItemValidations {
    isAddtocartAvailable(): Promise<void>;
    isRemoveButtonsAvailabe(): Promise<void>;
    isInItemPage(): Promise<void>;
    itemPageURL(): Promise<boolean>;
    isValidImage(): Promise<boolean>;
}

export default class ProductItemPage extends ProductLogo implements IProductItemActions, IProductItemData, IProductItemValidations {

    readonly specificProductPageTitle: Locator
    readonly productInventory: Locator
    readonly productInventoryName: Locator
    readonly productInventoryDesc: Locator
    readonly productInventoryPrice: Locator
    readonly addtoCart: Locator
    readonly removeButton: Locator
    readonly productInventoryImage: Locator
    readonly shoppingCartBadge: Locator



    constructor(page: Page) {
        super(page)
        this.specificProductPageTitle = page.locator('[data-test="back-to-products"]')
        this.productInventory = page.locator("div.inventory_details_desc_container")
        this.productInventoryName = page.locator('[data-test="inventory-item-name"]')
        this.productInventoryDesc = page.locator('[data-test="inventory-item-desc"]')
        this.productInventoryPrice = page.locator('[data-test="inventory-item-price"]')
        this.addtoCart = page.getByRole('button', { name: /Add to cart/i })
        this.removeButton = page.getByRole('button', { name: /Remove/i })
        this.productInventoryImage = page.locator('img.inventory_details_img')
        this.shoppingCartBadge = page.locator('span.shopping_cart_badge')


    }

    async backToProductButton() {
        await (this.specificProductPageTitle.click())
    }

    async isAddtocartAvailable() {
        await expect(this.addtoCart).toHaveText("Add to cart")
    }

    async clickAddtoCartButton() {
        await this.addtoCart.click()
    }

    async clickRemoveButton() {
        await this.removeButton.click()
    }

    async isRemoveButtonsAvailabe() {
        return expect(this.removeButton).toContainText("Remove")
    }

    async isInItemPage() {
        expect(this.specificProductPageTitle).toHaveText("Back to products")
    }

    async itemPageURL(): Promise<boolean> {
        return this.page.url().includes("inventory-item.html?id")
    }

    async specificProductName(productname: string) {
        const item = this.productInventory.getByText(productname, { exact: true });
        await expect(item, "Product is not available in page").toBeVisible();
        const productName = await this.productInventoryName.innerText()
        return productName
    }

    async specificProductPrice() {
        const productPrice = await this.productInventoryPrice.innerText()
        return productPrice
    }

    async specificProductdesc() {
        const productdesc = await this.productInventoryDesc.innerText()
        return productdesc
    }
    /**
     * 
     * @returns is this valid image
     */

    async isValidImage() {

        const clickProduct = await this.productInventoryImage.getAttribute("src")
        return (
            clickProduct !== null &&           // 1. Must not be null
            clickProduct.length > 0 &&         // 2. Must not be empty (Added && here)
            clickProduct.includes('.jpg')      // 3. Must contain extension
        )
    }

}
import { Page, expect, Locator } from "@playwright/test"
import ProductLogo from "./ProductLogo"

// 1. Actions: Moving forward or backward
interface IOverviewActions {
    clickFinish(): Promise<void>;
    clickCancel(): Promise<void>;
}

// 2. Data Retrieval: Getting text and calculated numbers
interface IOverviewData {
    getProductdesc(): Promise<string>;
    getshippingInfo(): Promise<string>;
    getAmount(elementlocator: Locator): Promise<number>;
    getPriceFromProduct(): Promise<number>;
}

// 3. Validations: Verifying URL and complex product states
interface IOverviewValidations {
    isInOverviewPage(): Promise<boolean>;
    verifyProductDetails(expectedName: string, expectedPrice: string): Promise<void>;
}

export class CheckOutOverview extends ProductLogo implements IOverviewActions,IOverviewData,IOverviewValidations{

    readonly checkOutOverviewPageTitle: Locator
    readonly quantityCheck: Locator
    readonly overViewDescription: Locator
    readonly productTitle: Locator
    readonly productDescription: Locator
    readonly productPrice: Locator
    readonly paymentInfoLabel: Locator
    readonly paymentInfoValue: Locator
    readonly shippingInfoLabel: Locator
    readonly shippingInfoValue: Locator
    readonly totalInfoLabel: Locator
    readonly subTotalPriceLabel: Locator
    readonly taxLabel: Locator
    readonly totalPrice: Locator
    readonly finishButton: Locator
    readonly cancelButton: Locator
    readonly quantity: Locator


    constructor(page: Page) {
        super(page)
        this.checkOutOverviewPageTitle = page.locator('span.title')
        this.quantityCheck = page.locator(".cart_quantity_label")
        this.overViewDescription = page.locator('[data-test="cart-desc-label"]')
        this.quantity = page.locator('[data-test="item-quantity"]')
        this.productTitle = page.locator('[data-test="inventory-item-name"]')
        this.productDescription = page.locator('[data-test="inventory-item-desc"]')
        this.productPrice = page.locator('div.inventory_item_price')
        this.paymentInfoLabel = page.locator('[data-test="payment-info-label"]')
        this.paymentInfoValue = page.locator('[data-test="payment-info-value"]')
        this.shippingInfoLabel = page.locator('[data-test="shipping-info-label"]')
        this.shippingInfoValue = page.locator('[data-test="shipping-info-value"]')
        this.totalInfoLabel = page.locator('[data-test="total-info-label"]')
        this.subTotalPriceLabel = page.locator('[data-test="total-info-label"]')
        this.taxLabel = page.locator('div.summary_tax_label')
        this.totalPrice = page.locator('div.summary_total_label')
        this.cancelButton = page.getByText('Cancel', { exact: true })
        this.finishButton = page.getByRole('button', { name: 'Finish' })


    }
    async clickFinish() {
        await this.finishButton.click();
    }

    async clickCancel() {
        await this.cancelButton.click();
    }
    async verifyProductDetails(expectedName: string, expectedPrice: string) {
        await expect(this.productTitle).toHaveText(expectedName);
        await expect(this.quantity).toHaveText('1');
        await expect(this.productPrice).toContainText(expectedPrice)
    }

    async isInOverviewPage() {
        return this.page.url().includes("/checkout-step-two.html")
    }

    async getProductdesc() {
        return await this.productDescription.innerText()
    }

    async getshippingInfo() {
        return await this.shippingInfoValue.innerText()
    }
    async getAmount(elementlocator:Locator): Promise<number> {
        const Amount = await elementlocator.innerText()
        const amt = parseFloat(Amount.replace(/[^0-9.]/g, ""))
        return amt
    }


    async getPriceFromProduct() {
        const countOfProduct = await this.productPrice.count()
        let totalAmont = 0
        if (countOfProduct > 1) {
            for (let i = 0; i < countOfProduct; i++) {
                const innerText = await this.productPrice.nth(i).innerText()
                const amt = parseFloat(innerText.replace("$", ""))
                totalAmont = totalAmont + amt
            }
        } else {
            const innerText = await this.productPrice.innerText()
             totalAmont = parseFloat(innerText.replace("$", ""))
        }

        return totalAmont

    }
}
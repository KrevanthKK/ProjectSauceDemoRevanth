import { Locator, Page } from "playwright/test";
import ProductLogo from "./ProductLogo";

interface ICartPage {
    clickCheckOutButton(): Promise<void>;
    clickContinueShoppingButton(): Promise<void>;
    isOnCartPage(): Promise<boolean>;
}

export default class CartPage extends ProductLogo implements ICartPage{

    readonly pageTitle: Locator
    readonly cartQuantityLevel: Locator
    readonly cartDesc: Locator
    readonly productName: Locator
    readonly productDesc: Locator
    readonly productPrice: Locator
    readonly cartRemoveButton: Locator
    readonly continueShoppingButton: Locator
    readonly checkOutButton: Locator
    readonly shoppingBadge: Locator
    readonly cartItem : Locator
    

    constructor(page:Page){
        super(page)
        this.pageTitle = page.locator('span.title')
        this.cartQuantityLevel = page.locator("div.cart_quantity_label")
        this.cartDesc = page.locator("div.cart_desc_label")
        this.productName = page.locator("div.inventory_item_name")
        this.productDesc = page.locator("div.inventory_item_desc")
        this.productPrice = page.locator("div.inventory_item_price")
        this.cartRemoveButton = page.getByRole('button', { name: /Remove/i })
        this.continueShoppingButton = page.locator("#continue-shopping")
        this.checkOutButton = page.locator('#checkout')
        this.shoppingBadge = page.locator("span.shopping_cart_badge")
        this.cartItem = page.locator("div.cart_quantity").last()

    }

    /**
     * Click CheckOut button
     * 
     */
    async clickCheckOutButton():Promise<void>{
        await this.checkOutButton.click()
    }
    /**
     * Click Continue shopping button
     */
    async clickContinueShoppingButton():Promise<void>{
        await this.continueShoppingButton.click()
    }
    async isOnCartPage(): Promise<boolean>{
        return this.page.url().includes('/cart.html')
    }
    /**
     * Click Remove Button
     */
    async clickCartRemoveButton(): Promise<void> {
        await this.cartRemoveButton.click()
    }
    
}
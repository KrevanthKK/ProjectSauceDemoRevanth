import {Page, Locator, expect} from "@playwright/test"

interface IGlobalActions {
    clickSideBar(): Promise<void>;
    clickCartButton(): Promise<void>;
    pageReload(): Promise<void>;
}

// 2. Global Status: Information and verification about the current state
interface IGlobalStatus {
    pagetitle(): Promise<string>;
    pageURL(): Promise<string>;
    verifyLogoIsPresent(): Promise<void>;
}

export default class ProductLogo implements IGlobalActions,IGlobalStatus{

    readonly productLogo: Locator
    readonly page: Page
    readonly sideBarMenu: Locator
    readonly cartButton : Locator
    
    

    constructor(page:Page){
        this.page=page,
        this.productLogo =  page.getByText('Swag Labs', { exact: true })
        this.sideBarMenu =  page.getByRole('button', { name: 'Open Menu' })
        this.cartButton = page.locator("a.shopping_cart_link")
        
    }

    async pagetitle(){
        return await this.page.title()
    }
    async pageURL(){
        return this.page.url()
    }
    async clickSideBar(){
        await this.sideBarMenu.click()
    }
    async verifyLogoIsPresent(){
        await expect(this.productLogo,"The Swag logo should be present in page").toHaveText("Swag Labs")
    }
    async clickCartButton(){
        await this.cartButton.click()
    }
    async pageReload(){
        await this.page.reload()
    }
   
}

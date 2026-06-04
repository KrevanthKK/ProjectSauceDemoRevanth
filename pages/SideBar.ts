import {Locator, Page} from "@playwright/test"
import ProductLogo from "./ProductLogo"

interface ISideBarActions {
    clickAllItemsButton(): Promise<void>;
    clickAboutButton(): Promise<void>;
    clickLogoutButton(): Promise<void>;
    clickResetButton(): Promise<void>;
    clickCrossButton(): Promise<void>;
}


interface ISideBarValidations {
    isMenuVisible(): Promise<boolean>;
}
export default class SideBar extends ProductLogo implements ISideBarActions, ISideBarValidations{

    
    readonly allItemSideBar:Locator
    readonly aboutSideBar: Locator
    readonly logoutSideBar: Locator
    readonly resetSideBar: Locator
    readonly closeMenu: Locator

    constructor(page:Page){
        super(page)
        this.allItemSideBar = page.getByText('All Items')
        this.aboutSideBar =  page.getByText('About')
        this.logoutSideBar = page.getByText('Logout')
        this.resetSideBar = page.getByText('Reset App State')
        this.closeMenu = page.getByRole('button', { name: 'Close Menu' })

    }
    async clickAllItemsButton(){
        await this.clickSideBar()
        await this.allItemSideBar.click()
    }
    
    async clickAboutButton(){
        await this.clickSideBar()
        await this.aboutSideBar.click()
    }
    /**
     * Click Logout Button
     */
    async clickLogoutButton(){
        await this.clickSideBar()
        await this.logoutSideBar.click()
    }
    async clickResetButton(){
        await this.clickSideBar()
        await this.resetSideBar.click()
    }
    async clickCrossButton(){
        await this.closeMenu.click()
    }

    async isMenuVisible(): Promise<boolean> {
        return await this.allItemSideBar.isVisible();
    }
}
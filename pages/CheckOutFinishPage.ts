import {Page, Locator} from "@playwright/test"
import ProductLogo from "./ProductLogo"

interface ICheckOutFinishPage{

    clickBackButton():Promise<void>
    verifyPonyExpressLogo() : Promise<boolean>
}

/**
 * Cheicking page title and dispatch message
 */

interface ICheckOutFinishPageValidation{
    verifyPageTitle():Promise<string>
    getDispatchMessage():Promise<string>
}


export class CheckOutFinishPage extends ProductLogo implements ICheckOutFinishPage,ICheckOutFinishPageValidation{

    
    readonly checkOutFinishText : Locator
    readonly ponyExpressImage : Locator
    readonly thankYouNote : Locator
    readonly dispatchMessage: Locator
    readonly backHomeButton : Locator

    constructor(page:Page){
        super(page)
        this.checkOutFinishText = page.locator('[data-test="title"]')
        this.ponyExpressImage =  page.locator('[data-test="pony-express"]')
        this.thankYouNote = page.locator('[data-test="complete-header"]')
        this.dispatchMessage = page.locator('div.complete-text')
        this.backHomeButton = page.getByRole('button', { name: 'Back Home' })

    }
    async verifyThankYouNote(){
        return await this.thankYouNote.innerText()
    }

    async clickBackButton() {
         await this.backHomeButton.click()
    }
    async verifyPageTitle(){
        return await this.checkOutFinishText.innerText()
    }
    async getDispatchMessage(){
        return await this.dispatchMessage.innerText()
    }
    async verifyPonyExpressLogo(){
        return await this.ponyExpressImage.isVisible()
    }

}
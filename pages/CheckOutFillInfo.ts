import {Page, Locator} from "@playwright/test"
import ProductLogo from "./ProductLogo"

interface ICheckout {
    isOnPersonInfoCartPage(): Promise<boolean>;
    fillCheckoutForm(firstName: string, lastName: string, zip: string): Promise<void>;
    getErrorMessage(): Promise<string>;
    clickContinueButton(): Promise<void>;
}

interface ICheckoutValidations {
    isOnPersonInfoCartPage(): Promise<boolean>;
    getErrorMessage(): Promise<string>;
    verifyFirstNameError(): Promise<boolean>;
    verifyLastNameError(): Promise<boolean>;
    verifyZipCodeError(): Promise<boolean>;
}

export default class CheckOutPages extends ProductLogo implements ICheckout,ICheckoutValidations{

    
    readonly checkOutPageTitle: Locator
    readonly firtNameInputField : Locator
    readonly lastNameInputField : Locator
    readonly zipCodeField : Locator
    readonly cancelButton : Locator
    readonly continueButton : Locator
    readonly cartButton : Locator
    readonly errorMessage : Locator
    readonly firstNamefilederror: Locator
    readonly lastNameFieldError : Locator
    readonly zipCodeerror : Locator

    constructor(page:Page){
        super(page)
        this.checkOutPageTitle = page.locator('span.title')
        this.firtNameInputField = page.getByRole('textbox', { name: 'First Name' })
        this.lastNameInputField =  page.getByRole('textbox', { name: 'Last Name' })
        this.zipCodeField = page.getByRole('textbox', { name: 'Zip/Postal Code' })
        this.cancelButton = page.getByRole('button', { name: 'Cancel' })
        this.continueButton = page.locator('[data-test="continue"]')
        this.cartButton = page.locator('a.shopping_cart_link')
        this.errorMessage = page.locator('[data-test="error"]')
        this.firstNamefilederror = page.getByRole('textbox', { name: 'First Name' }).getByRole('img')
        this.lastNameFieldError = page.getByRole('textbox', { name: 'Last Name' }).getByRole('img')
        this.zipCodeerror = page.getByRole('textbox', { name: 'Zip/Postal Code' }).getByRole('img')
    }
 
    async isOnPersonInfoCartPage():Promise<boolean>{
         return (await this.pageURL()).includes("/checkout-step-one.html")  
    }
    async clickContinueButton(){
        await this.continueButton.click()
    }
    async clickCancelButton(){
        await this.cancelButton.click()
    }
    async fillCheckoutForm(firstName: string, lastName: string, zip: string) {
        
        await this.firtNameInputField.fill(firstName);
        await this.lastNameInputField.fill(lastName);
        await this.zipCodeField.fill(zip);
        await this.clickContinueButton();
    }
    async getErrorMessage(){
        return this.errorMessage.innerText()
    }

    
    async verifyFirstNameError(){
        return await this.firstNamefilederror.isVisible()
    }
    async verifyLastNameError(){
        return await this.lastNameFieldError.isVisible()
    }
    async verifyZipCodeError(){
        return await this.zipCodeerror.isVisible()
    }




}
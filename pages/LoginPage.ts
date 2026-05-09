import {Page, Locator} from "@playwright/test"
import process from "node:process";


interface ILoginNavigation {
    openSauceDemo(): Promise<void>;
    openProductPage(): Promise<void>;
}

// 2. Auth Actions Interface: Interaction with login fields
interface ILoginActions {
    loginSauceDemo(userName: string, password: string): Promise<void>;
}

export default class LoginPage implements ILoginActions,ILoginNavigation{

    readonly page:Page;
    readonly userNameInput:Locator;
    readonly userPasswordInput: Locator;
    readonly loginButton: Locator
    readonly errorMessage: Locator
    

    constructor(page:Page){
        this.page = page
        this.userNameInput = page.locator('[data-test="username"]')
        this.userPasswordInput = page.locator('[data-test="password"]')
        this.loginButton = page.locator('[data-test="login-button"]')
        this.errorMessage = page.locator('[data-test="error"]')
    }

    /**Open Sauce demo URL
     * 
     */
    async openSauceDemo(){
        await this.page.goto(process.env.BASE_URL!)
    }

    /**
     * Open Product page URL
     */
    async openProductPage(){
        await this.page.goto(process.env.BASE_URL! + "inventory.html")
    }

    
    /**login into Sauce Demo Application
     * 
     * @param userName 
     * @param password 
     */
    async loginSauceDemo(userName:string, password:string){
        await this.userNameInput.fill(userName)
        await this.userPasswordInput.fill(password)
        await this.loginButton.click()

    }

    /**Get login error message text
     * 
     * @returns error message string
     */
    async getErrorMessage(): Promise<string> {
        return await this.errorMessage.innerText()
    }
}

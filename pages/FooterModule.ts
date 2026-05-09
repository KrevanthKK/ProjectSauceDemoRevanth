import { expect, Locator, Page } from "playwright/test";
import ProductLogo from "./ProductLogo";

interface IFooterActions {
    clickTwitter(): Promise<void>;
    clickFacebook(): Promise<void>;
    clickLinkedin(): Promise<void>;
}

// 2. Validations Interface: Content and visibility checks
interface IFooterValidations {
    isFooternoteAvailable(): Promise<void>;
}

export default class FooterModule extends ProductLogo implements IFooterActions,IFooterValidations{

    
    readonly footerNote: Locator;
    readonly twitterLogo: Locator;
    readonly facebookLogo: Locator;
    readonly linkdinLogo: Locator;

    constructor(page: Page) {
        super(page);
        this.footerNote = page.locator(".footer_copy");
        this.twitterLogo = page.locator("li.social_twitter a");
        this.facebookLogo = page.locator("li.social_facebook a");
        this.linkdinLogo = page.locator("li.social_linkedin a");
    }

    async isFooternoteAvailable() {
        // Using a Regex for the year so it doesn't fail when the year changes
        //         Breakdown of the Regex Pattern: /© \d{4} Sauce Labs. All Rights Reserved./
        // Here is exactly what each character in that pattern represents:

        // / ... /: These forward slashes tell TypeScript that the code inside is a Regular Expression, not just a normal string.

        // ©: Matches the literal copyright symbol.

        // \d: This is a shorthand for any digit (0-9).

        // {4}: This is a "quantifier." It means "exactly four of the previous thing." So, \d{4} matches any 4-digit year (like 2024, 2025, or 2026).

        // Sauce Labs. All Rights Reserved.: This matches those specific words and spaces exactly.

        // .: In Regex, a period normally means "any character," but since it's followed by text here, Playwright treats it as a literal period.
        await expect(this.footerNote,"Footer should be availabe in application").toHaveText(/© \d{4} Sauce Labs. All Rights Reserved./);
    }

    // These methods now just perform the click; 
    // the tab validation is handled in the test for better stability.
    async clickTwitter() {
        await this.twitterLogo.click();
    }

    async clickFacebook() {
        await this.facebookLogo.click();
    }

    async clickLinkedin() {
        await this.linkdinLogo.click();
    }
}
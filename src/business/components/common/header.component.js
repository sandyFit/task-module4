import { BaseComponent } from "../common/base.component.js";
import { logger } from "../../../core/logger/logger.js";

export class HeaderComponent extends BaseComponent {

    constructor() {
        super('[data-test="site-header"]');
    }


    get homeLink() {
        return this.rootEl.$('[data-test="nav-home"]');
    }
    
    // Select
    get accountLink() {
        return this.rootEl.$('[data-test="nav-menu"]');
    }
    // Dropdown Account Select 
    get accountSelect() {
        return this.rootEl.$('[data-test="nav-my-account"]');
    }

    get favoritesSelect() {
        return this.rootEl.$('[data-test="nav-profile"]');
    }

    get profileSelect() {
        return this.rootEl.$('[data-test="nav-my-profile"]');
    }
    
    // Language Select
    get LanguageSelect() {
        return this.rootEl.$('[data-test="language-select"]');
    }

    get spanishLanguage() {
        return this.rootEl.$('[data-test="lang-es"]');
    }

    // Cart
    get cartLink() {
        return this.rootEl.$('data-test="nav-cart"]');
    }




    async waitForLoaded() {
        logger.info("Waiting for Header to be visible");
        await this.root.waitForDisplayed({ timeout: 10000 });
    }


    async openCart() {
        logger.info("Opening cart");
        await this.cartButton.click();
    }

    async openAccount() {
        logger.info("Opening account section");
        await this.accountButton.click();
    }
}

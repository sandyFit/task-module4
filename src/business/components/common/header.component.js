import { BaseComponent } from "../common/base.component.js";
import { logger } from "../../../core/logger/logger.js";



export class HeaderComponent extends BaseComponent {

    get root() {
        return $('header[data-test="site-header"]');
    }

    get logo() {
        return this.root.$('a[data-test="logo"]');
    }

    get searchInput() {
        return this.root.$('input[data-test="search-input"]');
    }

    get searchButton() {
        return this.root.$('button[data-test="search-button"]');
    }

    get cartButton() {
        return this.root.$('a[data-test="cart-link"]');
    }

    get accountButton() {
        return this.root.$('a[data-test="account-link"]');
    }

    async waitForLoaded() {
        logger.info("Waiting for Header to be visible");
        await this.root.waitForDisplayed({ timeout: 10000 });
    }

    async clickLogo() {
        logger.info("Clicking site logo");
        await this.logo.waitForClickable();
        await this.logo.click();
    }

    async searchFor(query) {
        logger.info(`Searching for: ${query}`);
        await this.searchInput.waitForDisplayed();
        await this.searchInput.setValue(query);
        await this.searchButton.waitForClickable();
        await this.searchButton.click();
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

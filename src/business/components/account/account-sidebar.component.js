import { BaseComponent } from "../common/base.component.js";
import { logger } from "../../../core/logger/logger.js";

export class AccountSidebar extends BaseComponent {
    constructor() {
        super('aside[data-test="account-sidebar"]'); 
    }

    get profileLink() {
        return this.rootEl.$('a[data-test="account-profile"]');
    }

    get favoritesLink() {
        return this.rootEl.$('a[data-test="account-favorites"]');
    }

    async waitForLoaded() {
        logger.info("Waiting for Account Sidebar to be loaded");
        await this.rootEl.waitForDisplayed({ timeout: 10000 });
    }

    async openProfile() {
        logger.info("Opening Profile section");
        await this.profileLink.waitForClickable();
        await this.profileLink.click();
    }

    async openFavorites() {
        logger.info("Opening Favorites section");
        await this.favoritesLink.waitForClickable();
        await this.favoritesLink.click();
    }
}

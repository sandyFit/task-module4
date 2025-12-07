import { BasePage } from '../basePage.js';
import { logger } from '../../../core/logger/logger.js';
import { HeaderComponent } from '../../components/common/header.component.js';
import { AccountSidebar } from '../../components/account/account-sidebar.component.js';

export class AccountPage extends BasePage {
    constructor() {
        super();
        this.header = new HeaderComponent();
        this.accountSidebar = new AccountSidebar();
    }

    /**
     * Open Account main page
     */
    async open() {
        logger.info('Opening Account page');
        await this.navigateTo('/account');
        await this.waitForPageLoad();
    }

   

    /**
     * Get current page URL
     */
    async getCurrentUrl() {
        return await super.getCurrentUrl();
    }

    /**
     * Check if user is on Account page
     */
    async isOnAccountPage() {
        const url = await this.getCurrentUrl();
        return url.includes('/account');
    }

    /**
     * Check if user is on Profile section
     */
    async isOnProfileSection() {
        const url = await this.getCurrentUrl();
        return url.includes('/account/profile');
    }

    /**
     * Check if user is on Favorites section
     */
    async isOnFavoritesSection() {
        const url = await this.getCurrentUrl();
        return url.includes('/favorites') || url.includes('/favourites');
    }
}

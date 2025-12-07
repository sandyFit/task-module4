import { AccountPage } from '../account/account.page.js';
import { logger } from '../../../core/logger/logger.js';

export class FavoritesPage extends AccountPage {

    selectors = {
        favoriteProductCard: '[data-test^="favorite-"]',
        removeFavoriteButton: '[data-test="delete"]'
    };

    get favoriteProductCards() { return $$(this.selectors.favoriteProductCard); }
    get removeFavoriteButtons() { return $$(this.selectors.removeFavoriteButton); }

    async waitForLoaded() {
        await browser.waitUntil(
            async () => (await this.favoriteProductCards).length > 0,
            {
                timeout: 10000,
                interval: 250,
                timeoutMsg: 'Favorites page did not load any favorite items'
            }
        );
    }

    
    async open() {
        logger.info('Opening Favorites page');

        // Direct route navigation
        await this.navigateTo('/account/favorites');

        // Angular route finished loading
        await this.waitForPageLoad();

        // Now wait only for actual favorite items
        await this.waitForLoaded();
    }



    /**
     * Check if on Favorites page
     */
    async isOnFavoritesPage() {
        return await super.isOnFavoritesSection();
    }

    /**
     * Get list of favorite products
     */
    async getFavoriteProducts() {
        logger.info('Getting list of favorite products');
        const products = await this.favoriteProductCards;
        logger.info(`Found ${products.length} favorite products`);
        return products;
    }

    /**
     * Check if favorites list is empty
     */
    async isFavoritesEmpty() {
        try {
            const isEmpty = await this.emptyFavoritesMessage.isDisplayed();
            logger.info(`Favorites list is empty: ${isEmpty}`);
            return isEmpty;
        } catch {
            return false;
        }
    }

    /**
     * Get count of favorite products
     */
    async getFavoriteProductsCount() {
        const products = await this.getFavoriteProducts();
        return products.length;
    }

    /**
     * Remove product from favorites by index
     * @param {number} index - Index of the product to remove
     */
    async removeFavoriteByIndex(index) {
        logger.info(`Removing favorite product at index: ${index}`);
        const removeButtons = await this.removeFavoriteButtons;

        if (removeButtons.length > index) {
            await this.clickElement(removeButtons[index], `Remove Favorite button ${index}`);
            await browser.pause(1000); // Wait for removal animation
        } else {
            throw new Error(`No favorite product found at index ${index}`);
        }
    }
}

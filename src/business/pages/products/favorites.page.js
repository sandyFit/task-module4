import { AccountPage } from '../account/account.page.js';
import { logger } from '../../../core/logger/logger.js';
import { waitForElementsCount } from '../../../core/browser/wait-helper.js';  // Add this import

export class FavoritesPage extends AccountPage {

    selectors = {
        favoriteProductCard: '[data-test^="favorite-"]',
        removeFavoriteButton: '[data-test="delete"]'
    };

    // === GETTERS ===
    get favoriteProductCards() { return $$(this.selectors.favoriteProductCard); }
    get removeFavoriteButtons() { return $$(this.selectors.removeFavoriteButton); }

    async getFavoriteProducts() {
        logger.info('Getting list of favorite products');
        const products = await this.favoriteProductCards;
        logger.info(`Found ${products.length} favorite products`);
        return products;
    }

    // === ACTIONS ===

    async waitForLoaded() {
        await waitForElementsCount(() => this.favoriteProductCards, 1, 10000);
    }

    async open() {
        logger.info('Opening Favorites page');

        await this.navigateTo('/account/favorites');

        // Angular route finished loading
        await this.waitForPageLoad();
        await this.waitForLoaded();
    }

    async isOnFavoritesPage() {
        return await super.isOnFavoritesSection();
    }


    async isFavoritesEmpty() {
        try {
            const isEmpty = await this.emptyFavoritesMessage.isDisplayed();
            logger.info(`Favorites list is empty: ${isEmpty}`);
            return isEmpty;
        } catch {
            return false;
        }
    }


    async getFavoriteProductsCount() {
        const products = await this.getFavoriteProducts();
        return products.length;
    }


    async removeFavoriteByIndex(index) {
        logger.info(`Removing favorite product at index: ${index}`);
        const removeButtons = await this.removeFavoriteButtons;

        if (removeButtons.length > index) {
            await this.clickElement(removeButtons[index], `Remove Favorite button ${index}`);
            await this.pause(1000, 'waiting for removal animation to complete');
        } else {
            throw new Error(`No favorite product found at index ${index}`);
        }
    }
}

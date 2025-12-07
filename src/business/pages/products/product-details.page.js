import { BasePage } from '../basePage.js';
import { logger } from '../../../core/logger/logger.js';
import { waitForElementsCount } from '../../../core/browser/wait-helper.js';

export class ProductDetailsPage extends BasePage {

    selectors = {
        title: '[data-test="product-name"]',
        price: '[data-test="unit-price"]',
        description: '[data-test="product-description"]',
        category: 'span[aria-label="category"]',
        impact: '[data-test="co2-rating-badge"]',
        addToFavoritesButton: '[data-test="add-to-favorites"]',
        productCards: '[data-test^="product-"]'
    };

    get titleEl() { return $(this.selectors.title); }
    get priceEl() { return $(this.selectors.price); }
    get descriptionEl() { return $(this.selectors.description); }
    get categoryEl() { return $(this.selectors.category); }
    get impactEl() { return $(this.selectors.impact); }
    get addToFavoritesButton() { return $(this.selectors.addToFavoritesButton); }
    get productCards() { return $$(this.selectors.productCards); }

    async waitForLoaded() {
        logger.info('Waiting for Product Details page to load');
        await this.titleEl.waitForDisplayed({ timeout: 10000 });
        logger.info('Product Details page loaded successfully');
    }

    async getProductInfo() {
        return {
            title: await this.getElementText(this.titleEl, 'Product Name'),
            price: await this.getElementText(this.priceEl, 'Product Price'),
            description: await this.getElementText(this.descriptionEl, 'Product Description'),
            category: await this.getElementText(this.categoryEl, 'Product Category'),
            impact: await this.getElementText(this.impactEl, 'Environmental Impact')
        };
    }

    /**
     * Open product details page by clicking on first product from home page
     * This ensures proper page load and navigation
     */
    async open() {
        logger.info('Opening Product Details page');

        // Navigate to home page
        await this.navigateTo('/');
        await this.waitForPageLoad();

        // Wait for products to load using the helper method
        await waitForElementsCount(() => this.productCards, 1, 10000);

        // Click first product
        const products = await this.productCards;
        const firstProduct = products[0];
        await firstProduct.scrollIntoView();
        await firstProduct.waitForClickable({ timeout: 5000 });
        await firstProduct.click();

        // Wait for navigation to product details page
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/product/'),
            { timeout: 8000, timeoutMsg: 'Did not navigate to product details page' }
        );

        // Wait for page to be fully loaded
        await this.waitForLoaded();
    }

    /**
     * Open a specific product details page by ID
     * @param {string} productId - Product ID to navigate to
     */
    async openById(productId) {
        logger.info(`Opening Product Details page for product ID: ${productId}`);
        await this.navigateTo(`/product/${productId}`);
        await this.waitForPageLoad();
        await this.waitForLoaded();
    }

    /**
     * Add current product to favorites
     */
    async addToFavorites() {
        logger.info('Adding product to favorites');
        await this.clickElement(this.addToFavoritesButton, 'Add to Favorites button');
        // Wait for API call to complete (toast is in Shadow DOM and not testable)
        await browser.pause(1500);
    }

    /**
     * Check if user is on Product Details page
     */
    async isOnProductDetailsPage() {
        const url = await this.getCurrentUrl();
        return url.includes('/product/');
    }
}

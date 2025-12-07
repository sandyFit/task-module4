import { BasePage } from '../basePage.js';
import { logger } from '../../../core/logger/logger.js';

export class ProductDetailsPage extends BasePage {

    selectors = {
        title: '[data-test="product-name"]',
        price: '[data-test="unit-price"]',
        description: '[data-test="product-description"]',
        category: 'span[aria-label="category"]',
        impact: '[data-test="co2-rating-badge"]',
        addToFavoritesButton: '[data-test="add-to-favorites"]',
        productCards: '[data-test^="product-"]',
        addToCartButton: '[data-test="add-to-cart"]'
    };

    // === ELEMENT GETTERS ===
    get titleEl() { return $(this.selectors.title); }
    get priceEl() { return $(this.selectors.price); }
    get descriptionEl() { return $(this.selectors.description); }
    get categoryEl() { return $(this.selectors.category); }
    get impactEl() { return $(this.selectors.impact); }
    get addToFavoritesButtonEl() { return $(this.selectors.addToFavoritesButton); }
    get productCards() { return $$(this.selectors.productCards); }
    get addToCartButtonEl() { return $(this.selectors.addToCartButton); }

    // === LOADING ===
    async waitForLoaded() {
        logger.info('Waiting for Product Details page to load');
        await this.titleEl.waitForDisplayed({ timeout: 10000 });
        logger.info('Product Details page loaded successfully');
    }

    // === PRODUCT INFO ===
    async getProductInfo() {
        return {
            title: await this.getElementText(this.titleEl, 'Product Name'),
            price: await this.getElementText(this.priceEl, 'Product Price'),
            description: await this.getElementText(this.descriptionEl, 'Product Description'),
            category: await this.getElementText(this.categoryEl, 'Product Category'),
            impact: await this.getElementText(this.impactEl, 'Environmental Impact')
        };
    }

    // === NAVIGATION ===
    async open() {
        logger.info("Opening Product Details page from Home");

        await this.navigateTo('/');

        await browser.waitUntil(
            async () => (await this.productCards).length > 0,
            {
                timeout: 10000,
                interval: 300,
                timeoutMsg: 'No products were found on the Home page'
            }
        );

        logger.info("Home page loaded — products found");

        const firstProduct = (await this.productCards)[0];
        await firstProduct.scrollIntoView();
        await firstProduct.$('[data-test="product-name"]').click();

        await this.waitForLoaded();
    }

    async openById(productId) {
        logger.info(`Opening Product Details page for product ID: ${productId}`);
        await this.navigateTo(`/product/${productId}`);
        await this.waitForPageLoad();
        await this.waitForLoaded();
    }

    // === ACTIONS ===
    async addToCart() {
        logger.info('Adding product to cart');
        await this.clickElement(this.addToCartButtonEl, 'Add to Cart button');
        await browser.pause(1500); // allow toast + cart badge update
    }

    async addToFavorites() {
        logger.info('Adding product to favorites');
        await this.clickElement(this.addToFavoritesButtonEl, 'Add to Favorites button');
        await browser.pause(1500);
    }

    async isOnProductDetailsPage() {
        const url = await this.getCurrentUrl();
        return url.includes('/product/');
    }
}

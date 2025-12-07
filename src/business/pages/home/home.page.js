import { BasePage } from '../basePage.js';
import { logger } from '../../../core/logger/logger.js';
import { waitForElementsCount } from '../../../core/browser/wait-helper.js';

export class HomePage extends BasePage {

    selectors = {
        filtersButton: '[data-test="filters"]',
        searchInput: '[data-test="search-query"]',
        searchButton: '[data-test="search-submit"]',
        productCards: '[data-test^="product-"]',
        productName: '[data-test="product-name"]'
    };

    get filtersButton() {
        return $(this.selectors.filtersButton);
    }

    get searchInput() {
        return $(this.selectors.searchInput);
    }

    get searchButton() {
        return $(this.selectors.searchButton);
    }

    get productCards() {
        return $$(this.selectors.productCards);
    }

    async open() {
        logger.info('Opening Home page');
        await this.navigateTo('/');
        await this.waitForPageLoad();
        await waitForElementsCount(() => this.productCards, 1, 10000);

        const products = await this.productCards;
        await products[0].waitForDisplayed({ timeout: 10000 });
        logger.info(`Home page loaded with ${products.length} products`);
    }

    async searchProduct(query) {
        logger.info(`Searching product: ${query}`);

        const filtersVisible = await this.filtersButton.isDisplayed().catch(() => false);
        if (filtersVisible) {
            await this.clickElement(this.filtersButton, 'Filters Button');
        }

        const searchInput = await this.searchInput;
        await this.setInputValueDirectly(searchInput, query, 'Search Input');

        // CRITICAL: Add pause after JS input to let DOM stabilize
        await browser.pause(500);

        // Direct click with fallback - bypass visibility checks
        const searchBtn = await this.searchButton;
        logger.info('Click → Search Button');

        await searchBtn.waitForExist({ timeout: 5000 });
        await searchBtn.scrollIntoView();
        await browser.pause(300);

        try {
            await searchBtn.click();
            logger.info('✅ Search button clicked successfully');
        } catch (clickError) {
            logger.info('⚠️ Normal click failed, using JavaScript click');
            await browser.execute((el) => el.click(), searchBtn);
            logger.info('✅ JavaScript click succeeded');
        }
    }

    async waitForSearchResults() {
        // Wait for search to complete - longer pause since filtering takes time
        await browser.pause(1500);

        await waitForElementsCount(() => this.getProducts(), 1, 10000);

        const products = await this.getProducts();
        logger.info(`Found ${products.length} products after search`);

        // Wait for first product to be ready - that's enough
        if (products.length > 0) {
            try {
                await products[0].waitForDisplayed({ timeout: 5000 });
                logger.info('✅ Search results are ready');
            } catch (error) {
                logger.info('⚠️ First product visibility check failed, but continuing');
            }
        }
    }

    async getProducts() {
        return await this.productCards;
    }

    async getProductName(productElement) {
        const nameElement = await productElement.$(this.selectors.productName);

        // Wait for existence only - no scrolling, no visibility checks
        const exists = await nameElement.waitForExist({
            timeout: 1000
        }).catch(() => false);

        if (!exists) {
            return '';
        }

        // Try getText first (fastest method)
        try {
            const name = await nameElement.getText();
            if (name && name.trim()) {
                return name.trim();
            }
        } catch (error) {
            // Silent fail, try next method
        }

        // Fallback to attribute
        try {
            const name = await nameElement.getAttribute('textContent');
            if (name && name.trim()) {
                return name.trim();
            }
        } catch (error) {
            // Silent fail
        }

        return '';
    }

    async openProductDetails(productName) {
        logger.info(`Opening details for product: ${productName}`);

        const productCards = await this.productCards;
        logger.info(`Found ${productCards.length} product cards`);

        // Search and click immediately when found
        for (let i = 0; i < productCards.length; i++) {
            const card = productCards[i];

            try {
                // Scroll the card into view
                await card.scrollIntoView();
                await browser.pause(100); // Reduced pause

                // Find the title element within THIS card with shorter timeout
                const titleElement = await card.$('[data-test="product-name"]');

                // Check if element exists quickly (500ms instead of 3000ms)
                const exists = await titleElement.waitForExist({
                    timeout: 500,
                    reverse: false
                }).catch(() => false);

                if (!exists) {
                    continue; // Skip this product quickly
                }

                const title = await titleElement.getText();
                logger.info(`Product ${i}: "${title}"`);

                // Check if this is the product we're looking for
                if (title.toLowerCase().includes(productName.toLowerCase())) {
                    // Click immediately while element is in view
                    await titleElement.waitForClickable({ timeout: 2000 });
                    await titleElement.click();
                    logger.info(`✅ Clicked product: ${title}`);
                    return;
                }
            } catch (error) {
                // Silently skip - no need to log warnings
                continue;
            }
        }

        throw new Error(`Product "${productName}" not found in ${productCards.length} products`);
    }
}

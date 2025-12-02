import { logger } from "../../../core/logger/logger.js";

export class ProductCard {

    constructor(rootElement) {
        this.root = rootElement;  // a single product card element
    }

    get title() {
        return this.root.$('[data-test="product-title"]');
    }

    get price() {
        return this.root.$('[data-test="product-price"]');
    }

    get addToCartButton() {
        return this.root.$('[data-test="add-to-cart"]');
    }

    get detailsLink() {
        return this.root.$('[data-test="product-details"]');
    }

    async getTitleText() {
        return await this.title.getText();
    }

    async getPriceText() {
        return await this.price.getText();
    }

    async openDetails() {
        logger.info("Opening product details");
        await this.detailsLink.waitForClickable();
        await this.detailsLink.click();
    }

    async addToCart() {
        logger.info("Adding product to cart");
        await this.addToCartButton.waitForClickable();
        await this.addToCartButton.click();
    }
}

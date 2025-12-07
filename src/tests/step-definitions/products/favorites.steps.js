import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from 'chai';
import { ProductDetailsPage } from '../../../business/pages/products/product-details.page.js';
import { FavoritesPage } from '../../../business/pages/products/favorites.page.js';
import { logger } from '../../../core/logger/logger.js';
import { waitForUrlToContain } from '../../../core/browser/wait-helper.js';

const productDetailsPage = new ProductDetailsPage();
const favoritesPage = new FavoritesPage();

Given('the user is logged in', async function () {
    logger.info('User already logged in via Before hook');
    expect(this.currentUser).to.exist;
});

Given('is in the Product Details page', async () => {
    logger.info('Navigating to Product Details page');
    await productDetailsPage.open();
});

When('the user clicks the Add to Favourites button', async () => {
    logger.info('Adding product to favorites');
    await productDetailsPage.addToFavorites();

    // Wait for any feedback message (success or already exists)
    await browser.pause(1000);

    // Check if product was already in favorites
    const bodyText = await $('body').getText();
    const alreadyInFavorites = bodyText.toLowerCase().includes('already') ||
        bodyText.toLowerCase().includes('existe');

    if (alreadyInFavorites) {
        logger.info('ℹ️ Product is already in favorites list');
    } else {
        logger.info('✅ Product added to favorites');
    }
});

Then('the product should be added to the user\'s favorites list', async () => {
    await favoritesPage.open();

    const items = await favoritesPage.favoriteProductCards;
    expect(items.length).to.be.greaterThan(0);
});




Then('the product should appear in the favorites page', async () => {
    logger.info('Verifying product appears in favorites page');

    // Verify we're on the favorites page
    const isOnFavoritesPage = await favoritesPage.isOnFavoritesPage();
    expect(isOnFavoritesPage).to.be.true;

    const favoriteProducts = await favoritesPage.getFavoriteProducts();
    expect(favoriteProducts.length).to.be.greaterThan(0);

    logger.info(`✅ Verified: Product appears in favorites page with ${favoriteProducts.length} total favorites`);
});

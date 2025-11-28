import { Given, When, Then } from '@wdio/cucumber-framework';
import { navigateToProductDetails } from '../helpers/navigation.js';
import { testCredentials } from '../data/test-credentials.js';
import {
    assertFavoriteSuccessMessage,
    expectFavoritesListNotEmpty,
    shouldBeOnFavoritesPage
} from '../assertions/favorites.assertions.js';

Given(/^the user is logged in$/, async () => {
    console.log('User already logged in via Before hook');
    testCredentials.logCredentials();
});

Given(/^is in the Product Details page$/, async () => {
    await navigateToProductDetails();
    await browser.pause(1000); // wait for page to fully load
});

When(/^the user clicks the Add to Favourites button$/, async () => {
    const favButton = await $('[data-test="add-to-favorites"]');
    await favButton.waitForDisplayed({ timeout: 10000 });
    await favButton.waitForClickable({ timeout: 10000 });
    await favButton.click();
    await browser.pause(1500); 
});

Then(/^the product should be added to the user's favorites list$/, async () => {
    await assertFavoriteSuccessMessage();
});

Then(/^the product should appear in the favorites page$/, async () => {
    // Open navigation menu
    const menu = await $('[data-test="nav-menu"]');
    await menu.scrollIntoView();
    await menu.waitForDisplayed({ timeout: 5000 });
    await menu.waitForClickable({ timeout: 5000 });
    await menu.click();
    await browser.pause(500); // wait for animation

    // Click on Favorites link
    const favLink = await $('[data-test="nav-my-favorites"]');
    await favLink.scrollIntoView();
    await favLink.waitForDisplayed({ timeout: 5000 });
    await favLink.waitForClickable({ timeout: 5000 });
    await favLink.click();

    // Wait until the URL updates to favorites page
    await browser.waitUntil(
        async () => {
            const url = await browser.getUrl();
            console.log('Current URL:', url); // debug
            return url.includes('/favorites') || url.includes('/favourites');
        },
        { timeout: 10000, timeoutMsg: 'Did not navigate to favorites page' }
    );

    await shouldBeOnFavoritesPage();
    await expectFavoritesListNotEmpty();
});

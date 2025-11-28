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

    // Wait for page to fully load
    await browser.pause(1000);

    const url = await browser.getUrl();
});

When(/^the user clicks the Add to Favourites button$/, async () => {
    const favButton = await $('[data-test="add-to-favorites"]');

    // Wait for button to be available
    await favButton.waitForDisplayed({ timeout: 10000 });
    await favButton.waitForClickable({ timeout: 10000 });

    await favButton.getText();

    await favButton.click();

    // Wait for the action to process
    await browser.pause(1500);
});

Then(/^the product should be added to the user's favorites list$/, async () => {
    await assertFavoriteSuccessMessage();
});


Then(/^the product should appear in the favorites page$/, async () => {
    await shouldBeOnFavoritesPage();
    await expectFavoritesListNotEmpty();
});

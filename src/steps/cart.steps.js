import { Given, When } from '@wdio/cucumber-framework';
import { navigateToProductDetails } from '../helpers/navigation.js';

Given(/^the user is on a Product Details page$/, async () => {
    await navigateToProductDetails();
});

When(/^the user clicks Add to cart button$/, async () => {
    await $('[data-test="add-to-cart"]').click();
});

import { Given, When } from '@wdio/cucumber-framework';
import { navigateToHome, navigateToProductDetails } from '../helpers/navigation.js';

Given(/^the user is on the Home page$/, async () => {
    await navigateToHome();
});

When(/^the user clicks on a specific product name or image$/, async () => {
    await navigateToProductDetails();
});

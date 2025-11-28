import { Given, When, Then } from '@wdio/cucumber-framework';
import {
    assertProductDetailsPageUrl,
    shouldProductUrlContainProduct,
    assertProductHasName,
    assertProductHasPrice,
    assertProductHasDescription,
    productShouldHaveDescription,
    assertProductHasCategory,
    assertProductHasCO2Rating
} from '../assertions/product-details.assertions.js';
import { navigateToHome, navigateToProductDetails } from '../helpers/navigation.js';

Given(/^the user is on the Home page$/, async () => {
    await navigateToHome();
});

When(/^the user clicks on a specific product name or image$/, async () => {
    await navigateToProductDetails();
});

Then(/^the system should open the Product Details page$/, async () => {
    await assertProductDetailsPageUrl();
});

Then(/^displays all the product.?s information.*$/, async () => {
    await assertProductHasName();
    await shouldProductUrlContainProduct();
    await assertProductHasPrice();
    await assertProductHasDescription();
    await productShouldHaveDescription();
    await assertProductHasCategory();
    await assertProductHasCO2Rating();
});

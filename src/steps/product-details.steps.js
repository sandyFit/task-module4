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
import { navigateToHome } from '../helpers/navigation.js';

Given(/^the user is on the Home page$/, async () => {
    await navigateToHome();
});

When(/^the user clicks on a specific product name or image$/, async () => {
    // Check what products are available
    const cards = await homePage.getProductCardComponents();

    for (const card of cards) {
        const title = await card.getTitleText();
        console.log(`Available product: "${title}"`);
    }

    await homePage.openProductDetails("claw hammer");
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

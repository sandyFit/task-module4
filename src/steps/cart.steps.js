import { Given, When, Then } from '@wdio/cucumber-framework';
import { navigateToProductDetails } from '../helpers/navigation.js';
import {
    assertCartQuantityIsOne,
    expectCartQuantityOne,
    expectSuccessMessageDisplayed,
    shouldSuccessMessageContainText,
    shouldCartQuantityBeOne
} from '../assertions/cart.assertions.js';

Given(/^the user is on a Product Details page$/, async () => {
    await navigateToProductDetails();
});

When(/^the user clicks Add to cart button$/, async () => {
    const btn = await $('[data-test="add-to-cart"]');
    await btn.waitForDisplayed();
    await btn.waitForClickable();

    // Real mouse click fix
    await browser.performActions([{
        type: 'pointer',
        id: 'mouse',
        parameters: { pointerType: 'mouse' },
        actions: [
            { type: 'pointerMove', origin: btn, x: 0, y: 0 },
            { type: 'pointerDown', button: 0 },
            { type: 'pointerUp', button: 0 }
        ]
    }]);

    await browser.pause(600);
});

Then(/^the product should be added to the cart list$/, async () => {
    await assertCartQuantityIsOne();
    await expectCartQuantityOne();
    await shouldCartQuantityBeOne();
});

Then(/^a successful message should appear$/, async () => {
    await expectSuccessMessageDisplayed();     
    await shouldSuccessMessageContainText();   
});

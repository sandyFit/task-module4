import { Then } from '@wdio/cucumber-framework';

Then(/^the product should be added to the cart list$/, async () => {
    const qty = await $('[data-test="cart-quantity"]');
    await qty.waitForDisplayed();
    expect(await qty.getText()).toBe('1');
});

Then(/^a successful message should appear$/, async () => {
    const msg = await $('//*[contains(text(),"shopping cart")]');
    await msg.waitForDisplayed();
    expect(await msg.isDisplayed()).toBe(true);
});

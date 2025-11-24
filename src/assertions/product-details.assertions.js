import { Then } from '@wdio/cucumber-framework';

Then(/^the system should open the Product Details page$/, async () => {
    const url = await browser.getUrl();
    expect(url).toContain('/product/');
});


Then(/^displays all the product.?s information.*$/, async () => {
    const name = await $('[data-test="product-name"]');
    await name.waitForDisplayed();
    expect((await name.getText()).length).toBeGreaterThan(0);

    const price = await $('[data-test="unit-price"]');
    expect(await price.isDisplayed()).toBe(true);

    const description = await $('[data-test="product-description"]');
    expect(await description.isDisplayed()).toBe(true);
    expect((await description.getText()).length).toBeGreaterThan(0);

    const category = await $('span[aria-label="category"]');
    expect(await category.isDisplayed()).toBe(true);

    const co2 = await $('[data-test="co2-rating-badge"]');
    expect(await co2.isDisplayed()).toBe(true);
});

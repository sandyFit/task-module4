import { Then } from '@wdio/cucumber-framework';

Then(/^the search results should display only Claw Hammer products$/, async () => {
    const searchCaption = await $('[data-test="search-caption"]');
    await searchCaption.waitForDisplayed({ timeout: 10000 });

    const caption = (await searchCaption.getText()).toLowerCase();
    expect(caption).toContain('claw hammer');

    const resultsContainer = await $('[data-test="search_completed"]');
    await resultsContainer.waitForDisplayed({ timeout: 10000 });

    // Wait for all product cards to render
    await browser.pause(1000);

    // Select each PRODUCT CARD
    const productCards = await resultsContainer.$$('.card');

    expect(productCards.length).toBeGreaterThan(0);

    let validCount = 0;
    for (let i = 0; i < productCards.length; i++) {
        const card = productCards[i];

        await card.waitForDisplayed({ timeout: 5000 });

        const nameEl = await card.$('[data-test="product-name"]');
        await nameEl.waitForDisplayed({ timeout: 5000 });

        const name = (await nameEl.getText()).toLowerCase();

        expect(name).toContain('claw hammer');
        validCount++;
    }
});

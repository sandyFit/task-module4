import { Then } from '@wdio/cucumber-framework';

Then(/^the product should be added to the user's favorites list$/, async () => {
    await browser.waitUntil(async () => {
        const elements = await $$('*');
        for (const el of elements) {
            try {
                const text = (await el.getText()).toLowerCase();
                if (text.includes("product added to your favorites") ||
                    text.includes("added to favorites") ||
                    text.includes("added to favourite")) {
                    return true;
                }
            } catch (e) {
                console.log(e.message);
            }
        }
        return false;
    }, {
        timeout: 8000,
        interval: 500,
        timeoutMsg: 'Success message did not appear after adding to favorites'
    });

    console.log('✅ Product successfully added to favorites');
});

Then(/^the product should appear in the favorites page$/, async () => {
    await browser.pause(1000);

    const menu = await $('[data-test="nav-menu"]');
    await menu.waitForDisplayed({ timeout: 5000 });
    await menu.waitForClickable({ timeout: 5000 });

    await menu.click();

    // Wait for menu to expand
    await browser.pause(500);

    const favLink = await $('[data-test="nav-my-favorites"]');
    await favLink.waitForDisplayed({ timeout: 5000 });
    await favLink.waitForClickable({ timeout: 5000 });

    await favLink.click();

    await browser.waitUntil(
        async () => {
            const url = await browser.getUrl();
            return url.includes('/favorites') || url.includes('/favourites');
        },
        {
            timeout: 10000,
            timeoutMsg: 'Did not navigate to favorites page'
        }
    );

    await browser.pause(2000);

    // Try multiple possible selectors for favorite items
    const possibleSelectors = [
        '[data-test^="product-"]',
        '.card',
        '[data-test="product"]',
        '.product-card',
        '[class*="product"]'
    ];

    let favItems = [];
    for (const selector of possibleSelectors) {
        favItems = await $$(selector);
        if (favItems.length > 0) {
            break;
        } else {
            console.log(`⚠️ No items found`);
        }
    }

    if (favItems.length === 0) {
        const bodyText = await $('body').getText();

        // Check for "no favorites" message
        if (bodyText.toLowerCase().includes('no favorites') ||
            bodyText.toLowerCase().includes('no favourites') ||
            bodyText.toLowerCase().includes('empty')) {
        }
    }

    expect(favItems.length).toBeGreaterThan(0);
});

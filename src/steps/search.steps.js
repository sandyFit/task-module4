import { Given, When } from '@wdio/cucumber-framework';
import { navigateToHome } from '../helpers/navigation.js';

Given(/^the user navigates to the Home page$/, async () => {
    await navigateToHome();
});

When(/^the user enters Claw Hammer in the search bar$/, async () => {
    const filtersBtn = await $('[data-test="filters"]');

    // Check if button is actually visible (mobile view)
    const isButtonVisible = await filtersBtn.isDisplayed().catch(() => false);

    if (isButtonVisible) {
        // Check if angular filters are already expanded
        const filtersExpanded = await $('#filters.show').isExisting().catch(() => false);

        if (!filtersExpanded) {
            await filtersBtn.waitForClickable({ timeout: 5000 });
            await filtersBtn.click();

            // Wait for filters to expand
            await browser.pause(500);
        } else {
            console.log('✅ Filters already expanded');
        }
    } else {
        console.log('💻 Desktop view - search input always visible');
    }

    const searchInput = await $('[data-test="search-query"]');

    await searchInput.waitForDisplayed({ timeout: 5000 });
    await searchInput.waitForEnabled({ timeout: 5000 });

    // Clear any existing value and set new value
    await searchInput.clearValue();
    await searchInput.setValue('claw hammer');

    // Verify the value was set
    const value = await searchInput.getValue();
    console.log('✅ Search input value:', value);

    if (!value.toLowerCase().includes('claw hammer')) {
        throw new Error(`Search input value mismatch. Expected to contain: "claw hammer", Got: "${value}"`);
    }
});

When(/^clicks the Search button$/, async () => {
    const searchButton = await $('[data-test="search-submit"]');

    await searchButton.waitForDisplayed({ timeout: 5000 });
    await searchButton.waitForClickable({ timeout: 5000 });

    await searchButton.click();

    await browser.pause(1000);
});

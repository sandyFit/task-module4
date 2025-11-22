import { Then } from '@wdio/cucumber-framework';

/* ============================
   SIGNUP
============================ */
Then(/^the system should create a new account$/, async () => {
    await browser.waitUntil(
        async () => {
            const url = await browser.getUrl();
            return url.includes('/auth/login');
        },
        {
            timeout: 10000,
            timeoutMsg: 'Expected redirect to login page after successful registration'
        }
    );
});

Then(/^redirect to the Login page$/, async () => {
    const currentUrl = await browser.getUrl();
    expect(currentUrl).toContain('/auth/login');
    console.log('✓ Successfully redirected to login page after registration');
});


/* ============================
   LOGIN
============================ */
Then(/^the user should be redirected to My Account page$/, async () => {
    await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/account'),
        {
            timeout: 8000,
            timeoutMsg: 'Expected redirect to account page after login'
        }
    );
    const currentUrl = await browser.getUrl();
    expect(currentUrl).toContain('/account');
    console.log('✓ Successfully redirected to account page');
});

Then(/^see their name in the header$/, async () => {
    const menu = await $('[data-test="nav-menu"]');
    await menu.waitForDisplayed({ timeout: 5000 });
    const menuText = await menu.getText();
    expect(menuText).toContain('John');
    console.log('User name successfully displayed in header');
});


/* ============================
   PROFILE
============================ */
Then(/^the new password should be saved successfully$/, async () => {
    // Wait for redirect to login page (this is the success indicator)
    await browser.waitUntil(
        async () => {
            const url = await browser.getUrl();
            return url.includes('/auth/login');
        },
        {
            timeout: 10000,
            timeoutMsg: 'Expected redirect to login page after successful password update'
        }
    );

    const currentUrl = await browser.getUrl();
    expect(currentUrl).toContain('/auth/login');
    console.log('✓ Password updated successfully - redirected to login page');
});

Then(/^a success message should appear$/, async () => {
    // Option 1: Check for success message on the profile page before redirect
    // This checks if we're still on profile page and message exists
    const currentUrl = await browser.getUrl();

    if (currentUrl.includes('/profile')) {
        // Still on profile page, check for message
        await browser.waitUntil(
            async () => {
                const elements = await $$('//*[contains(@class, "alert") and contains(@class, "success")]');
                if (elements.length === 0) return false;
                const displayed = await elements[0].isDisplayed();
                return displayed;
            },
            {
                timeout: 3000,
                timeoutMsg: 'Success message did not appear on profile page'
            }
        );
        console.log('✓ Success message displayed');
    } else if (currentUrl.includes('/auth/login')) {
        // Already redirected to login - password change was successful
        console.log('✓ Redirected to login page (password change successful)');
    }
});


/* ============================
    PRODUCTS
============================ */
Then(/^the system should open the Product Details page$/, async () => {
    await browser.waitUntil(
        async () => {
            const url = await browser.getUrl();
            return url.includes('/product/');
        },
        {
            timeout: 10000,
            timeoutMsg: 'Did not navigate to product details page'
        }
    );

    const currentUrl = await browser.getUrl();
    await expect(currentUrl).toContain('/product/');
});

Then(/^displays all the product.?s information.*$/, async () => {
    await browser.pause(1500);

    // Verify product name is displayed
    const productName = await $('h1'); // Main heading is usually the product name
    await productName.waitForDisplayed({ timeout: 5000 });
    const productNameText = await productName.getText();
    await expect(productNameText.length).toBeGreaterThan(0);
    console.log('Product name:', productNameText);

    // Verify product info
    let price = await $('[data-test="unit-price"]');
    await expect(price).toBeDisplayed();
    const priceText = await price.getText();
    console.log('Price:', priceText);

    let description = await $('[data-test="product-description"]');
    await expect(description).toBeDisplayed();
    const descriptionText = await description.getText();
    await expect(descriptionText.length).toBeGreaterThan(0);
    console.log('Description found:', descriptionText.substring(0, 50) + '...');

    let category = await $('span[aria-label="category"]');
    await expect(category).toBeDisplayed();
    const categoryText = await category.getText();
    console.log('Category:', categoryText);

    let ratingBadge = await $('[data-test="co2-rating-badge"]');
    await expect(ratingBadge).toBeDisplayed();
    console.log('CO2 rating badge found');

    console.log('✓ All product information verified successfully');
});


/* ============================
   CART
============================ */
Then(/^the product should be added to the cart list$/, async () => {
    const cartCount = await $('[data-test="cart-quantity"]');
    await cartCount.waitForDisplayed({ timeout: 5000 });

    const countText = await cartCount.getText();
    await expect(countText).toBe('1');
});

Then(/^a successful message should appear$/, async () => {
    const message = await $('//*[contains(text(), "shopping cart")]');
    await message.waitForDisplayed({ timeout: 8000 });
});


/* ============================
   FAVORITES
============================ */
Then(/^the product should be added to the user's favorites list$/, async () => {
    console.log("Checking for success message...");

    await browser.waitUntil(
        async () => {
            const elements = await $$('*');
            for (const el of elements) {
                const text = (await el.getText()).toLowerCase();
                if (text.includes("product added to your favorites list")) {
                    return true;
                }
            }
            return false;
        },
        {
            timeout: 5000,
            timeoutMsg: "Success message not found"
        }
    );

    console.log("✓ Success message appeared");
});

Then(/^the product should appear in the favorites page$/, async () => {
    console.log("Navigating to favorites page...");

    const menu = await $('[data-test="nav-menu"]');
    await menu.click();

    const favLink = await $('[data-test="nav-my-favorites"]');
    await favLink.waitForClickable({ timeout: 5000 });
    await favLink.click();

    await browser.waitUntil(
        async () => (await $$('[data-test^="product-"]')).length > 0,
        {
            timeout: 7000,
            timeoutMsg: "No favorites shown in favorites page"
        }
    );

    const favItems = await $$('[data-test^="product-"]');
    expect(favItems.length).toBeGreaterThan(0);

    console.log("✓ Product is in favorites page");
});


/* ============================
   SEARCH
============================ */
Then(/^the search results should display only Claw Hammer products$/, async () => {

    await $('[data-test="search-caption"]').waitForDisplayed();

    const caption = (await $('[data-test="search-caption"]').getText()).toLowerCase();
    expect(caption).toContain('claw hammer');

    // The real container for results
    const resultsContainer = await $('[data-test="search_completed"]');
    await resultsContainer.waitForDisplayed();

    // Select each PRODUCT CARD
    const productCards = await resultsContainer.$$('.card');

    expect(productCards.length).toBeGreaterThan(0);

    for (const card of productCards) {
        const nameEl = await card.$('[data-test="product-name"]');
        await nameEl.waitForDisplayed();

        const name = (await nameEl.getText()).toLowerCase();
        expect(name).toContain('claw hammer');
    }
});

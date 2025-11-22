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

    // The site first shows a success alert BEFORE redirecting
    const successMessage = await $('//*[@data-test="alert-success" or contains(text(), "updated") or contains(text(), "success")]');
    await successMessage.waitForDisplayed({ timeout: 5000 });

    // Now WAIT for redirect (it takes a little time)
    await browser.waitUntil(
        async () => {
            const url = await browser.getUrl();
            return url.includes('/auth/login');
        },
        {
            timeout: 10000, // more realistic for this site
            timeoutMsg: 'Expected redirect to login page after successful password update'
        }
    );

    // Final confirmation
    await expect(browser).toHaveUrlContaining('/auth/login');
});


// Then(/^a success message should appear$/, async () => {
//     await browser.pause(1000);

//     // Check for success message on login page
//     const successSelectors = [
//         '.alert-success',
//         '.alert.alert-success',
//         '.toast-success',
//         '[role="alert"][class*="success"]',
//         '*=Your password is successfully updated'
//     ];

//     let successFound = false;

//     for (const selector of successSelectors) {
//         const element = await $(selector);
//         if (await element.isExisting()) {
//             try {
//                 const isDisplayed = await element.isDisplayed();
//                 if (isDisplayed) {
//                     const text = await element.getText();
//                     if (text.includes('successfully') || text.includes('updated')) {
//                         console.log(`✓ Success message found: "${text}"`);
//                         successFound = true;
//                         break;
//                     }
//                 }
//             } catch (e) {
//                 continue;
//             }
//         }
//     }

//     if (!successFound) {
//         console.log('⚠️  No explicit success message found, but redirect occurred');
//         console.log('✓ Password update confirmed by redirect to login page');
//     }
// });

Then(/^a success message should appear$/, async () => {
    await browser.waitUntil(
        async () => {
            const elements = await $$('//*[contains(text(), "updated") or contains(text(), "success")]');
            return elements.length > 0;
        },
        {
            timeout: 5000,
            timeoutMsg: 'Success message did not appear'
        }
    );

    const el = await $('//*[contains(text(), "updated") or contains(text(), "success")]');
    await expect(el).toBeDisplayed();
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
    
});


Then(/^a successful message should appear$/, async () => {
    const message = await $('//*[contains(text(), "shopping cart")]');
    await message.waitForDisplayed({ timeout: 8000 });
});




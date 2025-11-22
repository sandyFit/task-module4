import { Given, When } from '@wdio/cucumber-framework';
import { testCredentials } from './test-credentials';

async function fill(selector, value) {
    const el = await $(selector);
    await el.waitForDisplayed({ timeout: 5000 });
    await el.click();
    await browser.pause(150);
    await el.setValue(value);
}

/* ============================
   SIGNUP
============================ */
Given(/^the user is on the Sign Up page$/, async () => {
    await browser.url('https://practicesoftwaretesting.com/auth/register');
});

When(/^the user enters a valid info in all required inputs$/, async () => {
    const creds = testCredentials.getNewUserCredentials();

    await fill('[data-test="first-name"]', creds.firstName);
    await fill('[data-test="last-name"]', creds.lastName);

    const dob = await $('[data-test="dob"]');
    await dob.click();
    await browser.pause(200);
    await dob.setValue(creds.dob);

    await fill('[data-test="street"]', creds.street);
    await fill('[data-test="postal_code"]', creds.postalCode);
    await fill('[data-test="city"]', creds.city);
    await fill('[data-test="state"]', creds.state);

    await $('[data-test="country"]').selectByVisibleText(creds.country);

    await fill('[data-test="phone"]', creds.phone);
    await fill('[data-test="email"]', creds.email);
    await fill('[data-test="password"]', creds.password);

    console.log(`Creating account with email: ${creds.email}`);
});

When(/^clicks the Register button$/, async () => {
    await $('[data-test="register-submit"]').click();
    testCredentials.markSignupCompleted();
});


/* ============================
   LOGIN
============================ */
Given(/^the user has a registered account$/, async () => {
    // Account is created in hooks.js Before hook
    console.log('Using pre-created test account');
});

Given(/^is on the Login page$/, async () => {
    await browser.url('https://practicesoftwaretesting.com/auth/login');
});

When(/^the user enters a valid email and password$/, async () => {
    const creds = testCredentials.getExistingUserCredentials();
    await fill('[data-test="email"]', creds.email);
    await fill('[data-test="password"]', testCredentials.getCurrentPassword());
});

When(/^clicks the Login button$/, async () => {
    await $('[data-test="login-submit"]').click();
});


/* ============================
   PROFILE
============================ */
Given(/^the user is logged into their account$/, async () => {
    const creds = testCredentials.getExistingUserCredentials();

    await browser.url('https://practicesoftwaretesting.com/auth/login');
    await fill('[data-test="email"]', creds.email);
    await fill('[data-test="password"]', testCredentials.getCurrentPassword());
    await $('[data-test="login-submit"]').click();

    await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/account'),
        { timeout: 8000, timeoutMsg: 'Login redirect to account page failed' }
    );

    console.log('✓ Successfully logged in');
});

Given(/^is on the Profile page$/, async () => {
    // Navigate directly to the profile page
    await browser.url('https://practicesoftwaretesting.com/account/profile');
    await browser.pause(1000); // Allow page to stabilize
});

When(/^the user updates their password$/, async () => {
    const currentPassword = testCredentials.getCurrentPassword();
    const newPassword = testCredentials.getNewPassword();

    console.log(`Using current password: ${currentPassword}`);
    console.log(`Setting new password: ${newPassword}`);

    // Fill current password field (this was missing!)
    await fill('[data-test="current-password"]', currentPassword);

    // Fill new password fields
    await fill('[data-test="new-password"]', newPassword);
    await fill('[data-test="new-password-confirm"]', newPassword);

    console.log('All password fields filled for update');
});

When(/^clicks the Change Password button$/, async () => {
    await $('[data-test="change-password-submit"]').click();
});

/* ============================
    PRODUCTS
============================ */
Given(/^the user is on the Home page$/, async () => {
    await browser.url('https://practicesoftwaretesting.com/');
    await browser.pause(2000); // Allow page to load

    // Verify we're on the home page
    await expect(browser).toHaveUrl('https://practicesoftwaretesting.com/');
});

When(/^the user clicks on a specific product name or image$/, async () => {
    // Wait for product cards
    await browser.waitUntil(
        async () => (await $$('[data-test^="product-"]')).length > 0,
        { timeout: 10000, timeoutMsg: 'No products found' }
    );

    // Click the first product
    const productCards = await $$('[data-test^="product-"]');
    const firstProduct = productCards[0];

    await firstProduct.scrollIntoView();
    await firstProduct.waitForClickable({ timeout: 5000 });
    await firstProduct.click();

    // Wait for navigation
    await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/product/'),
        { timeout: 8000, timeoutMsg: 'Did not navigate to product details page' }
    );
});


/* ============================
   CART
============================ */
Given(/^the user is on a Product Details page$/, async () => {
    await browser.url('https://practicesoftwaretesting.com/');

    await browser.waitUntil(
        async () => (await $$('[data-test^="product-"]')).length > 0,
        { timeout: 10000, timeoutMsg: 'No products found on home page' }
    );

    const products = await $$('[data-test^="product-"]');

    await products[0].scrollIntoView();
    await products[0].click();

    await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/product/'),
        { timeout: 8000, timeoutMsg: 'Did not navigate to product detail page' }
    );

    await $('[data-test="product-name"]').waitForDisplayed({ timeout: 10000 });
});


When(/^the user clicks Add to cart button$/, async () => {
    const cartBtn = await $('[data-test="add-to-cart"]');
    await cartBtn.waitForClickable({ timeout: 5000 });
    await cartBtn.click();
});


/* ============================
   FAVORITES
============================ */
Given(/^the user is logged in$/, async () => {
    await browser.url('https://practicesoftwaretesting.com/auth/login');
});

Given(/^is in the Product Details page$/, async () => {
    await browser.url('https://practicesoftwaretesting.com/');

    await browser.waitUntil(
        async () => (await $$('[data-test^="product-"]')).length > 0,
        { timeout: 10000, timeoutMsg: 'No products found on home page' }
    );

    const products = await $$('[data-test^="product-"]');

    await products[0].scrollIntoView();
    await products[0].click();

    await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/product/'),
        { timeout: 8000, timeoutMsg: 'Did not navigate to product detail page' }
    );

    await $('[data-test="product-name"]').waitForDisplayed({ timeout: 10000 });
});

When(/^the user clicks the Add to Favourites button$/, async () => {
    await $('[data-test="add-to-favorites"]').click();
});

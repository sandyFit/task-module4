import { Given, When } from '@wdio/cucumber-framework';
import { testCredentials } from './test-credentials.js';

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
    await fill('[data-test="password"]', creds.password);
});

When(/^clicks the Login button$/, async () => {
    await $('[data-test="login-submit"]').click();
});


/* ============================
   PROFILE
============================ */
Given(/^the user is logged into their account$/, async () => {
    // Account is created in hooks.js Before hook
    const creds = testCredentials.getExistingUserCredentials();

    await browser.url('https://practicesoftwaretesting.com/auth/login');
    await fill('[data-test="email"]', creds.email);
    await fill('[data-test="password"]', creds.password);
    await $('[data-test="login-submit"]').click();

    // Wait for successful login redirect
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
    const newPassword = testCredentials.getNewPassword();
    await fill('[data-test="new-password"]', newPassword);
    await fill('[data-test="new-password-confirm"]', newPassword);
});

When(/^clicks the Change Password button$/, async () => {
    await $('[data-test="change-password-submit"]').click();
});

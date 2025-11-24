import { Given, When } from '@wdio/cucumber-framework';
import { testCredentials } from '../data/test-credentials.js';
import { fill } from '../helpers/form.js';

Given(/^the user has a registered account$/, async () => {
    console.log('Using pre-created test account');
    testCredentials.logCredentials();
});

Given(/^is on the Login page$/, async () => {
    await browser.url('https://practicesoftwaretesting.com/auth/login');
});

When(/^the user enters a valid email and password$/, async () => {
    const existingUser = testCredentials.getExistingUserCredentials();

    if (!existingUser) {
        throw new Error('No existing user found! Make sure signup completed successfully.');
    }

    const email = existingUser.email;
    const password = testCredentials.getCurrentPassword(); 

    await fill('[data-test="email"]', email);
    await fill('[data-test="password"]', password);

});

When(/^clicks the Login button$/, async () => {
    const loginButton = await $('[data-test="login-submit"]');
    await loginButton.waitForClickable({ timeout: 5000 });

    await loginButton.click();
});

import { Given, When } from '@wdio/cucumber-framework';
import { signupNewUser } from '../helpers/account.js';
import { testCredentials } from '../data/test-credentials.js';

Given(/^the user is on the Sign Up page$/, async () => {
    await browser.url('https://practicesoftwaretesting.com/auth/register');
});

When(/^the user enters a valid info in all required inputs$/, async () => {
    const creds = testCredentials.getNewUserCredentials();
    await signupNewUser(creds);
});

When(/^clicks the Register button$/, async () => {
    console.log("Register handled inside signupNewUser");
});

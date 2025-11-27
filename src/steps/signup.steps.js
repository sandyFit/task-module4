import { Given, When, Then } from '@wdio/cucumber-framework';
import { signupNewUser } from '../helpers/account.js';
import { testCredentials } from '../data/test-credentials.js';
import {
    assertAccountCreated,
    expectLoginRedirect,
    shouldContainLoginPath
} from '../assertions/signup.assertions.js';

Given(/^the user is on the Sign Up page$/, async () => {
    await browser.url('/auth/register');
});

When(/^the user enters a valid info in all required inputs$/, async () => {
    const creds = testCredentials.getNewUserCredentials();
    await signupNewUser(creds);
});

When(/^clicks the Register button$/, async () => {
    console.log("Register handled inside signupNewUser");
});

Then(/^the system should create a new account$/, async () => {
    await assertAccountCreated();
});

Then(/^redirect to the Login page$/, async () => {
    await expectLoginRedirect();
});

Then(/^the login URL should contain the path using should$/, async () => {
    await shouldContainLoginPath();
});

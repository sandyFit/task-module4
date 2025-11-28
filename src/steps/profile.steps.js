import { Given, When, Then } from '@wdio/cucumber-framework';
import { testCredentials } from '../data/test-credentials.js';
import { waitForAngular, fillPasswordFieldWithAngular } from '../helpers/form.js'
import {
    assertRedirectAfterPasswordChange,
    expectRedirectAfterPasswordChange,
    shouldRedirectAfterPasswordChange
} from '../assertions/profile.assertions.js';

Given(/^the user is logged into their account$/, async () => {
    console.log('User already logged in via Before hook');
    testCredentials.logCredentials();
});

Given(/^is on the Profile page$/, async () => {
    await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/account'),
        {
            timeout: 8000,
            timeoutMsg: 'User is not on the Account page'
        }
    );

    const profileTab = await $('[data-test="nav-profile"]');
    await profileTab.waitForClickable();
    await profileTab.click();

    await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/account/profile'),
        {
            timeout: 8000,
            timeoutMsg: 'User was not redirected to Profile page'
        }
    );

    await waitForAngular();
});


When(/^the user updates their password$/, async () => {
    await $('[data-test="current-password"]').waitForDisplayed({ timeout: 10000 });

    // Wait for Angular and the form to be fully ready
    await waitForAngular();
    await browser.pause(1000);

    const currentPwd = testCredentials.getCurrentPassword();
    const newPwd = testCredentials.getNewPassword();


    await fillPasswordFieldWithAngular('[data-test="current-password"]', currentPwd, 'Current password');
    await fillPasswordFieldWithAngular('[data-test="new-password"]', newPwd, 'New password');
    await fillPasswordFieldWithAngular('[data-test="new-password-confirm"]', newPwd, 'Confirm password');

    await waitForAngular();
    await browser.pause(1000);
});

When(/^clicks the Change Password button$/, async () => {
    const btn = await $('[data-test="change-password-submit"]');
    await btn.waitForDisplayed({ timeout: 3000 });

    await waitForAngular();

    const isEnabled = await btn.isEnabled();
    const buttonText = await btn.getText();

    if (!isEnabled) {
        await browser.saveScreenshot('./button-disabled.png');
        throw new Error('Change Password button is disabled!');
    }

    await waitForAngular();

    await btn.click();
    await browser.pause(1000);

});

Then(/^the new password should be saved successfully$/, async () => {
    await browser.pause(1000);

    await browser.waitUntil(
        async () => {
            const url = await browser.getUrl();
            return url.includes('/auth/login');
        },
        {
            timeout: 6000,
            timeoutMsg: 'Expected redirect to login page after password change',
            interval: 1000
        }
    );


    const newPassword = testCredentials.getNewPassword();
    testCredentials.updatePassword(newPassword);
});

Then(/^a success message should appear$/, async () => {
    await assertRedirectAfterPasswordChange();   
    await expectRedirectAfterPasswordChange();   
    await shouldRedirectAfterPasswordChange();   
});

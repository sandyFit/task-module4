import { Given, When, Then } from '@wdio/cucumber-framework';
import { createTestCredentials, generateRandomPassword } from '../../../business/data/user-factory.js';
import { ProfilePage } from '../../../business/pages/account/profile.page.js';
import * as browserManager from '../../../core/browser/browser-helper.js';
import { logger } from '../../../core/logger/logger.js';
import { expect } from 'chai';


const profilePage = new ProfilePage();
let testCredentials;


Given(/^the user is logged into their account$/, async function () {
    testCredentials = createTestCredentials(this.currentUser);

    logger.info('User already logged in via Before hook');
    testCredentials.logCredentials();
});

Given(/^is on the Profile page$/, async () => {
    logger.info('Navigating to Profile page');
    await profilePage.open();
});


When(/^the user updates their password$/, async () => {

    await profilePage.waitForAngular();

    logger.info('Filling password change form');

    const currentPwd = testCredentials.getCurrentPassword();
    const newPwd = generateRandomPassword(12); 
    testCredentials.updatePassword(newPwd);

    await profilePage.clearAndFillInput(
        profilePage.currentPasswordInput,
        currentPwd,
        'Current password'
    );

    await profilePage.clearAndFillInput(
        profilePage.newPasswordInput,
        newPwd,
        'New password'
    );

    await profilePage.clearAndFillInput(
        profilePage.confirmPasswordInput,
        newPwd,
        'Confirm password'
    );

    await profilePage.waitForAngular();
});

When(/^clicks the Change Password button$/, async () => {
    const btn = await profilePage.changePasswordButton;

    await btn.waitForDisplayed({ timeout: 10000 });
    await profilePage.waitForAngular();

    const enabled = await btn.isEnabled();
    if (!enabled) {
        await browserManager.takeScreenshot('change-password-disabled');
        throw new Error('ERROR: Change Password button is disabled');
    }

    logger.info('Clicking Change Password button');

    await profilePage.clickElement(btn, 'Change Password button');
    await profilePage.pause(300, 'waiting for password change to process');
});



Then(/^the new password should be saved successfully$/, async () => {

    logger.info('Verifying redirect to login after password change');

    const errorAlert = await $('[data-test="alert-error"]');
    if (await errorAlert.isDisplayed()) {
        const txt = await errorAlert.getText();
        throw new Error('Password change failed: ' + txt);
    }
    
});

Then(/^a success message should appear$/, async () => {

    logger.info('Waiting for redirect to login after password change…');

    await profilePage.waitForUrlToContain('/auth/login', 15000);

    const finalUrl = await profilePage.getCurrentUrl();

    expect(finalUrl).to.include(
        '/auth/login',
        'User was NOT redirected to login after password change'
    );

    logger.info('✅ Password updated successfully → redirected to login');
});


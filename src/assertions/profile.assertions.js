import { Then } from '@wdio/cucumber-framework';
import { testCredentials } from '../data/test-credentials.js';

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
    const url = await browser.getUrl();
    expect(url).toContain('/auth/login');
});

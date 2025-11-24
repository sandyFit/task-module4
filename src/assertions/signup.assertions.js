import { Then } from '@wdio/cucumber-framework';

Then(/^the system should create a new account$/, async () => {
    await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/auth/login'),
        { timeout: 10000 }
    );
});

Then(/^redirect to the Login page$/, async () => {
    expect(await browser.getUrl()).toContain('/auth/login');
});

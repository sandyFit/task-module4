import { Then } from '@wdio/cucumber-framework';

Then(/^the user should be redirected to My Account page$/, async () => {
    await browser.waitUntil(
        async () => {
            const url = await browser.getUrl();
            return url.includes('/account');
        },
        {
            timeout: 10000,
            interval: 1000,
            timeoutMsg: 'Expected redirect to /account page after login'
        }
    );

    const finalUrl = await browser.getUrl();

    expect(finalUrl).toContain('/account');
});

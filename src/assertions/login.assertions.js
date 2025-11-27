import { Then } from '@wdio/cucumber-framework';
import * as chai from 'chai';

const assert = chai.assert;
const expect = chai.expect;
chai.should();

Then(/^the user should be redirected to My Account page$/, async () => {
    const redirect = await browser.waitUntil(
        async () => {
            const url = await browser.getUrl();
            return url.includes('/account');
        },
        {
            timeout: 10000,
            interval: 1000,
        }

    );

    assert.isTrue(
        redirect,
        "ASSERT: Expected redirect to /account page after login"
    )

    const finalUrl = await browser.getUrl();

    expect(finalUrl).to.contain('/account');
});

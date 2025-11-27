import { Then } from '@wdio/cucumber-framework';
import chai from 'chai';

const assert = chai.assert;
const expect = chai.expect;
chai.should();

Then(/^the system should create a new account$/, async () => {
    const redirect = await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/auth/login'),
        { timeout: 10000 }
    );

    assert.isTrue(
        redirect,
        "ASSERT: Expected redirect to login page but it did not happen"
    )
});

Then(/^redirect to the Login page$/, async () => {
    const url = await browser.getUrl();
    expect(url).to.contain('/auth/login');
});

// Adding new step for should interface
Then(/^the login URL should contain the path using should$/, async () => {
    const url = await browser.getUrl();
    url.should.contain('/auth/login');
});


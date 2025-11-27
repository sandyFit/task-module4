import * as chai from 'chai';

const assert = chai.assert;
const expect = chai.expect;
chai.should();

export async function assertAccountCreated() {
    const redirect = await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/auth/login'),
        { timeout: 10000 }
    );

    assert.isTrue(
        redirect,
        "ASSERT: Expected redirect to login page but it did not happen"
    );
}

export async function expectLoginRedirect() {
    const url = await browser.getUrl();
    expect(url).to.contain('/auth/login');
}

export async function shouldContainLoginPath() {
    const url = await browser.getUrl();
    url.should.contain('/auth/login');
}

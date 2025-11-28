
import * as chai from 'chai';

const assert = chai.assert;
const expect = chai.expect;
chai.should();


export async function assertRedirectToAccount() {
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
    );
}

export async function expectUrlContainsAccount() {
    const finalUrl = await browser.getUrl();
    expect(finalUrl).to.contain('/account');
}

export async function shouldUrlContainAccount() {
    const url = await browser.getUrl();
    url.should.contain('/account');   
}

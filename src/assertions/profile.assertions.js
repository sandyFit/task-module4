import * as chai from 'chai';
const assert = chai.assert;
const expect = chai.expect;
chai.should();

export async function assertRedirectAfterPasswordChange() {
    const url = await browser.getUrl();
    assert.isTrue(
        url.includes('/auth/login'),
        "ASSERT: Expected redirect to /auth/login after password change"
    );
}

export async function expectRedirectAfterPasswordChange() {
    const url = await browser.getUrl();
    expect(url).to.contain('/auth/login');
}


export async function shouldRedirectAfterPasswordChange() {
    const url = await browser.getUrl();
    url.should.contain('/auth/login');
}



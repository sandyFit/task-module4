import { expect, assert } from 'chai';
import { BasePage } from '../../business/pages/basePage.js';

const basePage = new BasePage();

/**
 * Wait for URL to contain /account and assert
 */
export async function verifyRedirectToAccount(timeout = 10000) {
    await basePage.waitForUrlToContain('/account', timeout);

    const url = await basePage.getCurrentUrl();
    expect(url).to.contain('/account', 'URL should contain /account after login');
}

export function assertNotEmptyFields(object, fields) {
    fields.forEach(field => {
        assert.exists(object[field], `Field "${field}" should exist`);
        assert.isNotEmpty(object[field], `Field "${field}" should not be empty`);
    });
}

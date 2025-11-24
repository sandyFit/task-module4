import { fill, clearAndType } from './form.js';
import { testCredentials } from '../data/test-credentials.js';

export async function signupNewUser(creds = null) {
    creds = creds || testCredentials.getNewUserCredentials();
    testCredentials.setExistingUserCredentials(creds);

    await browser.url('https://practicesoftwaretesting.com/auth/register');
    await $('[data-test="first-name"]').waitForDisplayed({ timeout: 10000 });

    await fill('[data-test="first-name"]', creds.firstName);
    await fill('[data-test="last-name"]', creds.lastName);
    const dob = await $('[data-test="dob"]');
    await dob.click();
    await dob.setValue(creds.dob);

    await fill('[data-test="street"]', creds.street);
    await fill('[data-test="postal_code"]', creds.postalCode);
    await fill('[data-test="city"]', creds.city);
    await fill('[data-test="state"]', creds.state);
    await $('[data-test="country"]').selectByVisibleText(creds.country);

    await fill('[data-test="phone"]', creds.phone);
    await fill('[data-test="email"]', creds.email);
    await fill('[data-test="password"]', creds.password);

    const submitBtn = await $('[data-test="register-submit"]');
    await submitBtn.waitForClickable({ timeout: 5000 });
    await submitBtn.click();

    await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/auth/login'),
        {
            timeout: 10000,
            timeoutMsg: 'Registration did not redirect to login page'
        }
    );

    console.log('✅ Signup completed successfully');
    testCredentials.markSignupCompleted();
}



export async function loginUser(email, password) {
    await browser.url('https://practicesoftwaretesting.com/auth/login');
    await $('[data-test="email"]').waitForDisplayed({ timeout: 10000 });

    await clearAndType('[data-test="email"]', email);
    await clearAndType('[data-test="password"]', password);

    const btn = await $('[data-test="login-submit"]');
    await btn.waitForClickable();
    await btn.click();

    await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/account'),
        {
            timeout: 15000,
            timeoutMsg: 'Login redirect failed - never reached account page'
        }
    );

    console.log('✅ Successfully logged in and redirected to account page');
}

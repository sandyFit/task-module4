import { Before, After, BeforeAll, AfterAll } from '@wdio/cucumber-framework';
import { testCredentials } from './test-credentials.js';

let accountCreated = false;

/**
 * BeforeAll - Runs once before all tests
 * Creates the test account that all tests will use
 */
BeforeAll(async function () {
    console.log('==============================================');
    console.log('SETTING UP TEST SUITE');
    console.log('==============================================');
    testCredentials.logCredentials();
});

/**
 * Before - Runs before each scenario
 * Creates account only once for the entire test suite
 */
Before(async function ({ pickle }) {
    console.log(`\n▶ Starting scenario: ${pickle.name}`);

    // Only create account once, before the first test that needs it
    if (!accountCreated && pickle.name !== 'Successful Sign Up with valid data') {
        console.log('📝 Creating test account for suite...');

        const creds = testCredentials.getNewUserCredentials();

        await browser.url('https://practicesoftwaretesting.com/auth/register');

        // Fill signup form
        const fillField = async (selector, value) => {
            const el = await $(selector);
            await el.waitForDisplayed({ timeout: 5000 });
            await el.click();
            await browser.pause(150);
            await el.setValue(value);
        };

        await fillField('[data-test="first-name"]', creds.firstName);
        await fillField('[data-test="last-name"]', creds.lastName);

        const dob = await $('[data-test="dob"]');
        await dob.click();
        await browser.pause(200);
        await dob.setValue(creds.dob);

        await fillField('[data-test="street"]', creds.street);
        await fillField('[data-test="postal_code"]', creds.postalCode);
        await fillField('[data-test="city"]', creds.city);
        await fillField('[data-test="state"]', creds.state);

        await $('[data-test="country"]').selectByVisibleText(creds.country);

        await fillField('[data-test="phone"]', creds.phone);
        await fillField('[data-test="email"]', creds.email);
        await fillField('[data-test="password"]', creds.password);

        console.log(`   Email: ${creds.email}`);

        await $('[data-test="register-submit"]').click();

        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/auth/login'),
            { timeout: 10000, timeoutMsg: 'Signup did not redirect to login page' }
        );

        accountCreated = true;
        testCredentials.markSignupCompleted();
        console.log('✅ Test account created successfully');
    }
});

/**
 * After - Runs after each scenario
 */
After(async function ({ pickle, result }) {
    const status = result?.status || 'unknown';
    const emoji = status === 'PASSED' ? '✅' : status === 'FAILED' ? '❌' : '⚠️';
    console.log(`${emoji} Scenario completed: ${pickle.name} - ${status}\n`);
});

/**
 * AfterAll - Runs once after all tests
 */
AfterAll(async function () {
    console.log('==============================================');
    console.log('TEST SUITE COMPLETED');
    console.log('==============================================');
});

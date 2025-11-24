import { Before, After, BeforeAll, AfterAll } from '@wdio/cucumber-framework';
import { testCredentials } from '../data/test-credentials.js';
import { signupNewUser, loginUser } from '../helpers/account.js';

console.log('🔧 HOOKS: hooks.js loaded');

let accountCreated = false;

BeforeAll(async function () {
    console.log('==============================================');
    console.log('SETTING UP TEST SUITE');
    console.log('==============================================');

});

Before(async function ({ pickle }) {
    // Set window size to desktop on first scenario (when browser exists)
    if (!accountCreated) {
        await browser.setWindowSize(1920, 1080);
    }

    console.log(`\n🎬 Starting scenario: "${pickle.name}"`);
    const scenarioName = pickle.name.toLowerCase();
    const isSignupScenario = scenarioName.includes('sign up') || scenarioName.includes('signup');

    const needsAccount = !isSignupScenario && (
        scenarioName.includes('login') ||
        scenarioName.includes('profile') ||
        scenarioName.includes('favorite') ||
        scenarioName.includes('favourite') ||
        scenarioName.includes('account')
    );

    if (needsAccount && !accountCreated) {
        console.log("🚀 Creating test account...");
        try {
            const creds = testCredentials.getNewUserCredentials();

            await signupNewUser(creds);
            await loginUser(creds.email, creds.password);

            accountCreated = true;
            testCredentials.setExistingUserCredentials(creds);
            testCredentials.markSignupCompleted();
            console.log('✅ Account created and verified');

        } catch (error) {
            console.log('❌ Failed:', error.message);
            throw error;
        }
    } else if (accountCreated) {
        console.log('ℹ️ Using existing test account from previous scenario');
    } else {
        console.log('ℹ️ No account needed for this scenario');
    }
});

After(function ({ pickle, result }) {
    const status = result?.status || 'unknown';
    const emoji = status === 'PASSED' ? '✅' : '❌';
    console.log(`${emoji} Completed: "${pickle.name}" - ${status}`);
});

AfterAll(function () {
    console.log('==============================================');
    console.log('TEST SUITE COMPLETED');
    console.log('==============================================');
    console.log(`📊 Account was created during test run: ${accountCreated}`);
});

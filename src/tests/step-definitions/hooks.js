import { Before, After, BeforeAll, AfterAll } from '@wdio/cucumber-framework';
import { logger } from '../../core/logger/logger.js';
import { getExistingUser } from '../../business/data/user-factory.js';
import { LoginPage } from '../../business/pages/auth/login.page.js';

const loginPage = new LoginPage();

logger.info('🔧 HOOKS: hooks.js loaded');

BeforeAll(async function () {
    logger.info('==============================================');
    logger.info('SETTING UP TEST SUITE');
    logger.info('==============================================');
});

Before(async function ({ pickle }) {
    logger.info(`🎬 Starting scenario: "${pickle.name}"`);

    await browser.setWindowSize(1920, 1080);

    const name = pickle.name.toLowerCase();

    const requiresLogin =
        !name.includes('sign up') &&
        !name.includes('signup') &&
        (
            name.includes('login') ||
            name.includes('profile') ||
            name.includes('favorite') ||
            name.includes('favourite') ||
            name.includes('account')
        );

    if (requiresLogin) {
        logger.info('🔐 Scenario requires authenticated user');

        const user = getExistingUser();
        await loginPage.open();
        await loginPage.login(user.email, user.password);

        logger.info('✔ Logged in with existing test user');
    } else {
        logger.info('ℹ No login required for this scenario');
    }
});

After(function ({ pickle, result }) {
    const status = result?.status || 'UNKNOWN';
    const emoji = status === 'PASSED' ? '✅' : '❌';
    logger.info(`${emoji} Completed: "${pickle.name}" - ${status}`);
});

AfterAll(function () {
    logger.info('==============================================');
    logger.info('TEST SUITE COMPLETED');
    logger.info('==============================================');
});

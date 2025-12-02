import { BasePage } from '../basePage.js';
import { logger } from '../../../core/logger/logger.js';
import * as formHelper from '../../../core/browser/form-helper.js';
import { waitForUrlToContain } from '../../../core/browser/wait-helper.js';


export class LoginPage extends BasePage {

    selectors = {
        email: '[data-test="email"]',
        password: '[data-test="password"]',
        submit: '[data-test="login-submit"]'
    };

    /**
     * Open login page
     */
    async open() {
        logger.info('Opening Login page');
        await this.navigateTo('/auth/login');
        await $('[data-test="email"]').waitForDisplayed({ timeout: 10000 });
    }

    /**
     * Perform full login
     */
    async login(email, password) {
        logger.info(`Logging in with email: ${email}`);

        await this.clearAndFillInput(await $(this.selectors.email), email, 'Email');
        await this.clearAndFillInput(await $(this.selectors.password), password, 'Password');

        const submitBtn = await $(this.selectors.submit);
        await this.clickElement(submitBtn, 'Login Button');

        await this.waitForUrlToContain('/account', 15000);
        logger.info('Successfully logged in and redirected to account page');
    }



    /**
     * Verify on login page
     */
    async verifyOnLoginPage() {
        await waitForUrlToContain('/auth/login');
    }

    /**
     * Check if on login page
     */
    async isOnLoginPage() {
        const url = await this.getCurrentUrl();
        return url.includes('/auth/login');
    }
}

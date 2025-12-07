import { AccountPage } from './account.page.js';
import { logger } from '../../../core/logger/logger.js';

export class ProfilePage extends AccountPage {

    selectors = {
        currentPassword: '[data-test="current-password"]',
        newPassword: '[data-test="new-password"]',
        confirmPassword: '[data-test="new-password-confirm"]',
        changePasswordBtn: '[data-test="change-password-submit"]'
    };

    // ================= Getters =================
    get currentPasswordInput() {
        return $(this.selectors.currentPassword);
    }

    get newPasswordInput() {
        return $(this.selectors.newPassword);
    }

    get confirmPasswordInput() {
        return $(this.selectors.confirmPassword);
    }

    get changePasswordButton() {
        return $(this.selectors.changePasswordBtn);
    }

    // ================= Methods =================

    async open() {
        logger.info('Opening Profile page');

        // Navigate directly to profile URL
        await this.navigateTo('/account/profile');
        await this.waitForPageLoad();

        logger.info(`Current URL: ${await this.getCurrentUrl()}`);

        // Wait for profile form elements to be visible
        await this.waitForProfileElements();
    }

    async getCurrentUrl() {
        return await super.getCurrentUrl();
    }

    async waitForProfileElements() {
        logger.info('Waiting for profile form elements...');

        const elements = [
            this.currentPasswordInput,
            this.newPasswordInput,
            this.confirmPasswordInput,
            this.changePasswordButton
        ];

        for (const el of elements) {
            await el.waitForDisplayed({ timeout: 10000 });
        }

        logger.info('✅ All profile elements are visible');
    }

    async waitForAngular() {
        await browser.execute(() => {
            return new Promise((resolve) => {
                if (window.getAllAngularTestabilities) {
                    const testabilities = window.getAllAngularTestabilities();
                    let count = testabilities.length;
                    if (count === 0) {
                        resolve();
                        return;
                    }
                    testabilities.forEach((testability) => {
                        testability.whenStable(() => {
                            count--;
                            if (count === 0) {
                                resolve();
                            }
                        });
                    });
                } else {
                    resolve();
                }
            });
        });
        await browser.pause(500);
    }

    async updatePassword(currentPassword, newPassword) {
        logger.info('Updating password');

        await this.currentPasswordInput.waitForDisplayed({ timeout: 5000 });
        await this.newPasswordInput.waitForDisplayed({ timeout: 5000 });
        await this.confirmPasswordInput.waitForDisplayed({ timeout: 5000 });
        await this.changePasswordButton.waitForDisplayed({ timeout: 5000 });
        await this.changePasswordButton.waitForClickable({ timeout: 5000 });

        await this.clearAndFillInput(this.currentPasswordInput, currentPassword, 'Current password');
        await this.clearAndFillInput(this.newPasswordInput, newPassword, 'New password');
        await this.clearAndFillInput(this.confirmPasswordInput, newPassword, 'Confirm password');

        await this.changePasswordButton.click();
        await browser.pause(1000);

        logger.info('✅ Password update submitted');
    }

    async isOnProfilePage() {
        const url = await this.getCurrentUrl();
        return url.includes('/account/profile');
    }
}

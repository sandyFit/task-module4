import * as waitHelper from '../../core/browser/wait-helper.js';
import * as browserManager from '../../core/browser/browser-helper.js';
import { logger } from '../../core/logger/logger.js';
import { getDefaultTimeout } from '../../core/config/test-config.js';
import { HeaderComponent } from '../components/common/header.component.js';
import { AccountSidebar } from '../components/account/account-sidebar.component.js';


export class BasePage {
    constructor() {
        this.header = new HeaderComponent();
        this.accountSidebar = new AccountSidebar();
    }

    async navigateTo(path) {
        logger.info(`Navigating to: ${path}`);
        await browserManager.navigateTo(path);
    }

    async getCurrentUrl() {
        return await browserManager.getCurrentUrl();
    }

    async waitForUrlToContain(path, timeout = getDefaultTimeout()) {
        return waitHelper.waitForUrlToContain(path, timeout);
    }

    async clickElement(element, name = 'element') {
        logger.info(`Click → ${name}`);
        await waitHelper.waitForElementClickable(element);
        await element.click();
    }

    async fillInput(element, value, name = 'input') {
        logger.info(`Typing into ${name}: ${value}`);
        await waitHelper.waitForElementVisible(element);
        await element.setValue(value);
    }

    async clearAndFillInput(element, value, name = 'input') {
        logger.info(`Clearing & typing into ${name}: ${value}`);

        // Wait for it to be fully displayed and enabled
        await element.waitForDisplayed({ timeout: 5000 });
        await element.waitForEnabled({ timeout: 5000 });
        await browser.pause(100);

        // Clear and type
        await element.clearValue();
        await element.setValue(value);
    }


    async fillField(element, value, name = '') {
        const tag = await element.getTagName();
        if (tag === 'select') {
            await element.selectByVisibleText(value);
            logger.info(`Selecting ${name}: ${value}`);
        } else {
            await this.clearAndFillInput(element, value, name);
        }
    }

    async setInputValueDirectly(element, value, name = 'input') {
        logger.info(`Typing into ${name} directly via JS: ${value}`);
        await browser.execute((el, val) => {
            el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }, element, value);
    }

    async getElementText(element, name = 'element') {
        await element.scrollIntoView();

        await waitHelper.waitForElementVisible(element, 5000);
        const text = await element.getText();
        logger.info(`Text retrieved from ${name}: "${text}"`);
        return text;
    }

    async isElementDisplayed(element) {
        try {
            return await element.isDisplayed();
        } catch {
            return false;
        }
    }

    async waitAndGetText(element, name = 'element', timeout = getDefaultTimeout()) {
        await waitHelper.waitForElementVisible(element, timeout);
        const text = await element.getText();
        logger.info(`Wait + Text from ${name}: "${text}"`);
        return text;
    }

    async scrollToElement(element, name = 'element') {
        logger.info(`Scrolling into view: ${name}`);
        await element.scrollIntoView();
    }

    async waitForPageLoad(timeout) {
        timeout = timeout || getDefaultTimeout();

        logger.info('Waiting for page load...');
        await browser.waitUntil(
            async () => (await browser.execute(() => document.readyState)) === 'complete',
            {
                timeout,
                timeoutMsg: `Page did not reach 'complete' readyState within ${timeout}ms`
            }
        );
        logger.info('Page fully loaded');
    }

    


}

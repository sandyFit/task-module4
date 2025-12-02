import { logger } from '../logger/logger.js';

/**
 * Navigate to a specific path
 */
export async function navigateTo(path) {
    const fullUrl = path.startsWith('http')
        ? path
        : `${browser.options.baseUrl}${path}`;

    logger.info(`Navigating to: ${fullUrl}`);
    await browser.url(fullUrl);
}


/**
 * Get current URL
 */
export async function getCurrentUrl() {
    const url = await browser.getUrl();
    logger.info(`Current URL: ${url}`);
    return url;
}

/**
 * Refresh the page
 */
export async function refresh() {
    logger.info('Refreshing page');
    await browser.refresh();
}

/**
 * Get page title
 */
export async function getTitle() {
    return await browser.getTitle();
}

/**
 * Execute JavaScript in browser
 */
export async function executeScript(script, ...args) {
    return await browser.execute(script, ...args);
}

/**
 * Take screenshot
 */
export async function takeScreenshot(filename) {
    logger.info(`Taking screenshot: ${filename}`);
    return await browser.saveScreenshot(`./screenshots/${filename}.png`);
}

/**
 * Clear browser cookies
 */
export async function clearCookies() {
    logger.info('Clearing cookies');
    await browser.deleteCookies();
}

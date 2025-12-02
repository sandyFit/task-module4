import { logger } from '../logger/logger.js';

/**
 * Fill input field with value
 */
export async function fill(selector, value) {
    logger.info(`Filling field: ${selector}`);
    const element = await $(selector);

    await element.waitForDisplayed({ timeout: 5000 });
    await element.scrollIntoView();
    await element.click();

    // Clear existing value
    await browser.keys(['Control', 'a']);
    await browser.keys('Backspace');

    // Add new value
    await element.addValue(value);
}

/**
 * Clear and type into input field
 */
export async function clearAndType(selector, value) {
    logger.info(`Clearing and typing in: ${selector}`);
    const element = await $(selector);

    await element.waitForDisplayed();
    await element.click();

    // Clear
    await browser.keys(['Control', 'a']);
    await browser.keys('Backspace');

    // Type
    await element.addValue(value);
}

/**
 * Select dropdown by visible text
 */
export async function selectByText(selector, text) {
    logger.info(`Selecting "${text}" from: ${selector}`);
    const element = await $(selector);
    await element.waitForDisplayed();
    await element.selectByVisibleText(text);
}

/**
 * Get input value
 */
export async function getValue(selector) {
    const element = await $(selector);
    await element.waitForDisplayed();
    return await element.getValue();
}

/**
 * Check if field is enabled
 */
export async function isEnabled(selector) {
    const element = await $(selector);
    return await element.isEnabled();
}

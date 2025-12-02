/**
 * Get base URL from WebDriver config
 */
export function getBaseUrl() {
    return browser.config.baseUrl || 'https://practicesoftwaretesting.com';
}

/**
 * Get default timeout
 */
export function getDefaultTimeout() {
    // fallback to 10000 if browser or browser.config is not ready
    return (browser?.config?.waitforTimeout) || 10000;
}


/**
 * Get short timeout
 */
export function getShortTimeout() {
    return 3000;
}

/**
 * Get long timeout
 */
export function getLongTimeout() {
    return 30000;
}

/**
 * Build full URL from path
 */
export function getFullUrl(path) {
    return `${getBaseUrl()}${path}`;
}

/**
 * Get any config value from wdio.conf
 */
export function getConfig(key, defaultValue = null) {
    return browser.config[key] || defaultValue;
}

/**
 * Check if running in headless mode
 */
export function isHeadless() {
    const caps = browser.capabilities;
    return (
        caps['goog:chromeOptions']?.args?.includes('--headless') ||
        caps['moz:firefoxOptions']?.args?.includes('-headless')
    );
}

/**
 * Get browser name
 */
export function getBrowserName() {
    return browser.capabilities.browserName;
}

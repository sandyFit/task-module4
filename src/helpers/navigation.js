export async function navigateToHome() {
    await browser.url('/');

    await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/'),
        { timeout: 5000, timeoutMsg: 'Home page did not load' }
    );

    const url = await browser.getUrl();
    const path = new URL(url).pathname;

    expect(path).toBe('/');
}

export async function navigateToLogin() {
    await browser.url('/auth/login');
    await $('[data-test="login-submit"]').waitForDisplayed({ timeout: 5000 });
}


export async function navigateToProductDetails() {
    await browser.url('/');

    await browser.waitUntil(
        async () => (await $$('[data-test^="product-"]')).length > 0,
        { timeout: 10000 }
    );

    const firstProduct = (await $$('[data-test^="product-"]'))[0];
    await firstProduct.scrollIntoView();
    await firstProduct.waitForClickable();
    await firstProduct.click();

    await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/product/'),
        { timeout: 8000 }
    );

    await $('[data-test="product-name"]').waitForDisplayed();
}

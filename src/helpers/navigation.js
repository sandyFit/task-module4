export async function navigateToHome() {
    await browser.url('https://practicesoftwaretesting.com/');
    await browser.pause(2000);
    await expect(browser).toHaveUrl('https://practicesoftwaretesting.com/');
}

export async function navigateToLogin() {
    await browser.url('https://practicesoftwaretesting.com/auth/login');
    await $('[data-test="login-submit"]').waitForDisplayed({ timeout: 5000 });
}


export async function navigateToProductDetails() {
    await browser.url('https://practicesoftwaretesting.com/');

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

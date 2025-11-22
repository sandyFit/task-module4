import { Given, When } from '@wdio/cucumber-framework';
import { testCredentials } from './test-credentials';

async function fill(selector, value) {
    const el = await $(selector);

    await el.waitForDisplayed({ timeout: 5000 });
    await el.scrollIntoView();
    await el.click();

    // Proper Angular clearing
    await browser.keys(['Control', 'a']);
    await browser.keys('Backspace');

    // Type char by char so Angular triggers validation
    await el.addValue(value);
}



/* ============================
   SIGNUP
============================ */
Given(/^the user is on the Sign Up page$/, async () => {
    await browser.url('https://practicesoftwaretesting.com/auth/register');
});

When(/^the user enters a valid info in all required inputs$/, async () => {
    const creds = testCredentials.getNewUserCredentials();

    await fill('[data-test="first-name"]', creds.firstName);
    await fill('[data-test="last-name"]', creds.lastName);

    const dob = await $('[data-test="dob"]');
    await dob.click();
    await browser.pause(200);
    await dob.setValue(creds.dob);

    await fill('[data-test="street"]', creds.street);
    await fill('[data-test="postal_code"]', creds.postalCode);
    await fill('[data-test="city"]', creds.city);
    await fill('[data-test="state"]', creds.state);

    await $('[data-test="country"]').selectByVisibleText(creds.country);

    await fill('[data-test="phone"]', creds.phone);
    await fill('[data-test="email"]', creds.email);
    await fill('[data-test="password"]', creds.password);

    console.log(`Creating account with email: ${creds.email}`);
});

When(/^clicks the Register button$/, async () => {
    await $('[data-test="register-submit"]').click();
    testCredentials.markSignupCompleted();
});


/* ============================
   LOGIN
============================ */
Given(/^the user has a registered account$/, async () => {
    // Account is created in hooks.js Before hook
    console.log('Using pre-created test account');
});

Given(/^is on the Login page$/, async () => {
    await browser.url('https://practicesoftwaretesting.com/auth/login');
});

When(/^the user enters a valid email and password$/, async () => {
    const creds = testCredentials.getExistingUserCredentials();
    await fill('[data-test="email"]', creds.email);
    await fill('[data-test="password"]', testCredentials.getCurrentPassword());
});

When(/^clicks the Login button$/, async () => {
    await $('[data-test="login-submit"]').click();
});


/* ============================
   PROFILE
============================ */
Given(/^the user is logged into their account$/, async () => {
    const creds = testCredentials.getExistingUserCredentials();

    await browser.url('https://practicesoftwaretesting.com/auth/login');
    await fill('[data-test="email"]', creds.email);
    await fill('[data-test="password"]', testCredentials.getCurrentPassword());
    await $('[data-test="login-submit"]').click();

    await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/account'),
        { timeout: 8000, timeoutMsg: 'Login redirect to account page failed' }
    );

    console.log('✓ Successfully logged in');
});

Given(/^is on the Profile page$/, async () => {
    // Don't navigate directly - use the UI navigation to ensure Angular state is properly set
    console.log('📍 Navigating to Profile page via UI...');

    // Click on the user menu/account link in the header
    const userMenu = await $('[data-test="nav-menu"]');
    await userMenu.waitForDisplayed({ timeout: 5000 });
    await userMenu.click();

    // Wait a bit for dropdown/navigation
    await browser.pause(500);

    // Look for Profile link
    const profileLink = await $('a[href="/account/profile"], a[routerlink="/account/profile"]');
    if (await profileLink.isDisplayed()) {
        await profileLink.click();
    } else {
        // Fallback: navigate directly but wait for user data to load
        await browser.url('https://practicesoftwaretesting.com/account/profile');
    }

    // Wait for the page to fully load and user data to be available
    await browser.waitUntil(
        async () => {
            const url = await browser.getUrl();
            return url.includes('/profile');
        },
        { timeout: 5000, timeoutMsg: 'Did not navigate to profile page' }
    );

    // CRITICAL: Wait for Angular to load user data by checking if form is ready
    await browser.waitUntil(
        async () => {
            const ready = await browser.execute(() => {
                // Check if user data is loaded by looking for populated form fields
                const firstNameInput = document.querySelector('[data-test="first-name"], input[formcontrolname="first_name"]');
                if (!firstNameInput) return false;
                const value = firstNameInput.value;
                return value && value.length > 0; // User data is loaded if first name is populated
            });
            return ready;
        },
        {
            timeout: 10000,
            timeoutMsg: 'Profile data did not load'
        }
    );

    await browser.pause(1000); // Allow Angular to fully stabilize
    console.log('✓ Profile page loaded with user data');
});

When(/^the user updates their password$/, async () => {
    const currentPassword = testCredentials.getCurrentPassword();
    const newPassword = testCredentials.getNewPassword();

    console.log(`🔑 Updating password...`);

    // Scroll to password section
    const passwordSection = await $('[data-test="current-password"]').parentElement().parentElement();
    await passwordSection.scrollIntoView();
    await browser.pause(500);

    // Fill current password
    const currentPwdEl = await $('[data-test="current-password"]');
    await currentPwdEl.click();
    await browser.pause(200);
    await browser.keys(['Control', 'a']);
    await browser.keys('Backspace');
    await currentPwdEl.addValue(currentPassword);
    await browser.pause(200);

    // Fill new password  
    const newPwdEl = await $('[data-test="new-password"]');
    await newPwdEl.click();
    await browser.pause(200);
    await browser.keys(['Control', 'a']);
    await browser.keys('Backspace');
    await newPwdEl.addValue(newPassword);
    await browser.pause(200);

    // Fill password confirmation
    const confirmPwdEl = await $('[data-test="new-password-confirm"]');
    await confirmPwdEl.click();
    await browser.pause(200);
    await browser.keys(['Control', 'a']);
    await browser.keys('Backspace');
    await confirmPwdEl.addValue(newPassword);
    await browser.pause(200);

    // Click away to trigger validation
    await browser.keys('Tab');
    await browser.pause(500);

    console.log('✓ Password fields filled');
});

When(/^clicks the Change Password button$/, async () => {
    const submitBtn = await $('[data-test="change-password-submit"]');
    await submitBtn.scrollIntoView();
    await submitBtn.waitForClickable({ timeout: 5000 });
    await submitBtn.click();

    console.log('✓ Change Password button clicked');

    // Wait a moment for submission to process
    await browser.pause(2000);
});


/* ============================
    PRODUCTS
============================ */
Given(/^the user is on the Home page$/, async () => {
    await browser.url('https://practicesoftwaretesting.com/');
    await browser.pause(2000); // Allow page to load

    // Verify we're on the home page
    await expect(browser).toHaveUrl('https://practicesoftwaretesting.com/');
});

When(/^the user clicks on a specific product name or image$/, async () => {
    // Wait for product cards
    await browser.waitUntil(
        async () => (await $$('[data-test^="product-"]')).length > 0,
        { timeout: 10000, timeoutMsg: 'No products found' }
    );

    // Click the first product
    const productCards = await $$('[data-test^="product-"]');
    const firstProduct = productCards[0];

    await firstProduct.scrollIntoView();
    await firstProduct.waitForClickable({ timeout: 5000 });
    await firstProduct.click();

    // Wait for navigation
    await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/product/'),
        { timeout: 8000, timeoutMsg: 'Did not navigate to product details page' }
    );
});


/* ============================
   CART
============================ */
Given(/^the user is on a Product Details page$/, async () => {
    await browser.url('https://practicesoftwaretesting.com/');

    await browser.waitUntil(
        async () => (await $$('[data-test^="product-"]')).length > 0,
        { timeout: 10000, timeoutMsg: 'No products found on home page' }
    );

    const products = await $$('[data-test^="product-"]');

    await products[0].scrollIntoView();
    await products[0].click();

    await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/product/'),
        { timeout: 8000, timeoutMsg: 'Did not navigate to product detail page' }
    );

    await $('[data-test="product-name"]').waitForDisplayed({ timeout: 10000 });
});

When(/^the user clicks Add to cart button$/, async () => {
    const cartBtn = await $('[data-test="add-to-cart"]');
    await cartBtn.waitForClickable({ timeout: 5000 });
    await cartBtn.click();
});


/* ============================
   FAVORITES
============================ */
Given(/^the user is logged in$/, async () => {
    // Actually perform login, not just navigate to login page
    const creds = testCredentials.getExistingUserCredentials();

    await browser.url('https://practicesoftwaretesting.com/auth/login');

    // Fill login form
    await fill('[data-test="email"]', creds.email);
    await fill('[data-test="password"]', testCredentials.getCurrentPassword());

    // Click login button
    await $('[data-test="login-submit"]').click();

    // Wait for successful login (redirect to account page)
    await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/account'),
        { timeout: 8000, timeoutMsg: 'Login failed - did not redirect to account page' }
    );

    console.log('✓ User logged in successfully');
});

Given(/^is in the Product Details page$/, async () => {
    await browser.url('https://practicesoftwaretesting.com/');

    await browser.waitUntil(
        async () => (await $$('[data-test^="product-"]')).length > 0,
        { timeout: 10000, timeoutMsg: 'No products found on home page' }
    );

    const products = await $$('[data-test^="product-"]');

    await products[0].scrollIntoView();
    await products[0].click();

    await browser.waitUntil(
        async () => (await browser.getUrl()).includes('/product/'),
        { timeout: 8000, timeoutMsg: 'Did not navigate to product detail page' }
    );

    await $('[data-test="product-name"]').waitForDisplayed({ timeout: 10000 });
    console.log('✓ On product details page');
});

When(/^the user clicks the Add to Favourites button$/, async () => {
    const favBtn = await $('[data-test="add-to-favorites"]');
    await favBtn.scrollIntoView();
    await favBtn.waitForClickable({ timeout: 5000 });
    await favBtn.click();

    console.log('✓ Add to Favorites button clicked');
    await browser.pause(1000);
});

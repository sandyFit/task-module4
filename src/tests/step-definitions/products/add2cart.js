import { Given, When, Then } from '@wdio/cucumber-framework';
import { ProductDetailsPage } from '../../../business/pages/products/product-details.page.js';
import { HeaderComponent } from '../../../business/components/common/header.component.js';

const productPage = new ProductDetailsPage();
const header = new HeaderComponent();

Given(/^the user is on a Product Details page$/, async () => {
    await productPage.open();
});

When(/^the user clicks Add to cart button$/, async () => {
    await productPage.addToCart();
});

Then(/^the product should be added to the cart list$/, async () => {
    await header.cartQuantity.waitForDisplayed();
    expect(await header.cartQuantity.getText()).toBe('1');
});

Then(/^a successful message should appear$/, async () => {
    const msg = await $('//*[contains(text(),"shopping cart")]');
    await msg.waitForDisplayed();
});

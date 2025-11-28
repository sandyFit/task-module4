import * as chai from 'chai';
const assert = chai.assert;
const expect = chai.expect;
chai.should();

export async function assertProductDetailsPageUrl() {
    const url = await browser.getUrl();
    expect(url).to.contain('/product/');
}

export async function shouldProductUrlContainProduct() {
    const url = await browser.getUrl();
    url.should.contain('/product/');
}

export async function assertProductHasName() {
    const name = await $('[data-test="product-name"]');
    await name.waitForDisplayed();
    const text = await name.getText();
    assert.isAbove(text.length, 0, "Product name should not be empty");
}

export async function assertProductHasPrice() {
    const price = await $('[data-test="unit-price"]');
    assert.isTrue(await price.isDisplayed(), "Price is not displayed");
}

export async function assertProductHasDescription() {
    const desc = await $('[data-test="product-description"]');
    assert.isTrue(await desc.isDisplayed(), "Description is not visible");
}

export async function productShouldHaveDescription() {
    const desc = await $('[data-test="product-description"]');
    await desc.waitForDisplayed();

    const text = await desc.getText();
    text.should.have.length.of.at.least(1);
}


export async function assertProductHasCategory() {
    const category = await $('span[aria-label="category"]');
    expect(await category.isDisplayed()).to.be.true;
}

export async function assertProductHasCO2Rating() {
    const co2 = await $('[data-test="co2-rating-badge"]');
    expect(await co2.isDisplayed()).to.be.true;
}

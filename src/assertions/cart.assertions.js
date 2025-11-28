import * as chai from 'chai';

const assert = chai.assert;
const expect = chai.expect;
chai.should();

export async function assertCartQuantityIsOne() {
    const qty = await $('[data-test="cart-quantity"]');
    await qty.waitForDisplayed({ timeout: 5000 });

    const qtyText = await qty.getText();

    assert.equal(
        qtyText,
        '1',
        `ASSERT: Expected cart quantity to be "1" but got "${qtyText}"`
    );
}

export async function expectCartQuantityOne() {
    const qtyText = await $('[data-test="cart-quantity"]').getText();
    expect(qtyText).to.equal('1');
}

export async function shouldCartQuantityBeOne() {
    const qtyText = await $('[data-test="cart-quantity"]').getText();
    qtyText.should.equal('1');
}

export async function expectSuccessMessageDisplayed() {
    const msg = await $('//*[contains(text(),"shopping cart")]');
    await msg.waitForDisplayed({ timeout: 5000 });

    expect(await msg.isDisplayed()).to.be.true;
}


export async function shouldSuccessMessageContainText() {
    const msg = await $('//*[contains(text(),"shopping cart")]');
    await msg.waitForDisplayed({ timeout: 5000 });

    const msgText = await msg.getText();
    msgText.should.contain("shopping cart");
}

import * as chai from 'chai';

const assert = chai.assert;
const expect = chai.expect;
chai.should();

/* ============================================================
   1️⃣ Assert that the UI switched to Spanish
   ============================================================ */
export async function assertSpanishInterface() {
    const homeLink = await $('a.nav-link=Inicio');
    await homeLink.waitForDisplayed({ timeout: 8000 });

    // ASSERT interface
    assert.isTrue(
        await homeLink.isDisplayed(),
        "ASSERT: Home link 'Inicio' should be visible but is not"
    );

    const searchBtn = await $('[data-test="search-submit"]');
    const text = await searchBtn.getText();

    // SHOULD interface
    text.toLowerCase().should.contain(
        "buscar",
        "SHOULD: Search button text should contain 'Buscar'"
    );

    // EXPECT interface
    expect(text.toLowerCase()).to.contain("buscar");
}

/* ============================================================
   2️⃣ Assert that product names were NOT translated
   ============================================================ */
export async function assertProductNamesUntranslated() {
    const items = await $$('[data-test="product-name"]');

    // ASSERT interface
    assert.isAbove(
        items.length,
        0,
        "ASSERT: No product names found, but expected at least one"
    );

    const forbidden = ["martillo", "alicates", "destornillador", "tenazas"];

    for (const item of items) {
        const name = (await item.getText()).toLowerCase();

        forbidden.forEach(word => {
            // SHOULD interface
            name.should.not.contain(
                word,
                `SHOULD: Product name should NOT contain Spanish word '${word}'`
            );

            // EXPECT interface
            expect(name).not.to.contain(word);
        });
    }
}

/* ============================================================
   3️⃣ Assert that all visible UI text should appear in Spanish
   ============================================================ */
export async function assertLanguageChangedToSpanish() {
    const homeLink = await $('a.nav-link=Inicio');
    assert.isTrue(await homeLink.isDisplayed(), 'Home link should be in Spanish');

    const searchButtonText = await $('[data-test="search-submit"]').getText();
    assert.include(searchButtonText.toLowerCase(), 'buscar', 'Search button should be translated');

    // Validate other translated labels
    const bodyText = (await $('body').getText()).toLowerCase();
    assert.include(bodyText, 'categorías', 'Page should contain Spanish labels');
}

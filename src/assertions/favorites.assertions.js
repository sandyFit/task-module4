import * as chai from 'chai';

const assert = chai.assert;
const expect = chai.expect;
chai.should();

/* ------------------------------------------------------
   ASSERT — verify success message appeared
------------------------------------------------------ */
export async function assertFavoriteSuccessMessage() {
    const successFound = await browser.waitUntil(async () => {
        const elements = await $$('*');
        for (const el of elements) {
            try {
                const text = (await el.getText()).toLowerCase();
                if (
                    text.includes("product added to your favorites") ||
                    text.includes("added to favorites") ||
                    text.includes("added to favourite")
                ) {
                    return true;
                }
            } catch (_) { }
        }
        return false;
    }, {
        timeout: 8000,
        timeoutMsg: 'ASSERT: Expected a success message but none appeared'
    });

    assert.isTrue(successFound, "ASSERT: Favorite success message was not found");
}

/* ------------------------------------------------------
   EXPECT — verify at least one favorite item appears
------------------------------------------------------ */
export async function expectFavoritesListNotEmpty() {
    const possibleSelectors = [
        '[data-test^="product-"]',
        '.card',
        '[data-test="product"]',
        '.product-card',
        '[class*="product"]'
    ];

    let favItems = [];
    for (const selector of possibleSelectors) {
        favItems = await $$(selector);
        if (favItems.length > 0) break;
    }

    expect(favItems.length).to.be.greaterThan(
        0,
        "EXPECT: Favorites list should contain at least one product"
    );
}

/* ------------------------------------------------------
   SHOULD — verify URL contains the favorites path
------------------------------------------------------ */
export async function shouldBeOnFavoritesPage() {
    const url = await browser.getUrl();
    url.should.contain.oneOf(
        ['/favorites', '/favourites'],
        "SHOULD: URL should contain favorites page path"
    );
}


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
        interval: 500,
        timeoutMsg: 'ASSERT: Expected favorite success message but none appeared'
    });

    assert.isTrue(successFound, "ASSERT: Favorite success message was not found");
}

/* ------------------------------------------------------
   SHOULD — verify URL contains favorites path
------------------------------------------------------ */
export async function shouldBeOnFavoritesPage() {
    const url = await browser.getUrl();
    const isOnFavorites = ['/favorites', '/favourites'].some(path => url.includes(path));
    assert.isTrue(isOnFavorites, "SHOULD: URL should contain favorites page path");
}

/* ------------------------------------------------------
   EXPECT — verify favorites list is not empty
------------------------------------------------------ */
export async function expectFavoritesListNotEmpty() {
    // Wait until at least one favorite card appears
    const favItems = await browser.waitUntil(
        async () => {
            const items = await $$('[data-test^="favorite-"]');
            return items.length > 0 ? items : false; // return items array if found
        },
        {
            timeout: 10000,
            interval: 500,
            timeoutMsg: 'No favorite products found on the page after waiting'
        }
    );

    console.log('Number of favorite items found:', favItems.length);

    expect(favItems.length, "EXPECT: Favorites list should contain at least one product")
        .to.be.greaterThan(0);
}


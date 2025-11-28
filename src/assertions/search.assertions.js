import * as chai from 'chai';

const assert = chai.assert;
const expect = chai.expect;
chai.should();

/* ------------------------------------------------------
   ASSERT — verify search caption matches the query
------------------------------------------------------ */
export async function assertSearchCaptionShows(query) {
    const captionEl = await $('[data-test="search-caption"]');
    await captionEl.waitForDisplayed({ timeout: 10000 });

    const caption = (await captionEl.getText()).toLowerCase();

    assert.include(
        caption,
        query.toLowerCase(),
        `ASSERT: Expected search caption to include "${query}", but got "${caption}"`
    );
}

/* ------------------------------------------------------
   EXPECT — verify product card names match the query
------------------------------------------------------ */
export async function expectAllSearchResultsMatch(query) {
    const resultsContainer = await $('[data-test="search_completed"]');
    await resultsContainer.waitForDisplayed({ timeout: 10000 });

    const cards = await resultsContainer.$$('.card');

    expect(cards.length).to.be.greaterThan(
        0,
        "EXPECT: Expected at least 1 search result, but got none"
    );

    for (const card of cards) {
        await card.waitForDisplayed({ timeout: 5000 });

        const nameEl = await card.$('[data-test="product-name"]');
        const name = (await nameEl.getText()).toLowerCase();

        expect(name).to.contain(
            query.toLowerCase(),
            `EXPECT: Product name "${name}" does not include "${query}"`
        );
    }
}

/* ------------------------------------------------------
   SHOULD — verify all product names contain the query
------------------------------------------------------ */
export async function shouldEachProductNameContain(query) {
    const cards = await $$('.card');

    cards.length.should.be.above(0);

    for (const card of cards) {
        const nameEl = await card.$('[data-test="product-name"]');
        const name = (await nameEl.getText()).toLowerCase();

        name.should.contain(
            query.toLowerCase(),
            `SHOULD: Product name "${name}" should contain "${query}"`
        );
    }
}

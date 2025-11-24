import { Then } from '@wdio/cucumber-framework';

Then(/^all interface text should appear in Spanish$/, async () => {
    const homeLink = await $('a.nav-link=Inicio');
    await expect(homeLink).toBeDisplayed();

    const searchBtn = await $('[data-test="search-submit"]');
    await expect(await searchBtn.getText()).toContain('Buscar');
});


Then(/^product names should remain in their original language$/, async () => {
    const productNames = await $$('[data-test="product-name"]');

    for (const product of productNames) {
        const text = (await product.getText()).toLowerCase();

        // Spanish words that should NOT appear
        const forbidden = ['martillo', 'alicates', 'destornillador', 'tenazas'];

        for (const word of forbidden) {
            expect(text).not.toContain(word);
        }
    }
});

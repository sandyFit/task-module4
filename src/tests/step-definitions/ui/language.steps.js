import { Given, When, Then } from '@wdio/cucumber-framework';
import { HomePage } from '../../../business/pages/home/home.page.js';
import { HeaderComponent } from '../../../business/components/common/header.component.js';
import 'chai/register-should.js';

const homePage = new HomePage();
const header = new HeaderComponent();

Given(/^the user starts on the Home page$/, async () => {
    await homePage.open();
    await header.waitForLoaded();
});

When(/^the user changes the site language to Spanish \(ES\)$/, async () => {
    await header.selectSpanish();
});

Then(/^all interface text should appear in Spanish$/, async () => {
    await header.waitForSpanish();
});


Then(/^product names should remain in their original language$/, async () => {

    // Wait until product list is fully re-rendered
    await browser.waitUntil(async () => {
        const items = await $$('[data-test="product-name"]');
        return items.length > 0;
    }, {
        timeout: 8000,
        timeoutMsg: 'Product names did not reappear after language switch'
    });

    // Select only REAL product name elements (not entire cards)
    const nameElements = await $$('[data-test="product-name"]');

    const forbiddenSpanishWords = [
        "martillo", "alicates", "destornillador", "tenazas"
    ];

    for (const nameEl of nameElements) {
        const name = (await nameEl.getText()).toLowerCase();

        forbiddenSpanishWords.forEach(word => {
            name.should.not.contain(word);
        });
    }
});




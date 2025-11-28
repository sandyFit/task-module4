import { Given, When, Then } from '@wdio/cucumber-framework';
import { navigateToHome } from '../helpers/navigation.js';
import {
    assertSpanishInterface,
    assertProductNamesUntranslated,
    assertLanguageChangedToSpanish
} from '../assertions/language.assertions.js';

Given(/^the user starts on the Home page$/, async () => {
    await navigateToHome();
});

When(/^the user changes the site language to Spanish \(ES\)$/, async () => {

    const langButton = await $('[data-test="language-select"]');

    await langButton.waitForDisplayed({ timeout: 10000 });
    await langButton.waitForClickable({ timeout: 10000 });

    await langButton.click();

    const spanishOption = await $('[data-test="lang-es"]');
    await spanishOption.waitForDisplayed();
    await spanishOption.click();
});

Then(/^all interface text should appear in Spanish$/, async () => {
    await assertSpanishInterface();
    await assertLanguageChangedToSpanish();
});


Then(/^product names should remain in their original language$/, async () => {
    await assertProductNamesUntranslated();
});


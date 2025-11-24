import { Given, When } from '@wdio/cucumber-framework';
import { navigateToHome } from '../helpers/navigation.js';

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



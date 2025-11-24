export async function fill(selector, value) {
    const el = await $(selector);

    await el.waitForDisplayed({ timeout: 5000 });
    await el.scrollIntoView();
    await el.click();

    await browser.keys(['Control', 'a']);
    await browser.keys('Backspace');

    await el.addValue(value);
}

export async function clearAndType(selector, value) {
    const el = await $(selector);
    await el.waitForDisplayed();
    await el.click();

    await browser.keys(['Control', 'a']);
    await browser.keys('Backspace');

    await el.addValue(value);
}

// Helper to wait for Angular to stabilize
export async function waitForAngular() {
    await browser.execute(() => {
        return new Promise((resolve) => {
            if (window.getAllAngularTestabilities) {
                const testabilities = window.getAllAngularTestabilities();
                let count = testabilities.length;
                if (count === 0) {
                    resolve();
                    return;
                }
                testabilities.forEach((testability) => {
                    testability.whenStable(() => {
                        count--;
                        if (count === 0) {
                            resolve();
                        }
                    });
                });
            } else {
                resolve();
            }
        });
    });
    await browser.pause(500); 
}

export async function fillPasswordFieldWithAngular(selector, value, fieldName) {
    const field = await $(selector);
    await field.waitForDisplayed({ timeout: 5000 });

    // Wait for Angular to be stable before interacting
    await waitForAngular();

    await field.click();
    await browser.pause(200);

    await field.clearValue();
    await browser.pause(200);

    // human-like typing
    for (const char of value) {
        await field.addValue(char);
        await browser.pause(20);
    }

    await browser.pause(200);

    // Trigger Angular events
    await browser.execute((sel) => {
        const element = document.querySelector(sel);
        if (element) {
            // Trigger all relevant events for Angular forms
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.focus();
            element.blur();
            element.dispatchEvent(new Event('blur', { bubbles: true }));
        }
    }, selector);

    await waitForAngular();

    const actualValue = await field.getValue();
    if (actualValue !== value) {
        throw new Error(`${fieldName} mismatch. Expected: ${value}, Got: ${actualValue}`);
    }
}

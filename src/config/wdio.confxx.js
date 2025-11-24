import path from 'path';

export const config = {
    runner: 'local',

    specs: [
        path.resolve('./src/features/**/signup.feature'),
        path.resolve('./src/features/**/login.feature'),
        path.resolve('./src/features/**/profile.feature'),
        path.resolve('./src/features/**/product-details.feature'),
        path.resolve('./src/features/**/cart-operations.feature'),
        path.resolve('./src/features/**/favorites.feature'),
        path.resolve('./src/features/**/search.feature'),
        path.resolve('./src/features/**/language.feature')
    ],


    cucumberOpts: {
        require: [
            path.resolve('./src/steps/**/*.js'),
            path.resolve('./src/assertions/**/*.js'),

        ],
        timeout: 60000
    },

    maxInstances: 1,

    capabilities: [
        {
            browserName: 'chrome'
        }
    ],

    logLevel: 'info',

    waitforTimeout: 10000,

    framework: 'cucumber',

    reporters: ['spec'],
};

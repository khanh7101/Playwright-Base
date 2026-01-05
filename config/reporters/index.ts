export const reporters = [
    ['list', { printSteps: true }],
    ['html', { open: 'never' }],
    // ['junit', { outputFile: 'junit/results.xml' }],
    [
        'allure-playwright',
        {
            detail: true,
            outputFolder: 'allure-results',
            suiteTitle: true,
            environmentInfo: {
                'Node Version': process.version,
                'Test Environment': process.env.TEST_ENV || 'dev',
                'Base URL': process.env.BASE_URL || 'N/A',
                'CI Platform': process.env.CI_PLATFORM || (process.env.CI ? 'CI' : 'local'),
                'Browsers': process.env.BROWSERS || 'chromium',
            },
        },
    ],
];

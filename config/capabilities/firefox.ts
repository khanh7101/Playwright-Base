import { devices } from '@playwright/test';

/**
 * Firefox Browser Capability
 * Desktop Firefox configuration
 */
export const firefoxCapability = {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
};

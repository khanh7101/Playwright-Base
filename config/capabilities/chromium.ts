import { devices } from '@playwright/test';

/**
 * Chromium Browser Capability
 * Desktop Chrome configuration
 */
export const chromiumCapability = {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
};

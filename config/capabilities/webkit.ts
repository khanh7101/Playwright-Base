import { devices } from '@playwright/test';

/**
 * WebKit Browser Capability
 * Desktop Safari configuration
 */
export const webkitCapability = {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
};

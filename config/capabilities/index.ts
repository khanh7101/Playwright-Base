import { chromiumCapability } from './chromium';
import { firefoxCapability } from './firefox';
import { webkitCapability } from './webkit';

/**
 * Browser Capabilities
 * Export all browser configurations
 */
export { chromiumCapability } from './chromium';
export { firefoxCapability } from './firefox';
export { webkitCapability } from './webkit';

/**
 * Default browsers to run tests on
 * Modify this array to change which browsers are used by default
 */
export const defaultBrowsers = [
    chromiumCapability,
    firefoxCapability,
    webkitCapability,
];

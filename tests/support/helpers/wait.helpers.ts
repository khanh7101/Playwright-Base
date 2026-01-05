import { Page } from '@playwright/test';

/**
 * Wait Helpers
 * Utility functions for waiting and timing
 */

/**
 * Wait for a specific timeout
 * @param page Playwright Page object
 * @param time Time in milliseconds
 */
export async function waitForTimeout(page: Page, time: number): Promise<void> {
    await page.waitForTimeout(time);
}

/**
 * Wait for network to be idle
 * @param page Playwright Page object
 * @param timeout Maximum time to wait (default: 30000ms)
 */
export async function waitForNetworkIdle(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Wait for DOM to be ready
 * @param page Playwright Page object
 * @param timeout Maximum time to wait (default: 30000ms)
 */
export async function waitForDOMReady(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForLoadState('domcontentloaded', { timeout });
}

/**
 * Wait for element to be visible
 * @param page Playwright Page object
 * @param selector CSS selector
 * @param timeout Maximum time to wait (default: 30000ms)
 */
export async function waitForVisible(
    page: Page,
    selector: string,
    timeout: number = 30000
): Promise<void> {
    await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Wait for element to be hidden
 * @param page Playwright Page object
 * @param selector CSS selector
 * @param timeout Maximum time to wait (default: 30000ms)
 */
export async function waitForHidden(
    page: Page,
    selector: string,
    timeout: number = 30000
): Promise<void> {
    await page.waitForSelector(selector, { state: 'hidden', timeout });
}

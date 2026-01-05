import { Page, Locator } from '@playwright/test';

/**
 * Base Page Class
 * All page objects should extend this class
 */
export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to a URL
     * @param path URL path to navigate to
     */
    async goto(path: string = '/') {
        const baseUrl = process.env.BASE_URL || '';
        const fullUrl = path.startsWith('http') ? path : `${baseUrl}${path}`;
        await this.page.goto(fullUrl);
    }

    /**
     * Wait for a specific timeout
     * @param time Time in ms
     */
    async wait(time: number) {
        await this.page.waitForTimeout(time);
    }

    /**
     * Get Locator by selector
     * @param selector
     */
    locator(selector: string): Locator {
        return this.page.locator(selector);
    }
}

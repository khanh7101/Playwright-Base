import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base/base.page';

export class HomePage extends BasePage {
    readonly getStartedLink: Locator;
    readonly heading: Locator;

    constructor(page: Page) {
        super(page);
        this.getStartedLink = page.getByRole('link', { name: 'Get started' });
        this.heading = page.getByRole('heading', { name: 'Installation' });
    }

    async goto() {
        await super.goto('/');
    }

    async clickGetStarted() {
        await this.getStartedLink.click();
    }

    async assertHeadingVisible() {
        await expect(this.heading).toBeVisible();
    }
}

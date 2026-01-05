import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base.page';

/**
 * Passion Dental Homepage Page Object
 */
export class PassionDentalHomePage extends BasePage {
    // Locators
    readonly languageToggle: Locator;
    readonly vietnameseFlag: Locator;
    readonly englishFlag: Locator;
    readonly logo: Locator;
    readonly bookingButton: Locator;
    readonly mainHeading: Locator;

    constructor(page: Page) {
        super(page);

        // Language switcher - based on actual website HTML
        this.languageToggle = page.locator('button[aria-label*="Switch"]');
        this.vietnameseFlag = page.locator('button[aria-label="Switch to Vietnamese"], button[title="Vietnamese"]');
        this.englishFlag = page.locator('button[aria-label="Switch to English"], button[title="English"]');

        // Main elements
        this.logo = page.locator('img[alt*="Passion"], .logo, header img').first();
        this.bookingButton = page.locator('a:has-text("Đặt lịch"), a:has-text("Booking"), button:has-text("Đặt lịch")').first();
        this.mainHeading = page.locator('h1, h2').first();
    }

    /**
     * Navigate to homepage
     */
    async goto() {
        await super.goto('/vi');
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Switch to Vietnamese language
     */
    async switchToVietnamese() {
        await this.vietnameseFlag.click();
        await this.page.waitForLoadState('networkidle');
        // Wait for URL to contain /vi
        await this.page.waitForURL(/.*\/vi.*/);
    }

    /**
     * Switch to English language
     */
    async switchToEnglish() {
        await this.englishFlag.click();
        await this.page.waitForLoadState('networkidle');
        // Wait for URL to contain /en
        await this.page.waitForURL(/.*\/en.*/);
    }

    /**
     * Get current language from URL
     */
    getCurrentLanguage(): string {
        const url = this.page.url();
        if (url.includes('/vi')) return 'vi';
        if (url.includes('/en')) return 'en';
        return 'unknown';
    }

    /**
     * Click booking button
     */
    async clickBooking() {
        await this.bookingButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Verify homepage is loaded
     */
    async verifyPageLoaded() {
        await this.logo.waitFor({ state: 'visible' });
        await this.mainHeading.waitFor({ state: 'visible' });
    }
}

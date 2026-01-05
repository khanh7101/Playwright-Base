import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base.page';

/**
 * Passion Dental Booking Page Object
 */
export class PassionDentalBookingPage extends BasePage {
    // Locators
    readonly pageTitle: Locator;
    readonly nameInput: Locator;
    readonly phoneInput: Locator;
    readonly emailInput: Locator;
    readonly dateInput: Locator;
    readonly serviceSelect: Locator;
    readonly submitButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        super(page);

        // Form elements (adjust selectors based on actual website)
        this.pageTitle = page.locator('h1, h2').first();
        this.nameInput = page.locator('input[name*="name"], input[placeholder*="Tên"], input[placeholder*="Name"]');
        this.phoneInput = page.locator('input[name*="phone"], input[type="tel"], input[placeholder*="Số điện thoại"]');
        this.emailInput = page.locator('input[name*="email"], input[type="email"]');
        this.dateInput = page.locator('input[type="date"], input[name*="date"]');
        this.serviceSelect = page.locator('select[name*="service"], select[name*="dịch vụ"]');
        this.submitButton = page.locator('button[type="submit"], button:has-text("Đặt lịch"), button:has-text("Submit")');
        this.successMessage = page.locator('.success, .alert-success, [class*="success"]');
    }

    /**
     * Navigate to booking page
     */
    async goto() {
        await super.goto('/booking');
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Fill booking form
     */
    async fillBookingForm(data: {
        name: string;
        phone: string;
        email: string;
        date?: string;
        service?: string;
    }) {
        if (await this.nameInput.isVisible()) {
            await this.nameInput.fill(data.name);
        }

        if (await this.phoneInput.isVisible()) {
            await this.phoneInput.fill(data.phone);
        }

        if (await this.emailInput.isVisible()) {
            await this.emailInput.fill(data.email);
        }

        if (data.date && await this.dateInput.isVisible()) {
            await this.dateInput.fill(data.date);
        }

        if (data.service && await this.serviceSelect.isVisible()) {
            await this.serviceSelect.selectOption(data.service);
        }
    }

    /**
     * Submit booking form
     */
    async submitForm() {
        await this.submitButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Verify booking page is loaded
     */
    async verifyPageLoaded() {
        await this.pageTitle.waitFor({ state: 'visible' });
    }
}

import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { PassionDentalHomePage } from '../../../pages/passion-dental/home.page';

/**
 * Passion Dental - Language Switching Tests
 * Test chuyển đổi ngôn ngữ giữa Tiếng Việt và English
 */

test.describe('Passion Dental - Language Switching', () => {
    let homePage: PassionDentalHomePage;

    test.beforeEach(async ({ page }) => {
        // Setup Allure metadata
        await allure.epic('Passion Dental Website');
        await allure.feature('Language Switching');
        await allure.owner('KZu QA Team');

        // Initialize page object
        homePage = new PassionDentalHomePage(page);
    });

    test('should switch from Vietnamese to English and display correct content', async ({ page }) => {
        await allure.story('VI to EN Language Switch');
        await allure.severity('critical');
        await allure.tag('smoke');
        await allure.tag('language');
        await allure.description('Verify that user can switch from Vietnamese to English and content displays correctly');

        await test.step('Navigate to Vietnamese homepage', async () => {
            await homePage.goto();

            // Verify page loaded
            await homePage.verifyPageLoaded();

            // Take screenshot
            const screenshot = await page.screenshot();
            await allure.attachment('Vietnamese Homepage', screenshot, 'image/png');

            // Verify URL contains /vi
            expect(page.url()).toContain('/vi');
            await allure.parameter('Initial Language', 'Vietnamese');
        });

        await test.step('Switch to English language', async () => {
            // Get current language before switch
            const beforeLang = homePage.getCurrentLanguage();
            expect(beforeLang).toBe('vi');

            // Switch to English
            await homePage.switchToEnglish();

            // Wait a bit for content to update
            await page.waitForTimeout(1000);

            // Take screenshot after switch
            const screenshot = await page.screenshot();
            await allure.attachment('English Homepage', screenshot, 'image/png');
        });

        await test.step('Verify English language is active', async () => {
            // Verify URL contains /en
            const currentUrl = page.url();
            expect(currentUrl).toContain('/en');

            // Verify language changed
            const currentLang = homePage.getCurrentLanguage();
            expect(currentLang).toBe('en');

            await allure.parameter('Final Language', 'English');

            // Attach URL info
            await allure.attachment('Current URL', currentUrl, 'text/plain');
        });
    });

    test('should switch from English to Vietnamese and display correct content', async ({ page }) => {
        await allure.story('EN to VI Language Switch');
        await allure.severity('critical');
        await allure.tag('smoke');
        await allure.tag('language');
        await allure.description('Verify that user can switch from English to Vietnamese and content displays correctly');

        await test.step('Navigate to English homepage', async () => {
            // Navigate to English version
            await page.goto(process.env.BASE_URL!.replace('/vi', '/en'));
            await page.waitForLoadState('networkidle');

            // Verify page loaded
            await homePage.verifyPageLoaded();

            // Take screenshot
            const screenshot = await page.screenshot();
            await allure.attachment('English Homepage', screenshot, 'image/png');

            // Verify URL contains /en
            expect(page.url()).toContain('/en');
            await allure.parameter('Initial Language', 'English');
        });

        await test.step('Switch to Vietnamese language', async () => {
            // Get current language before switch
            const beforeLang = homePage.getCurrentLanguage();
            expect(beforeLang).toBe('en');

            // Switch to Vietnamese
            await homePage.switchToVietnamese();

            // Wait a bit for content to update
            await page.waitForTimeout(1000);

            // Take screenshot after switch
            const screenshot = await page.screenshot();
            await allure.attachment('Vietnamese Homepage', screenshot, 'image/png');
        });

        await test.step('Verify Vietnamese language is active', async () => {
            // Verify URL contains /vi
            const currentUrl = page.url();
            expect(currentUrl).toContain('/vi');

            // Verify language changed
            const currentLang = homePage.getCurrentLanguage();
            expect(currentLang).toBe('vi');

            await allure.parameter('Final Language', 'Vietnamese');

            // Attach URL info
            await allure.attachment('Current URL', currentUrl, 'text/plain');
        });
    });

    test('should maintain language preference across page navigation', async ({ page }) => {
        await allure.story('Language Persistence');
        await allure.severity('normal');
        await allure.tag('regression');
        await allure.tag('language');
        await allure.description('Verify that language preference is maintained when navigating to different pages');

        await test.step('Set language to English', async () => {
            await homePage.goto();
            await homePage.switchToEnglish();

            // Verify English is active
            expect(homePage.getCurrentLanguage()).toBe('en');
        });

        await test.step('Navigate to booking page', async () => {
            // Click booking button or navigate
            await page.goto(page.url().replace('/en', '/en/booking'));
            await page.waitForLoadState('networkidle');

            // Take screenshot
            const screenshot = await page.screenshot();
            await allure.attachment('Booking Page in English', screenshot, 'image/png');
        });

        await test.step('Verify language is still English', async () => {
            // Verify URL still contains /en
            const currentUrl = page.url();
            expect(currentUrl).toContain('/en');

            await allure.attachment('Booking Page URL', currentUrl, 'text/plain');
        });
    });
});

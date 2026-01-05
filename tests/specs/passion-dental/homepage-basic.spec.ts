import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

/**
 * Passion Dental - Basic Homepage Tests
 * Test cơ bản để verify website hoạt động
 */

test.describe('Passion Dental - Homepage Basic Tests', () => {

    test.beforeEach(async () => {
        await allure.epic('Passion Dental Website');
        await allure.feature('Homepage');
        await allure.owner('KZu QA Team');
    });

    test('should load homepage successfully', async ({ page }) => {
        await allure.story('Homepage Load');
        await allure.severity('blocker');
        await allure.tag('smoke');
        await allure.description('Verify that Passion Dental homepage loads successfully');

        await test.step('Navigate to homepage', async () => {
            const url = process.env.BASE_URL || 'https://www.passiondental.com.vn/vi';
            await page.goto(url);
            await page.waitForLoadState('networkidle');

            // Take screenshot
            const screenshot = await page.screenshot({ fullPage: true });
            await allure.attachment('Homepage Screenshot', screenshot, 'image/png');

            await allure.parameter('URL', url);
        });

        await test.step('Verify page loaded successfully', async () => {
            // Verify URL
            expect(page.url()).toContain('passiondental.com.vn');

            // Verify page title
            const title = await page.title();
            expect(title).toBeTruthy();
            await allure.parameter('Page Title', title);

            // Verify banner image is visible
            const banner = page.locator('img[alt="Banner"]').first();
            await expect(banner).toBeVisible();

            // Attach page info
            const pageInfo = {
                url: page.url(),
                title: await page.title(),
                timestamp: new Date().toISOString()
            };
            await allure.attachment('Page Info', JSON.stringify(pageInfo, null, 2), 'application/json');
        });
    });

    test('should have correct meta tags and SEO', async ({ page }) => {
        await allure.story('SEO Verification');
        await allure.severity('normal');
        await allure.tag('seo');
        await allure.description('Verify that homepage has correct meta tags for SEO');

        await test.step('Navigate to homepage', async () => {
            const url = process.env.BASE_URL || 'https://www.passiondental.com.vn/vi';
            await page.goto(url);
            await page.waitForLoadState('networkidle');
        });

        await test.step('Verify meta tags', async () => {
            // Get page title
            const title = await page.title();
            expect(title.length).toBeGreaterThan(0);

            // Get meta description
            const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
            if (metaDescription) {
                expect(metaDescription.length).toBeGreaterThan(0);
                await allure.parameter('Meta Description', metaDescription);
            }

            // Attach SEO info
            const seoInfo = {
                title: title,
                description: metaDescription || 'Not found',
                url: page.url()
            };
            await allure.attachment('SEO Info', JSON.stringify(seoInfo, null, 2), 'application/json');
        });
    });

    test('should display main sections on homepage', async ({ page }) => {
        await allure.story('Homepage Sections');
        await allure.severity('critical');
        await allure.tag('smoke');
        await allure.description('Verify that all main sections are displayed on homepage');

        await test.step('Navigate to homepage', async () => {
            const url = process.env.BASE_URL || 'https://www.passiondental.com.vn/vi';
            await page.goto(url);
            await page.waitForLoadState('networkidle');
        });

        await test.step('Verify banner section', async () => {
            const banner = page.locator('section.full-bleed').first();
            await expect(banner).toBeVisible();

            const bannerImage = page.locator('img[alt="Banner"]').first();
            await expect(bannerImage).toBeVisible();

            // Take screenshot of banner
            const screenshot = await banner.screenshot();
            await allure.attachment('Banner Section', screenshot, 'image/png');
        });

        await test.step('Verify page has content', async () => {
            // Check if page has any headings
            const headings = page.locator('h1, h2, h3');
            const headingCount = await headings.count();
            expect(headingCount).toBeGreaterThan(0);

            await allure.parameter('Number of Headings', headingCount.toString());

            // Check if page has any images
            const images = page.locator('img');
            const imageCount = await images.count();
            expect(imageCount).toBeGreaterThan(0);

            await allure.parameter('Number of Images', imageCount.toString());
        });
    });

    test('should be responsive on different viewports', async ({ page }) => {
        await allure.story('Responsive Design');
        await allure.severity('normal');
        await allure.tag('responsive');
        await allure.description('Verify that homepage is responsive on different screen sizes');

        const url = process.env.BASE_URL || 'https://www.passiondental.com.vn/vi';

        await test.step('Test on Desktop (1920x1080)', async () => {
            await page.setViewportSize({ width: 1920, height: 1080 });
            await page.goto(url);
            await page.waitForLoadState('networkidle');

            const screenshot = await page.screenshot({ fullPage: true });
            await allure.attachment('Desktop View (1920x1080)', screenshot, 'image/png');

            // Verify banner is visible
            const banner = page.locator('img[alt="Banner"]').first();
            await expect(banner).toBeVisible();
        });

        await test.step('Test on Tablet (768x1024)', async () => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto(url);
            await page.waitForLoadState('networkidle');

            const screenshot = await page.screenshot({ fullPage: true });
            await allure.attachment('Tablet View (768x1024)', screenshot, 'image/png');

            // Verify banner is visible
            const banner = page.locator('img[alt="Banner"]').first();
            await expect(banner).toBeVisible();
        });

        await test.step('Test on Mobile (375x667)', async () => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto(url);
            await page.waitForLoadState('networkidle');

            const screenshot = await page.screenshot({ fullPage: true });
            await allure.attachment('Mobile View (375x667)', screenshot, 'image/png');

            // Verify banner is visible
            const banner = page.locator('img[alt="Banner"]').first();
            await expect(banner).toBeVisible();
        });
    });
});

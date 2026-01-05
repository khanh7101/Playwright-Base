import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

/**
 * Example test demonstrating Allure annotations and features
 * This test shows how to use:
 * - Epic, Feature, Story organization
 * - Severity levels
 * - Tags for filtering
 * - Test steps
 * - Attachments (screenshots, logs, data)
 */

test.describe('Allure Features Demo', () => {
    test.beforeEach(async ({ page }) => {
        // Set Allure metadata for all tests in this suite
        await allure.epic('Example Tests');
        await allure.feature('Allure Integration');
    });

    test('should demonstrate basic Allure annotations', async ({ page }) => {
        // Test metadata
        await allure.story('Basic Annotations');
        await allure.severity('critical');
        await allure.tag('smoke');
        await allure.tag('demo');
        await allure.owner('QA Team');
        await allure.description('This test demonstrates basic Allure annotations including steps, attachments, and metadata');

        // Step 1: Navigate to page
        await test.step('Navigate to example website', async () => {
            await page.goto('https://example.com');

            // Attach screenshot
            const screenshot = await page.screenshot();
            await allure.attachment('Homepage Screenshot', screenshot, 'image/png');

            // Verify page loaded
            await expect(page).toHaveTitle(/Example Domain/);
        });

        // Step 2: Check page content
        await test.step('Verify page content', async () => {
            const heading = page.locator('h1');
            await expect(heading).toBeVisible();
            await expect(heading).toHaveText('Example Domain');

            // Attach text data
            const headingText = await heading.textContent();
            await allure.attachment('Heading Text', headingText || '', 'text/plain');
        });

        // Step 3: Check links
        await test.step('Verify links are present', async () => {
            const link = page.locator('a');
            await expect(link).toBeVisible();

            // Attach JSON data
            const linkInfo = {
                text: await link.textContent(),
                href: await link.getAttribute('href'),
                visible: await link.isVisible(),
            };
            await allure.attachment('Link Information', JSON.stringify(linkInfo, null, 2), 'application/json');
        });
    });

    test('should demonstrate test with parameters', async ({ page }) => {
        await allure.story('Parameterized Test');
        await allure.severity('normal');
        await allure.tag('regression');

        // Add parameters to report
        await allure.parameter('URL', 'https://example.com');
        await allure.parameter('Browser', 'chromium');
        await allure.parameter('Viewport', '1280x720');

        await test.step('Open page with parameters', async () => {
            await page.goto('https://example.com');
            await expect(page).toHaveURL('https://example.com/');
        });
    });

    test('should demonstrate different severity levels', async ({ page }) => {
        await allure.story('Severity Levels');
        await allure.severity('minor'); // blocker, critical, normal, minor, trivial
        await allure.tag('demo');

        await test.step('This is a minor severity test', async () => {
            await page.goto('https://example.com');
            await expect(page).toHaveTitle(/Example/);
        });
    });

    test.skip('should demonstrate skipped test', async ({ page }) => {
        await allure.story('Skipped Test');
        await allure.severity('normal');
        await allure.tag('wip');

        // This test will be skipped and shown in Allure report
        await page.goto('https://example.com');
    });
});

test.describe('Allure Attachments Demo', () => {
    test('should demonstrate various attachment types', async ({ page }) => {
        await allure.epic('Example Tests');
        await allure.feature('Attachments');
        await allure.story('Multiple Attachment Types');
        await allure.severity('normal');

        await test.step('Attach different file types', async () => {
            await page.goto('https://example.com');

            // Screenshot
            const screenshot = await page.screenshot({ fullPage: true });
            await allure.attachment('Full Page Screenshot', screenshot, 'image/png');

            // HTML content
            const htmlContent = await page.content();
            await allure.attachment('Page HTML', htmlContent, 'text/html');

            // JSON data
            const pageData = {
                url: page.url(),
                title: await page.title(),
                timestamp: new Date().toISOString(),
            };
            await allure.attachment('Page Data', JSON.stringify(pageData, null, 2), 'application/json');

            // Plain text
            await allure.attachment('Test Notes', 'This is a demo test showing various attachment types', 'text/plain');
        });
    });
});

test.describe('Allure Test Organization', () => {
    test('should demonstrate epic/feature/story hierarchy', async ({ page }) => {
        // Organize tests in hierarchy
        await allure.epic('User Management');
        await allure.feature('Authentication');
        await allure.story('Login Flow');
        await allure.severity('blocker');
        await allure.tag('smoke');
        await allure.tag('authentication');

        await test.step('User can access login page', async () => {
            await page.goto('https://example.com');
            await expect(page).toHaveURL(/example.com/);
        });
    });
});

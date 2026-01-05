import { test, expect } from '../../../fixtures';

/**
 * Example Test Spec
 * Demonstrates best practices for writing tests with the framework
 * 
 * Tags: Use @smoke, @regression, etc. for test categorization
 */

test.describe('Example Test Suite @smoke', () => {
    /**
     * Test: Basic navigation and interaction
     * Demonstrates:
     * - Using fixtures to inject page objects
     * - Separation of concerns (test logic vs page actions)
     * - Clear test structure with arrange-act-assert
     */
    test('should navigate to home page and verify content', async ({ homePage }) => {
        // Arrange: Navigate to the page
        await homePage.goto();

        // Act: Perform actions
        await homePage.clickGetStarted();

        // Assert: Verify expected outcomes
        await homePage.assertHeadingVisible();
    });

    /**
     * Test: Demonstrating test data usage
     * Shows how to use test data from fixtures
     */
    test('should demonstrate test data usage', async ({ page }) => {
        // Example: Using test data (you would import from test-data.ts)
        // const { testUsers } = await import('../../support/fixtures/test-data');

        // This is just an example structure
        await page.goto('/');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

/**
 * Another test suite to demonstrate organization
 */
test.describe('Another Feature @regression', () => {
    test('should demonstrate another feature', async ({ page }) => {
        // Your test logic here
        await page.goto('/');
        // Add your assertions
    });
});

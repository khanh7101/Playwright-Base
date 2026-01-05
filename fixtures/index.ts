import { test as base } from '@playwright/test';
import { HomePage } from '../pages/website/home.page';

// Declare the types of your fixtures.
type MyFixtures = {
    homePage: HomePage;
};

// Extend base test to include these fixtures.
export const test = base.extend<MyFixtures>({
    homePage: async ({ page }, use) => {
        // Set up the fixture.
        const homePage = new HomePage(page);
        await use(homePage);
    },
});

export { expect } from '@playwright/test';

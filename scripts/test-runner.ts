import { execSync } from 'child_process';
import { validateEnvironment } from './validate-env';
import { sendEmailReport } from './email-sender';
import { detectCIPlatform, getReportUrl, isCI } from './utils/ci-detector';
import { Logger } from './utils/logger';
import { retry } from './utils/retry';
import 'dotenv/config';

/**
 * Main test runner that orchestrates:
 * 1. Environment validation
 * 2. Test execution
 * 3. Report generation
 * 4. Email notification
 * 5. Cleanup
 */
async function main() {
    try {
        Logger.info('🚀 Starting Playwright test execution with Allure reporting...\n');

        // Step 1: Validate environment
        Logger.step('Step 1/5: Validating environment...');
        const isValid = await validateEnvironment();
        if (!isValid) {
            Logger.error('Environment validation failed. Please fix errors and try again.');
            process.exit(1);
        }
        console.log(''); // Empty line for readability

        // Step 2: Run Playwright tests
        Logger.step('Step 2/5: Running Playwright tests...');
        let testsFailed = false;
        try {
            execSync('npx playwright test', { stdio: 'inherit' });
            Logger.success('All tests passed! ✅');
        } catch (error) {
            testsFailed = true;
            Logger.warning('Some tests failed, but continuing to generate report...');
        }
        console.log('');

        // Step 3: Generate Allure report
        Logger.step('Step 3/5: Generating Allure report...');
        try {
            execSync('npm run allure:generate', { stdio: 'inherit' });
            Logger.success('Allure report generated successfully');
        } catch (error) {
            Logger.error('Failed to generate Allure report', error as Error);
            process.exit(1);
        }
        console.log('');

        // Step 4: Determine report URL
        Logger.step('Step 4/5: Determining report URL...');
        const platform = detectCIPlatform();
        const reportUrl = process.env.REPORT_URL || getReportUrl(platform);

        if (platform === 'local') {
            Logger.info(`Platform: Local development`);
            Logger.info(`Report URL: ${reportUrl}`);
            Logger.warning('Note: For local testing, you need to serve the report manually.');
            Logger.info('Run: npm run allure:open');
        } else {
            Logger.info(`Platform: ${platform.toUpperCase()}`);
            Logger.info(`Report URL: ${reportUrl}`);
        }
        console.log('');

        // Step 5: Send email notification
        Logger.step('Step 5/5: Sending email notification...');

        // Check if email is configured
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            Logger.warning('Email credentials not configured. Skipping email notification.');
            Logger.info('To enable emails, set GMAIL_USER and GMAIL_APP_PASSWORD in .env');
        } else {
            try {
                await retry(
                    () => sendEmailReport(reportUrl),
                    {
                        maxAttempts: 3,
                        delayMs: 2000,
                        onRetry: (attempt, error) => {
                            Logger.warning(`Email sending failed (attempt ${attempt}/3). Retrying...`);
                            Logger.debug(error.message);
                        },
                    }
                );
            } catch (error) {
                Logger.error('Failed to send email after 3 attempts', error as Error);
                Logger.warning('Continuing anyway...');
            }
        }
        console.log('');

        // Final summary
        Logger.success('🎉 Test execution completed!');
        Logger.info(`Report available at: ${reportUrl}`);

        if (platform === 'local') {
            Logger.info('\n💡 To view the report locally, run: npm run allure:open');
        }

        // Exit with appropriate code
        if (testsFailed) {
            Logger.warning('\n⚠️  Some tests failed. Check the report for details.');
            process.exit(1);
        } else {
            process.exit(0);
        }

    } catch (error) {
        Logger.error('\n❌ Test runner failed:', error as Error);
        process.exit(1);
    }
}

// Run main function
main();

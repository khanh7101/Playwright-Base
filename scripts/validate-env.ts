import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './utils/logger';
import 'dotenv/config';

/**
 * Validate environment configuration before running tests
 */
export async function validateEnvironment(): Promise<boolean> {
    let isValid = true;

    Logger.step('Validating environment configuration...');

    // Check .env file exists
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
        Logger.warning('.env file not found. Using .env.example as reference.');
        Logger.info('Run: cp .env.example .env');
    }

    // Check required env vars for email
    const emailVars = ['GMAIL_USER', 'GMAIL_APP_PASSWORD'];
    for (const varName of emailVars) {
        if (!process.env[varName]) {
            Logger.error(`Missing required environment variable: ${varName}`);
            Logger.info(`Please set ${varName} in your .env file`);
            isValid = false;
        }
    }

    // Check Allure CLI installed
    try {
        const { execSync } = require('child_process');
        execSync('allure --version', { stdio: 'pipe' });
        Logger.success('Allure CLI is installed');
    } catch (error) {
        Logger.error('Allure CLI not found.');
        Logger.info('Install with: npm install');
        isValid = false;
    }

    // Validate Gmail credentials format
    const gmailUser = process.env.GMAIL_USER;
    if (gmailUser && !gmailUser.includes('@')) {
        Logger.error('GMAIL_USER must be a valid email address');
        isValid = false;
    }

    const gmailPassword = process.env.GMAIL_APP_PASSWORD;
    if (gmailPassword && gmailPassword.length !== 16) {
        Logger.warning('GMAIL_APP_PASSWORD should be 16 characters (App Password format)');
        Logger.info('Get App Password at: https://myaccount.google.com/apppasswords');
    }

    // Check BASE_URL is valid
    const baseUrl = process.env.BASE_URL;
    if (baseUrl && !baseUrl.startsWith('http')) {
        Logger.error('BASE_URL must start with http:// or https://');
        isValid = false;
    }

    // Check email recipients
    const recipientsPassed = process.env.EMAIL_RECIPIENTS_PASSED;
    const recipientsFailed = process.env.EMAIL_RECIPIENTS_FAILED;

    if (!recipientsPassed && !recipientsFailed) {
        Logger.warning('No email recipients configured (EMAIL_RECIPIENTS_PASSED or EMAIL_RECIPIENTS_FAILED)');
        Logger.info('Emails will not be sent');
    }

    if (isValid) {
        Logger.success('Environment validation passed ✅');
    } else {
        Logger.error('Environment validation failed ❌');
        Logger.info('Please fix the errors above and try again');
    }

    return isValid;
}

// Run validation if called directly
if (require.main === module) {
    validateEnvironment().then(isValid => {
        process.exit(isValid ? 0 : 1);
    });
}

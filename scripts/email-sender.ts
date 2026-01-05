import * as nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import * as path from 'path';
import * as fs from 'fs';
import 'dotenv/config';
import { Logger } from './utils/logger';

interface TestSummary {
    statistic: {
        total: number;
        passed: number;
        failed: number;
        broken: number;
        skipped: number;
        unknown: number;
    };
}

/**
 * Send email report with Allure test results
 */
export async function sendEmailReport(reportUrl: string): Promise<void> {
    Logger.step('Preparing email report...');

    // Parse Allure summary.json
    const summaryPath = path.join(process.cwd(), 'allure-report/widgets/summary.json');

    if (!fs.existsSync(summaryPath)) {
        throw new Error(`Summary file not found at: ${summaryPath}`);
    }

    const data: TestSummary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));

    const { total, passed, failed, broken, skipped, unknown } = data.statistic;
    const totalFailed = failed + broken + skipped + unknown;
    const allTestsPassed = total === passed;

    // Determine recipients based on test result
    const recipientsEnv = allTestsPassed
        ? process.env.EMAIL_RECIPIENTS_PASSED
        : process.env.EMAIL_RECIPIENTS_FAILED;

    if (!recipientsEnv) {
        Logger.warning('No email recipients configured. Skipping email...');
        return;
    }

    const recipients = recipientsEnv.split(',').map(email => email.trim());

    // Generate date info
    const today = new Date();
    const month = today.toLocaleString('default', { month: 'long' });
    const date = today.toLocaleString('default', {
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long',
    });

    // Configure transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    // Configure Handlebars
    const hbsConfig: hbs.NodemailerExpressHandlebarsOptions = {
        viewEngine: {
            extname: '.handlebars',
            partialsDir: path.join(__dirname, '../config/views/'),
            layoutsDir: path.join(__dirname, '../config/views/'),
            defaultLayout: '',
        },
        viewPath: path.join(__dirname, '../config/views/'),
        extName: '.handlebars',
    };

    transporter.use('compile', hbs(hbsConfig));

    // Prepare email
    const companyName = process.env.COMPANY_NAME || 'Playwright Tests';
    const fromBase64 = Buffer.from(companyName).toString('base64');
    const status = allTestsPassed ? 'Passed ✅' : 'Failed ❌';

    const mailOptions = {
        from: `=?utf-8?B?${fromBase64}?= <${process.env.GMAIL_USER}>`,
        to: recipients,
        subject: `Automation Tests - ${companyName} - ${status}`,
        template: 'index',
        context: {
            name: companyName,
            linkReportOnline: reportUrl,
            title: 'Automation Test Report',
            content: `Test execution completed on ${date}`,
            month,
            total,
            passed,
            failed: totalFailed,
            date,
            enouvoSite: process.env.COMPANY_WEBSITE || 'https://example.com',
            enouvoIcon: process.env.COMPANY_LOGO_URL || 'https://via.placeholder.com/150',
        },
    };

    // Send email
    Logger.info(`Sending email to: ${recipients.join(', ')}`);
    await transporter.sendMail(mailOptions);
    Logger.success(`Email sent successfully! (${total} tests: ${passed} passed, ${totalFailed} failed)`);
}

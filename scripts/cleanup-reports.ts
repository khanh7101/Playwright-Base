import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './utils/logger';

/**
 * Cleanup old Allure reports based on retention policy
 */
async function cleanupReports() {
    const retentionDays = parseInt(process.env.REPORT_RETENTION_DAYS || '30');
    const reportDir = path.join(process.cwd(), 'allure-report');

    Logger.step(`Cleaning up reports older than ${retentionDays} days...`);

    if (!fs.existsSync(reportDir)) {
        Logger.info('No reports directory found. Nothing to clean.');
        return;
    }

    const now = Date.now();
    const retentionMs = retentionDays * 24 * 60 * 60 * 1000;

    let deletedCount = 0;
    let totalSize = 0;

    // Get report directory stats
    const stats = fs.statSync(reportDir);
    const ageMs = now - stats.mtimeMs;

    if (ageMs > retentionMs) {
        // Calculate directory size
        const getDirectorySize = (dirPath: string): number => {
            let size = 0;
            const files = fs.readdirSync(dirPath);

            for (const file of files) {
                const filePath = path.join(dirPath, file);
                const fileStat = fs.statSync(filePath);

                if (fileStat.isDirectory()) {
                    size += getDirectorySize(filePath);
                } else {
                    size += fileStat.size;
                }
            }

            return size;
        };

        totalSize = getDirectorySize(reportDir);

        // Delete old report
        fs.rmSync(reportDir, { recursive: true, force: true });
        deletedCount = 1;

        Logger.success(`Deleted old report (${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
    } else {
        const daysOld = Math.floor(ageMs / (24 * 60 * 60 * 1000));
        Logger.info(`Current report is ${daysOld} days old (retention: ${retentionDays} days)`);
        Logger.info('No cleanup needed.');
    }

    // Also cleanup allure-results if it exists
    const resultsDir = path.join(process.cwd(), 'allure-results');
    if (fs.existsSync(resultsDir)) {
        const resultsStats = fs.statSync(resultsDir);
        const resultsAge = now - resultsStats.mtimeMs;

        if (resultsAge > retentionMs) {
            fs.rmSync(resultsDir, { recursive: true, force: true });
            Logger.success('Deleted old allure-results directory');
        }
    }

    if (deletedCount > 0) {
        Logger.success(`Cleanup complete! Freed ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    } else {
        Logger.success('Cleanup complete! No old reports found.');
    }
}

// Run cleanup if called directly
if (require.main === module) {
    cleanupReports()
        .then(() => process.exit(0))
        .catch((error) => {
            Logger.error('Cleanup failed:', error);
            process.exit(1);
        });
}

export { cleanupReports };

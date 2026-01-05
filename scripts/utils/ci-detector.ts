/**
 * Auto-detect CI/CD platform from environment variables
 */
export function detectCIPlatform(): string {
    if (process.env.GITHUB_ACTIONS) return 'github';
    if (process.env.GITLAB_CI) return 'gitlab';
    if (process.env.JENKINS_URL) return 'jenkins';
    if (process.env.CIRCLECI) return 'circleci';
    if (process.env.AZURE_PIPELINES || process.env.TF_BUILD) return 'azure';
    if (process.env.BITBUCKET_PIPELINE_UUID) return 'bitbucket';

    return process.env.CI_PLATFORM || 'local';
}

/**
 * Get report URL based on CI platform
 */
export function getReportUrl(platform?: string, buildNumber?: string): string {
    const detectedPlatform = platform || detectCIPlatform();

    switch (detectedPlatform) {
        case 'github':
            const ghOwner = process.env.GITHUB_REPOSITORY_OWNER;
            const ghRepo = process.env.GITHUB_REPOSITORY?.split('/')[1];
            const ghRun = process.env.GITHUB_RUN_NUMBER || buildNumber;
            return `https://${ghOwner}.github.io/${ghRepo}/reports/${ghRun}`;

        case 'gitlab':
            const glNamespace = process.env.CI_PROJECT_NAMESPACE;
            const glProject = process.env.CI_PROJECT_NAME;
            const glPipeline = process.env.CI_PIPELINE_ID || buildNumber;
            return `https://${glNamespace}.gitlab.io/${glProject}/reports/${glPipeline}`;

        case 'jenkins':
            const jenkinsUrl = process.env.JENKINS_URL;
            const jobName = process.env.JOB_NAME;
            const buildNum = process.env.BUILD_NUMBER || buildNumber;
            return `${jenkinsUrl}job/${jobName}/${buildNum}/allure/`;

        case 'circleci':
            const circleJobId = process.env.CIRCLE_WORKFLOW_JOB_ID;
            const circleNode = process.env.CIRCLE_NODE_INDEX || '0';
            return `https://output.circle-artifacts.com/output/job/${circleJobId}/artifacts/${circleNode}/allure-report/index.html`;

        case 'azure':
            const azureProject = process.env.SYSTEM_TEAMPROJECT;
            const azureBuild = process.env.BUILD_BUILDID;
            return `https://dev.azure.com/${azureProject}/_build/results?buildId=${azureBuild}`;

        case 'bitbucket':
            const bbWorkspace = process.env.BITBUCKET_WORKSPACE;
            const bbRepo = process.env.BITBUCKET_REPO_SLUG;
            const bbBuild = process.env.BITBUCKET_BUILD_NUMBER || buildNumber;
            return `https://bitbucket.org/${bbWorkspace}/${bbRepo}/downloads/allure-report-${bbBuild}.zip`;

        case 'local':
        default:
            const port = process.env.REPORT_SERVER_PORT || '8080';
            const host = process.env.REPORT_SERVER_HOST || 'localhost';
            return `http://${host}:${port}`;
    }
}

/**
 * Check if running in CI environment
 */
export function isCI(): boolean {
    return !!process.env.CI || detectCIPlatform() !== 'local';
}

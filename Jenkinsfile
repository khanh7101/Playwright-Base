pipeline {
    agent any
    
    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    
    environment {
        CI = 'true'
        PATH = "/usr/local/bin:/opt/homebrew/bin:$PATH"
        JAVA_HOME = "/opt/homebrew/opt/openjdk@17"
        TZ = 'Asia/Ho_Chi_Minh'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'npm run test'
            }
        }
        
        stage('Generate Allure Report') {
            steps {
                sh 'npm run allure:generate'
            }
        }
        
        stage('Publish Reports') {
            steps {
                // Publish Allure Report (using Allure Plugin)
                allure([
                    includeProperties: false,
                    jdk: '',
                    properties: [],
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: 'allure-results']]
                ])
                
                // Publish JUnit XML Report (with healthScaleFactor to prevent UNSTABLE)
                junit allowEmptyResults: true, 
                      healthScaleFactor: 0.0, 
                      testResults: 'junit/results.xml'
                
                // Archive Playwright HTML Report  
                archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
            }
        }
    }
    
    post {
        always {
            script {
                // Send unified email notification for all build results
                emailext (
                    subject: "📊 Playwright Test Report: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                    body: """
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
                                .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
                                .content { padding: 30px; max-width: 800px; margin: 0 auto; }
                                table { border-collapse: collapse; width: 100%; margin: 15px 0; }
                                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                                th { background-color: #f5f5f5; font-weight: bold; }
                                .test-passed { color: #4CAF50; font-weight: bold; }
                                .test-failed { color: #f44336; font-weight: bold; }
                                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
                                a { color: #2196F3; text-decoration: none; }
                                a:hover { text-decoration: underline; }
                            </style>
                        </head>
                        <body>
                            <div class="header">
                                <h1>📊 Playwright Test Report</h1>
                            </div>
                            
                            <div class="content">
                                <h2>Build Information</h2>
                                <table>
                                    <tr><th>Property</th><th>Value</th></tr>
                                    <tr><td>Project</td><td>${env.JOB_NAME}</td></tr>
                                    <tr><td>Build Number</td><td>#${env.BUILD_NUMBER}</td></tr>
                                    <tr><td>Build Time</td><td>\${BUILD_TIMESTAMP}</td></tr>
                                    <tr><td>Duration</td><td>\${BUILD_DURATION}</td></tr>
                                </table>
                                
                                <h2>Test Results</h2>
                                <table>
                                    <tr><th>Metric</th><th>Count</th></tr>
                                    <tr><td>Total Tests</td><td><strong>\${TEST_COUNTS,var="total"}</strong></td></tr>
                                    <tr><td>Passed</td><td class="test-passed">\${TEST_COUNTS,var="pass"}</td></tr>
                                    <tr><td>Failed</td><td class="test-failed">\${TEST_COUNTS,var="fail"}</td></tr>
                                    <tr><td>Skipped</td><td>\${TEST_COUNTS,var="skip"}</td></tr>
                                </table>
                                
                                <h2>📊 View Detailed Reports</h2>
                                <ul>
                                    <li><a href="${env.BUILD_URL}allure">Allure Report</a> - Interactive test report with charts and screenshots</li>
                                    <li><a href="${env.BUILD_URL}console">Console Output</a> - Full build log</li>
                                </ul>
                                
                                <div class="footer">
                                    <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                                    <p>This is an automated notification from Jenkins CI/CD</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    """,
                    to: 'khanhvuduy7101@gmail.com',
                    from: 'jenkins@yourcompany.com',
                    replyTo: 'jenkins@yourcompany.com',
                    mimeType: 'text/html'
                )
            }
            
            // Clean workspace
            cleanWs()
        }
    }
}

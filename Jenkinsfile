pipeline {
    agent any
    
    environment {
        CI = 'true'
        PATH = "/usr/local/bin:/opt/homebrew/bin:$PATH"
        JAVA_HOME = "/opt/homebrew/opt/openjdk@17"
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
                
                // Publish JUnit XML Report
                junit 'junit/results.xml'
                
                // Archive Playwright HTML Report  
                archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
            }
        }
    }
    
    post {
        always {
            // Clean workspace
            cleanWs()
        }
        
        success {
            echo 'Tests passed successfully!'
            emailext (
                subject: "✅ Jenkins Build SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; }
                            .header { background-color: #4CAF50; color: white; padding: 15px; }
                            .content { padding: 20px; }
                            table { border-collapse: collapse; width: 100%; margin: 10px 0; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #4CAF50; color: white; }
                            .success { color: #4CAF50; font-weight: bold; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>✅ Playwright Tests - Build Successful</h1>
                        </div>
                        
                        <div class="content">
                            <h2>Build Information</h2>
                            <table>
                                <tr><th>Property</th><th>Value</th></tr>
                                <tr><td>Project</td><td>${env.JOB_NAME}</td></tr>
                                <tr><td>Build Number</td><td>${env.BUILD_NUMBER}</td></tr>
                                <tr><td>Status</td><td class="success">SUCCESS</td></tr>
                                <tr><td>Build URL</td><td><a href="${env.BUILD_URL}">${env.BUILD_URL}</a></td></tr>
                            </table>
                            
                            <h2>Test Results</h2>
                            <table>
                                <tr><th>Metric</th><th>Count</th></tr>
                                <tr><td>Total Tests</td><td>\${TEST_COUNTS,var="total"}</td></tr>
                                <tr><td>Passed</td><td style="color: green;">\${TEST_COUNTS,var="pass"}</td></tr>
                                <tr><td>Failed</td><td>\${TEST_COUNTS,var="fail"}</td></tr>
                                <tr><td>Skipped</td><td>\${TEST_COUNTS,var="skip"}</td></tr>
                            </table>
                            
                            <h2>📊 View Reports</h2>
                            <ul>
                                <li><a href="${env.BUILD_URL}allure">Allure Report</a></li>
                                <li><a href="${env.BUILD_URL}testReport">JUnit Test Report</a></li>
                                <li><a href="${env.BUILD_URL}Playwright_20HTML_20Report">Playwright HTML Report</a></li>
                                <li><a href="${env.BUILD_URL}console">Console Output</a></li>
                            </ul>
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
        
        failure {
            echo 'Tests failed. Check the reports for details.'
            emailext (
                subject: "❌ Jenkins Build FAILED: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; }
                            .header { background-color: #f44336; color: white; padding: 15px; }
                            .content { padding: 20px; }
                            table { border-collapse: collapse; width: 100%; margin: 10px 0; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f44336; color: white; }
                            .failed { color: #f44336; font-weight: bold; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>❌ Playwright Tests - Build Failed</h1>
                        </div>
                        
                        <div class="content">
                            <h2>Build Information</h2>
                            <table>
                                <tr><th>Property</th><th>Value</th></tr>
                                <tr><td>Project</td><td>${env.JOB_NAME}</td></tr>
                                <tr><td>Build Number</td><td>${env.BUILD_NUMBER}</td></tr>
                                <tr><td>Status</td><td class="failed">FAILED</td></tr>
                                <tr><td>Build URL</td><td><a href="${env.BUILD_URL}">${env.BUILD_URL}</a></td></tr>
                            </table>
                            
                            <h2>Test Results</h2>
                            <table>
                                <tr><th>Metric</th><th>Count</th></tr>
                                <tr><td>Total Tests</td><td>\${TEST_COUNTS,var="total"}</td></tr>
                                <tr><td>Passed</td><td style="color: green;">\${TEST_COUNTS,var="pass"}</td></tr>
                                <tr><td>Failed</td><td style="color: red; font-weight: bold;">\${TEST_COUNTS,var="fail"}</td></tr>
                                <tr><td>Skipped</td><td>\${TEST_COUNTS,var="skip"}</td></tr>
                            </table>
                            
                            <h2>🔍 Debug Information</h2>
                            <ul>
                                <li><a href="${env.BUILD_URL}allure">View Allure Report</a></li>
                                <li><a href="${env.BUILD_URL}testReport">View Failed Tests</a></li>
                                <li><a href="${env.BUILD_URL}console">View Console Output</a></li>
                            </ul>
                            
                            <p><strong>Action Required:</strong> Please check the failed tests and fix the issues.</p>
                        </div>
                    </body>
                    </html>
                """,
                to: 'khanhvuduy7101@gmail.com',
                from: 'jenkins@yourcompany.com',
                replyTo: 'jenkins@yourcompany.com',
                mimeType: 'text/html',
                attachLog: true,
                compressLog: true
            )
        }
        
        fixed {
            emailext (
                subject: "🔧 Jenkins Build FIXED: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; }
                            .header { background-color: #2196F3; color: white; padding: 15px; }
                            .content { padding: 20px; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>🔧 Build Fixed!</h1>
                        </div>
                        <div class="content">
                            <p>Great news! The build is now passing after previous failures.</p>
                            <p><strong>Project:</strong> ${env.JOB_NAME}</p>
                            <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                            <p><a href="${env.BUILD_URL}">View Build Details</a></p>
                        </div>
                    </body>
                    </html>
                """,
                to: 'khanhvuduy7101@gmail.com',
                from: 'jenkins@yourcompany.com',
                mimeType: 'text/html'
            )
        }
    }
}

pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS 18' // Ensure NodeJS 18 is configured in Jenkins Global Tool Configuration
    }
    
    environment {
        CI = 'true'
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
                // Publish Allure Report
                allure([
                    includeProperties: false,
                    jdk: '',
                    properties: [],
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: 'allure-results']]
                ])
                
                // Publish JUnit XML Report
                junit 'junit/results.xml'
                
                // Archive HTML Report
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright HTML Report'
                ])
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
        }
        failure {
            echo 'Tests failed. Check the reports for details.'
        }
    }
}

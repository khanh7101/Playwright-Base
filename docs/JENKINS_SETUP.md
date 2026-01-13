# Jenkins CI/CD Setup - Complete Guide

Hướng dẫn đầy đủ về setup Jenkins CI/CD cho Playwright testing project, bao gồm installation, configuration, và best practices.

---

## 📋 Mục Lục

1. [Packages & Dependencies](#-packages--dependencies)
2. [Jenkins Installation](#-jenkins-installation)
3. [Plugins Setup](#-plugins-setup)
4. [System Configuration](#-system-configuration)
5. [Email Notification Setup](#-email-notification-setup)
6. [Create Pipeline Job](#-create-pipeline-job)
7. [Jenkinsfile Configuration](#-jenkinsfile-configuration)
8. [Test Reports](#-test-reports)
9. [Troubleshooting](#-troubleshooting)
10. [Best Practices](#-best-practices)

---

## 📦 Packages & Dependencies

### Jenkins Core
- **Jenkins**: LTS version
- **Platform**: macOS/Linux/Docker
- **Installation**: Homebrew, apt, or Docker

### Jenkins Plugins (Required)
| Plugin | Purpose |
|--------|---------|
| **Allure Jenkins Plugin** | Generate và publish Allure reports |
| **Email Extension Plugin** | Gửi email notifications với HTML templates |
| **Mailer Plugin** | Basic email functionality |
| **Git Plugin** | Git SCM integration |
| **Pipeline Plugin** | Declarative Pipeline support |

### System Dependencies
| Package | Version | Location |
|---------|---------|----------|
| **Node.js** | Latest | `/usr/local/bin`, `/opt/homebrew/bin` |
| **Java (OpenJDK)** | 17 | `/opt/homebrew/opt/openjdk@17` |
| **Allure Commandline** | Latest | Installed via Jenkins Plugin |
| **Playwright** | Latest | Project dependency |

### Project Dependencies
```json
{
  "@playwright/test": "latest",
  "allure-playwright": "latest",
  "allure-commandline": "latest"
}
```

---

## 🚀 Jenkins Installation

### Option A: Homebrew (macOS)
```bash
brew install jenkins-lts
brew services start jenkins-lts
```

### Option B: Docker (Recommended)
```bash
docker pull jenkins/jenkins:lts
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
```

### Option C: Ubuntu/Debian
```bash
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt-get update
sudo apt-get install jenkins
sudo systemctl start jenkins
```

### Initial Setup
1. Truy cập: `http://localhost:8080`
2. Lấy initial admin password:
   ```bash
   # Docker
   docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   
   # Local
   cat ~/.jenkins/secrets/initialAdminPassword
   ```
3. Chọn **"Install suggested plugins"**
4. Tạo admin user

---

## 🔌 Plugins Setup

### Cài đặt qua UI
1. **Manage Jenkins** → **Plugins** → **Available plugins**
2. Tìm và cài đặt:
   - ✅ Allure Jenkins Plugin
   - ✅ Email Extension Plugin
   - ✅ Mailer Plugin
3. Click **Install** và restart Jenkins

### Verify Plugins
1. **Manage Jenkins** → **Plugins** → **Installed plugins**
2. Kiểm tra các plugins đã cài đặt

---

## ⚙️ System Configuration

### 1. Configure Java (cho Allure)

**Manage Jenkins** → **Tools** → **JDK installations**

- **Name**: `OpenJDK 17`
- **JAVA_HOME**: `/opt/homebrew/opt/openjdk@17`
- Uncheck "Install automatically" (nếu đã cài sẵn)

### 2. Configure Allure Commandline

**Manage Jenkins** → **Tools** → **Allure Commandline**

- **Name**: `Allure`
- **Install automatically**: ✅
- **Version**: Latest

---

## 📧 Email Notification Setup

### Step 1: Tạo Gmail App Password

1. Vào: https://myaccount.google.com/apppasswords
2. Tạo App Password mới
3. Copy 16-character password

### Step 2: Configure Extended E-mail Notification

**Manage Jenkins** → **System** → **Extended E-mail Notification**

#### SMTP Settings:
- **SMTP server**: `smtp.gmail.com`
- **SMTP Port**: `465`
- **Advanced** → **Credentials**: Add new
  - Kind: `Username with password`
  - Username: `your-email@gmail.com`
  - Password: `[16-character App Password]`
- **Use SSL**: ✅ Checked
- **Default user e-mail suffix**: `@gmail.com`

#### Test Configuration:
1. Click **"Test configuration by sending test e-mail"**
2. Nhập email test
3. Click **"Test configuration"**
4. Kiểm tra inbox

> **Lưu ý**: Nếu test fail, kiểm tra:
> - App Password đúng chưa
> - Port 465 và SSL enabled
> - Gmail account không bị block

---

## 🔨 Create Pipeline Job

### Step 1: Create New Item
1. **Dashboard** → **New Item**
2. Tên job: `Playwright-Tests`
3. Chọn: **Pipeline**
4. Click **OK**

### Step 2: Configure Pipeline

#### General Settings:
- **Description**: `Automated Playwright E2E tests`

#### Pipeline Definition:
- **Definition**: `Pipeline script from SCM`
- **SCM**: `Git`
- **Repository URL**: `https://github.com/your-username/test-playwright-base.git`
- **Branch Specifier**: `*/main`
- **Script Path**: `Jenkinsfile`

#### Build Triggers (Optional):
- ✅ **Poll SCM**: `H/5 * * * *` (check mỗi 5 phút)
- Hoặc ✅ **GitHub hook trigger** (nếu có webhook)

### Step 3: Save & Build
1. Click **Save**
2. Click **Build Now** để test

---

## 📝 Jenkinsfile Configuration

### Complete Jenkinsfile Structure

```groovy
pipeline {
    agent any
    
    triggers {
        // Chạy tự động lúc 4h sáng và 8h tối mỗi ngày
        cron('0 4,20 * * *')
    }
    
    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 2, unit: 'HOURS')
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
            options {
                timeout(time: 1, unit: 'HOURS')
            }
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
                // Allure Report
                allure([
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: 'allure-results']]
                ])
                
                // JUnit Report (với healthScaleFactor để tránh UNSTABLE)
                junit allowEmptyResults: true, 
                      healthScaleFactor: 0.0, 
                      testResults: 'junit/results.xml'
                
                // Archive Playwright HTML Report
                archiveArtifacts artifacts: 'playwright-report/**/*', 
                                 allowEmptyArchive: true
            }
        }
    }
    
    post {
        always {
            script {
                // Unified email template
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
                                    <tr><td>Build Time</td><td>${new Date(currentBuild.startTimeInMillis).format('yyyy-MM-dd HH:mm:ss', TimeZone.getTimeZone('Asia/Ho_Chi_Minh'))}</td></tr>
                                    <tr><td>Duration</td><td>${currentBuild.durationString.replace(' and counting', '')}</td></tr>
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
                                    <li><a href="${env.BUILD_URL}allure">Allure Report</a></li>
                                    <li><a href="${env.BUILD_URL}console">Console Output</a></li>
                                </ul>
                            </div>
                        </body>
                        </html>
                    """,
                    to: 'your-email@gmail.com',
                    from: 'jenkins@yourcompany.com',
                    mimeType: 'text/html'
                )
            }
            
            // Clean workspace
            cleanWs()
        }
    }
}
```

### Key Features Explained

#### 1. Cron Triggers
```groovy
triggers {
    cron('0 4,20 * * *')  // 4 AM và 8 PM mỗi ngày
}
```
Format: `minute hour day month dayOfWeek`

#### 2. Timeout Configuration
```groovy
options {
    timeout(time: 2, unit: 'HOURS')  // Pipeline timeout
}

stage('Run Tests') {
    options {
        timeout(time: 1, unit: 'HOURS')  // Stage timeout
    }
}
```

#### 3. Environment Variables
```groovy
environment {
    TZ = 'Asia/Ho_Chi_Minh'  // Vietnam timezone
    JAVA_HOME = "/opt/homebrew/opt/openjdk@17"
}
```

#### 4. Email Variables
```groovy
// Build info
${env.JOB_NAME}
${env.BUILD_NUMBER}
${new Date(currentBuild.startTimeInMillis).format('yyyy-MM-dd HH:mm:ss', TimeZone.getTimeZone('Asia/Ho_Chi_Minh'))}
${currentBuild.durationString}

// Test results
\${TEST_COUNTS,var="total"}
\${TEST_COUNTS,var="pass"}
\${TEST_COUNTS,var="fail"}
```

---

## 📊 Test Reports

### 1. Allure Report
- **URL**: `http://localhost:8080/job/Playwright-Tests/{buildNumber}/allure`
- **Features**:
  - Interactive charts
  - Test history
  - Screenshots
  - Step-by-step execution

### 2. JUnit Report
- **URL**: `http://localhost:8080/job/Playwright-Tests/{buildNumber}/testReport`
- **Features**:
  - Test counts
  - Failed tests details
  - Test trend graph

### 3. Playwright HTML Report
- **URL**: `http://localhost:8080/job/Playwright-Tests/{buildNumber}/artifact/playwright-report/index.html`
- **Features**:
  - Native Playwright report
  - Trace viewer
  - Screenshots & videos

---

## 🔍 Troubleshooting

### Issue 1: Build Status UNSTABLE
**Nguyên nhân**: Allure Plugin đánh dấu build là UNSTABLE

**Giải pháp**:
- Sử dụng `healthScaleFactor: 0.0` trong junit step
- Hoặc chấp nhận UNSTABLE (email vẫn gửi bình thường)

### Issue 2: Email không gửi
**Kiểm tra**:
1. Gmail App Password đúng chưa
2. SMTP settings: `smtp.gmail.com:465`
3. Use SSL được check chưa
4. Test configuration thành công chưa

### Issue 3: Test counts không hiển thị
**Nguyên nhân**: JUnit step bị tắt

**Giải pháp**: 
```groovy
junit allowEmptyResults: true, 
      healthScaleFactor: 0.0, 
      testResults: 'junit/results.xml'
```

### Issue 4: Timestamp không hiển thị đúng
**Giải pháp**: Sử dụng script để format:
```groovy
${new Date(currentBuild.startTimeInMillis).format('yyyy-MM-dd HH:mm:ss', TimeZone.getTimeZone('Asia/Ho_Chi_Minh'))}
```

### Issue 5: "npx: command not found"
**Giải pháp**: Thêm Node.js vào PATH:
```groovy
environment {
    PATH = "/usr/local/bin:/opt/homebrew/bin:$PATH"
}
```

### Issue 6: Reports không hiển thị
**Giải pháp**: Disable CSP
1. **Manage Jenkins** → **Script Console**
2. Run:
```groovy
System.setProperty("hudson.model.DirectoryBrowserSupport.CSP", "")
```

---

## 🎯 Best Practices

### 1. Pipeline Configuration
- ✅ Sử dụng **Pipeline from SCM** thay vì inline script
- ✅ Enable **cron triggers** cho automated testing
- ✅ Set **timeout** để tránh build treo
- ✅ Use **healthScaleFactor: 0.0** cho junit để tránh UNSTABLE

### 2. Email Notifications
- ✅ Sử dụng **unified email template** cho tất cả statuses
- ✅ Hiển thị **build time** với timezone phù hợp
- ✅ Include **test counts** và **links to reports**
- ✅ Use **HTML template** cho email đẹp

### 3. Report Management
- ✅ Publish **multiple report types** (Allure, JUnit, HTML)
- ✅ Archive **artifacts** để dễ debug
- ✅ Set **reportBuildPolicy: 'ALWAYS'** cho Allure

### 4. Workspace Management
- ✅ Use **cleanWs()** trong post actions
- ✅ Set **buildDiscarder** để giữ 10 builds gần nhất
- ✅ Archive chỉ **necessary artifacts**

### 5. Security
- ✅ Sử dụng **Jenkins Credentials** cho sensitive data
- ✅ Không hardcode **passwords** trong Jenkinsfile
- ✅ Use **App Passwords** cho Gmail

---

## ✅ Verification Checklist

- [ ] Jenkins đã cài đặt và chạy
- [ ] Plugins đã cài đặt (Allure, Email Extension)
- [ ] Java đã configure cho Allure
- [ ] Gmail App Password đã tạo
- [ ] SMTP settings đã configure
- [ ] Test email thành công
- [ ] Pipeline job đã tạo
- [ ] Jenkinsfile đã push lên GitHub
- [ ] Build chạy thành công
- [ ] Allure Report generated
- [ ] Email nhận được với đầy đủ thông tin
- [ ] Cron triggers hoạt động (nếu enable)

---

## 📚 Related Documentation

- [Jenkins Email Setup Guide](./JENKINS_EMAIL_SETUP.md)
- [Allure Without Plugin Guide](./ALLURE_WITHOUT_PLUGIN.md)
- [Jenkins Official Documentation](https://www.jenkins.io/doc/)
- [Playwright Documentation](https://playwright.dev/)

---

## 🎉 Summary

Jenkins CI/CD pipeline đã được setup hoàn chỉnh với:

✅ **Automated Testing**: Chạy tự động theo lịch (4h sáng, 8h tối)  
✅ **Multiple Reports**: Allure, JUnit, Playwright HTML  
✅ **Email Notifications**: HTML template với đầy đủ thông tin  
✅ **Timezone Support**: Hiển thị giờ Việt Nam  
✅ **Timeout Protection**: Tránh build bị treo  
✅ **Clean Workspace**: Tự động dọn dẹp sau mỗi build  

**Total Build Time**: ~1-2 phút  
**Email Delivery**: Ngay sau khi build xong  
**Reports**: Accessible qua Jenkins UI và email links

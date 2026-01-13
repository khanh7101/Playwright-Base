# Jenkins CI/CD Setup - Walkthrough

Tài liệu này tổng kết toàn bộ quá trình setup Jenkins CI/CD cho Playwright testing project, bao gồm tất cả packages đã cài đặt và các bước cấu hình trên Jenkins.

---

## 📦 Packages & Dependencies Đã Cài Đặt

### 1. Jenkins Core
- **Jenkins**: Phiên bản mới nhất (LTS)
- **Platform**: macOS
- **Installation**: Homebrew (`brew install jenkins-lts`)

### 2. Jenkins Plugins
| Plugin | Version | Mục đích |
|--------|---------|----------|
| **Allure Jenkins Plugin** | Latest | Generate và publish Allure reports |
| **Email Extension Plugin** | Latest | Gửi email notifications với HTML templates |
| **Mailer Plugin** | Latest | Basic email functionality |
| **Git Plugin** | Latest | Git SCM integration |
| **Pipeline Plugin** | Latest | Declarative Pipeline support |

### 3. System Dependencies
| Package | Version | Cài đặt |
|---------|---------|---------|
| **Node.js** | Latest | System PATH (`/usr/local/bin`, `/opt/homebrew/bin`) |
| **Java (OpenJDK)** | 17 | `/opt/homebrew/opt/openjdk@17` |
| **Allure Commandline** | Latest | Installed via Jenkins Plugin |
| **Playwright** | Latest | `npm install` trong project |

### 4. Project Dependencies
```json
{
  "@playwright/test": "latest",
  "allure-playwright": "latest",
  "allure-commandline": "latest"
}
```

---

## 🔧 Jenkins Configuration Steps

### Step 1: Jenkins Installation & Setup

#### 1.1 Cài đặt Jenkins
```bash
brew install jenkins-lts
brew services start jenkins-lts
```

#### 1.2 Truy cập Jenkins
- URL: `http://localhost:8080`
- Unlock Jenkins với initial admin password
- Cài đặt suggested plugins
- Tạo admin user

#### 1.3 Cài đặt Additional Plugins
1. Vào **Manage Jenkins** → **Plugins**
2. Cài đặt:
   - Allure Jenkins Plugin
   - Email Extension Plugin
3. Restart Jenkins

---

### Step 2: System Configuration

#### 2.1 Configure Java (cho Allure)
1. Vào **Manage Jenkins** → **Tools**
2. Tìm **JDK installations**
3. Add JDK:
   - Name: `OpenJDK 17`
   - JAVA_HOME: `/opt/homebrew/opt/openjdk@17`

#### 2.2 Configure Allure Commandline
1. Vào **Manage Jenkins** → **Tools**
2. Tìm **Allure Commandline**
3. Add Allure:
   - Name: `Allure`
   - Install automatically: ✅
   - Version: Latest

---

### Step 3: Email Notification Setup

#### 3.1 Tạo Gmail App Password
1. Vào Google Account: https://myaccount.google.com/apppasswords
2. Tạo App Password mới
3. Copy 16-character password

#### 3.2 Configure Extended E-mail Notification
1. Vào **Manage Jenkins** → **System**
2. Tìm **Extended E-mail Notification**
3. Cấu hình:
   - **SMTP server**: `smtp.gmail.com`
   - **SMTP Port**: `465`
   - **Use SSL**: ✅
   - **Credentials**: Add new
     - Kind: Username with password
     - Username: `khanhvuduy7101@gmail.com`
     - Password: [16-character App Password]
   - **Default user e-mail suffix**: `@gmail.com`

#### 3.3 Test Email Configuration
1. Click **Test configuration by sending test e-mail**
2. Nhập email: `khanhvuduy7101@gmail.com`
3. Click **Test configuration**
4. Kiểm tra inbox

---

### Step 4: Create Jenkins Job

#### 4.1 Tạo Pipeline Job
1. Click **New Item**
2. Nhập tên: `Playwright-Tests`
3. Chọn **Pipeline**
4. Click **OK**

#### 4.2 Configure Pipeline
1. **General**:
   - Description: `Automated Playwright E2E tests`
   
2. **Build Triggers**:
   - ✅ Poll SCM hoặc GitHub hook (optional)
   
3. **Pipeline**:
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: `https://github.com/khanh7101/Playwright-Base.git`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`

4. Click **Save**

---

## 📝 Jenkinsfile Configuration

### Final Jenkinsfile Structure

```groovy
pipeline {
    agent any
    
    triggers {
        cron('0 4,20 * * *')  // Chạy tự động 4h sáng và 8h tối
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
        stage('Checkout') { ... }
        stage('Install Dependencies') { ... }
        stage('Install Playwright Browsers') { ... }
        stage('Run Tests') { 
            options {
                timeout(time: 1, unit: 'HOURS')
            }
            ...
        }
        stage('Generate Allure Report') { ... }
        stage('Publish Reports') {
            // Allure Plugin
            // JUnit with healthScaleFactor: 0.0
            // Archive Playwright HTML Report
        }
    }
    
    post {
        always {
            // Unified email template
            // Clean workspace
        }
    }
}
```

### Key Features

#### 1. Cron Triggers
```groovy
triggers {
    cron('0 4,20 * * *')
}
```
- Chạy tự động lúc 4h sáng và 8h tối mỗi ngày
- Format: `minute hour day month dayOfWeek`

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

#### 4. Report Publishing
```groovy
// Allure Report
allure([
    reportBuildPolicy: 'ALWAYS',
    results: [[path: 'allure-results']]
])

// JUnit with healthScaleFactor to prevent UNSTABLE
junit allowEmptyResults: true, 
      healthScaleFactor: 0.0, 
      testResults: 'junit/results.xml'

// Archive Playwright HTML Report
archiveArtifacts artifacts: 'playwright-report/**/*'
```

#### 5. Unified Email Template
```groovy
post {
    always {
        script {
            emailext (
                subject: "📊 Playwright Test Report: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                    <!-- HTML template với:
                         - Build Time (giờ VN)
                         - Duration
                         - Test Results
                         - Links to Reports
                    -->
                """,
                to: 'khanhvuduy7101@gmail.com',
                mimeType: 'text/html'
            )
        }
    }
}
```

---

## 📧 Email Template Features

### Email Content
1. **Header**: Blue background với title "📊 Playwright Test Report"
2. **Build Information Table**:
   - Project name
   - Build number
   - Build time (Vietnam timezone)
   - Duration
3. **Test Results Table**:
   - Total Tests
   - Passed (green)
   - Failed (red)
   - Skipped
4. **Links**:
   - Allure Report
   - Console Output
5. **Footer**: Build URL và automated message

### Email Variables
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
\${TEST_COUNTS,var="skip"}
```

---

## 🎯 Test Results & Reports

### 1. Allure Report
- **URL**: `http://localhost:8080/job/Playwright-Tests/{buildNumber}/allure`
- **Features**:
  - Interactive charts
  - Test history
  - Screenshots
  - Step-by-step execution
  - Environment info

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
  - Screenshots
  - Videos (if enabled)

---

## 🔍 Troubleshooting

### Issue 1: Build Status UNSTABLE
**Nguyên nhân**: Allure Plugin đánh dấu build là UNSTABLE

**Giải pháp**:
1. Chấp nhận UNSTABLE status (email vẫn gửi bình thường)
2. Hoặc xóa Allure history để reset

### Issue 2: Email không gửi
**Kiểm tra**:
1. Gmail App Password đúng chưa
2. SMTP settings đúng chưa (`smtp.gmail.com:465`)
3. Use SSL được check chưa
4. Test configuration trong Extended E-mail Notification

### Issue 3: Test counts không hiển thị
**Nguyên nhân**: JUnit step bị comment out

**Giải pháp**: Bật lại JUnit với `healthScaleFactor: 0.0`

### Issue 4: Timestamp không hiển thị
**Giải pháp**: Sử dụng `currentBuild.startTimeInMillis` với format

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

- [Jenkins Email Setup Guide](file:///Users/khanh.vu/Documents/work%20space/enouvo/test-playwright-base/docs/JENKINS_EMAIL_SETUP.md)
- [Allure Without Plugin Guide](file:///Users/khanh.vu/Documents/work%20space/enouvo/test-playwright-base/docs/ALLURE_WITHOUT_PLUGIN.md)
- [Jenkinsfile](file:///Users/khanh.vu/Documents/work%20space/enouvo/test-playwright-base/Jenkinsfile)

---

## 🎉 Summary

Jenkins CI/CD pipeline đã được setup hoàn chỉnh với:

✅ **Automated Testing**: Chạy tự động theo lịch (4h sáng, 8h tối)  
✅ **Multiple Reports**: Allure, JUnit, Playwright HTML  
✅ **Email Notifications**: HTML template đẹp với đầy đủ thông tin  
✅ **Timezone Support**: Hiển thị giờ Việt Nam  
✅ **Timeout Protection**: Tránh build bị treo  
✅ **Clean Workspace**: Tự động dọn dẹp sau mỗi build  

**Total Build Time**: ~1-2 phút  
**Email Delivery**: Ngay sau khi build xong  
**Reports**: Accessible qua Jenkins UI và email links

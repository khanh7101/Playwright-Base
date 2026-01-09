# Hướng Dẫn Setup Email Notification cho Jenkins

## 📋 Mục Lục
1. [Cài Đặt Email Extension Plugin](#1-cài-đặt-email-extension-plugin)
2. [Cấu Hình SMTP Server](#2-cấu-hình-smtp-server)
3. [Cấu Hình Email Extension](#3-cấu-hình-email-extension)
4. [Cập Nhật Jenkinsfile](#4-cập-nhật-jenkinsfile)
5. [Test Email Notification](#5-test-email-notification)
6. [Email Templates](#6-email-templates)

---

## 1. Cài Đặt Email Extension Plugin

### Bước 1: Vào Plugin Manager
1. **Dashboard** → **Manage Jenkins** → **Manage Plugins**
2. Chọn tab **Available**
3. Tìm kiếm: `Email Extension Plugin`
4. ✅ Check plugin **Email Extension Plugin**
5. Click **Install without restart**

### Plugins cần thiết:
- ✅ **Email Extension Plugin** (Extended E-mail Notification)
- ✅ **Mailer Plugin** (thường đã có sẵn)

---

## 2. Cấu Hình SMTP Server

### Bước 1: Vào System Configuration
1. **Dashboard** → **Manage Jenkins** → **Configure System**
2. Scroll xuống phần **Jenkins Location**

### Bước 2: Cấu hình Jenkins URL và Admin Email
- **Jenkins URL**: `http://localhost:8080/` (hoặc URL thực tế của bạn)
- **System Admin e-mail address**: `jenkins@yourcompany.com`

### Bước 3: Cấu hình E-mail Notification (Mailer)
Scroll xuống phần **E-mail Notification**:

#### Sử dụng Gmail
```
SMTP server: smtp.gmail.com
Default user e-mail suffix: @gmail.com
```

Click **Advanced**:
- ✅ **Use SMTP Authentication**
- **User Name**: `your-email@gmail.com`
- **Password**: `your-app-password` (không phải password thường)
- ✅ **Use SSL**
- **SMTP Port**: `465`

#### Sử dụng Outlook/Office365
```
SMTP server: smtp.office365.com
```

Click **Advanced**:
- ✅ **Use SMTP Authentication**
- **User Name**: `your-email@outlook.com`
- **Password**: `your-password`
- ✅ **Use TLS**
- **SMTP Port**: `587`

#### Sử dụng Custom SMTP (ví dụ: Mailtrap, SendGrid)
```
SMTP server: smtp.mailtrap.io
```

Click **Advanced**:
- ✅ **Use SMTP Authentication**
- **User Name**: `your-username`
- **Password**: `your-password`
- **SMTP Port**: `2525` (hoặc theo provider)

### Bước 4: Test Configuration
1. ✅ Check **Test configuration by sending test e-mail**
2. **Test e-mail recipient**: Nhập email của bạn
3. Click **Test configuration**
4. Kiểm tra email inbox

---

## 3. Cấu Hình Email Extension

### Bước 1: Scroll xuống phần Extended E-mail Notification

#### SMTP Server Settings
- **SMTP server**: `smtp.gmail.com` (giống phần 2)
- **SMTP Port**: `465`
- **Credentials**: Click **Add** để thêm email credentials

#### Default Content
- **Default Subject**: 
  ```
  Jenkins Build $BUILD_STATUS: $PROJECT_NAME - Build #$BUILD_NUMBER
  ```

- **Default Content**:
  ```html
  <p>Build Status: $BUILD_STATUS</p>
  <p>Project: $PROJECT_NAME</p>
  <p>Build Number: $BUILD_NUMBER</p>
  <p>Build URL: $BUILD_URL</p>
  <p>Test Summary: ${TEST_COUNTS,var="total"} tests, ${TEST_COUNTS,var="fail"} failures</p>
  <p>Check console output at: <a href="$BUILD_URL">$BUILD_URL</a></p>
  ```

#### Advanced Settings
Click **Advanced**:
- **Default Recipients**: `team@yourcompany.com, qa@yourcompany.com`
- **Reply To List**: `$DEFAULT_REPLYTO`
- **Default Content Type**: `HTML (text/html)`

### Bước 2: Save Configuration
Click **Save** ở cuối trang

---

## 4. Cập Nhật Jenkinsfile

### Option A: Email cho mọi build (Always)

```groovy
post {
    always {
        emailext (
            subject: "Jenkins Build ${currentBuild.result}: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
            body: """
                <h2>Build ${currentBuild.result}</h2>
                <p><strong>Project:</strong> ${env.JOB_NAME}</p>
                <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                
                <h3>Test Summary</h3>
                <p>Total Tests: \${TEST_COUNTS,var="total"}</p>
                <p>Passed: \${TEST_COUNTS,var="pass"}</p>
                <p>Failed: \${TEST_COUNTS,var="fail"}</p>
                <p>Skipped: \${TEST_COUNTS,var="skip"}</p>
                
                <h3>Reports</h3>
                <ul>
                    <li><a href="${env.BUILD_URL}allure">Allure Report</a></li>
                    <li><a href="${env.BUILD_URL}testReport">JUnit Report</a></li>
                    <li><a href="${env.BUILD_URL}Playwright_20HTML_20Report">Playwright Report</a></li>
                </ul>
                
                <p>Check console output: <a href="${env.BUILD_URL}console">${env.BUILD_URL}console</a></p>
            """,
            to: 'team@yourcompany.com',
            from: 'jenkins@yourcompany.com',
            replyTo: 'jenkins@yourcompany.com',
            mimeType: 'text/html',
            attachLog: true,
            compressLog: true
        )
        
        cleanWs()
    }
}
```

### Option B: Email chỉ khi Failed hoặc Fixed

```groovy
post {
    failure {
        emailext (
            subject: "❌ Jenkins Build FAILED: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
            body: """
                <h2 style="color: red;">Build Failed ❌</h2>
                <p><strong>Project:</strong> ${env.JOB_NAME}</p>
                <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                <p><strong>Failed Tests:</strong> \${TEST_COUNTS,var="fail"}</p>
                <p><a href="${env.BUILD_URL}">View Build Details</a></p>
                <p><a href="${env.BUILD_URL}console">View Console Output</a></p>
            """,
            to: 'team@yourcompany.com',
            mimeType: 'text/html'
        )
    }
    
    success {
        emailext (
            subject: "✅ Jenkins Build SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
            body: """
                <h2 style="color: green;">Build Successful ✅</h2>
                <p><strong>Project:</strong> ${env.JOB_NAME}</p>
                <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                <p><strong>Total Tests:</strong> \${TEST_COUNTS,var="total"}</p>
                <p><a href="${env.BUILD_URL}allure">View Allure Report</a></p>
            """,
            to: 'team@yourcompany.com',
            mimeType: 'text/html'
        )
    }
    
    fixed {
        emailext (
            subject: "🔧 Jenkins Build FIXED: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
            body: """
                <h2 style="color: blue;">Build Fixed! 🔧</h2>
                <p>The build is now passing after previous failures.</p>
                <p><strong>Project:</strong> ${env.JOB_NAME}</p>
                <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
            """,
            to: 'team@yourcompany.com',
            mimeType: 'text/html'
        )
    }
    
    always {
        cleanWs()
    }
}
```

### Option C: Email với Attachments (Reports)

```groovy
post {
    always {
        emailext (
            subject: "Jenkins Build ${currentBuild.result}: ${env.JOB_NAME} - #${env.BUILD_NUMBER}",
            body: "Please find attached test reports.",
            to: 'team@yourcompany.com',
            mimeType: 'text/html',
            attachLog: true,
            compressLog: true,
            attachmentsPattern: '**/allure-report/**, **/playwright-report/**'
        )
    }
}
```

---

## 5. Test Email Notification

### Bước 1: Chạy Build
1. Vào job **Playwright-Tests**
2. Click **Build Now**

### Bước 2: Kiểm tra Email
1. Đợi build hoàn thành
2. Kiểm tra email inbox
3. Xác nhận nhận được email notification

### Bước 3: Kiểm tra Build Log
Nếu không nhận được email:
1. Vào build → **Console Output**
2. Tìm dòng liên quan đến email:
   ```
   Email was triggered for: ...
   Sending email for trigger: ...
   ```

---

## 6. Email Templates

### Template 1: Detailed HTML Report

```groovy
emailext (
    subject: "🧪 Playwright Test Report - Build #${env.BUILD_NUMBER}",
    body: """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .header { background-color: #4CAF50; color: white; padding: 10px; }
                .failed { background-color: #f44336; color: white; padding: 10px; }
                .content { padding: 20px; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #4CAF50; color: white; }
            </style>
        </head>
        <body>
            <div class="${currentBuild.result == 'SUCCESS' ? 'header' : 'failed'}">
                <h1>Playwright Test Report</h1>
                <p>Build Status: ${currentBuild.result}</p>
            </div>
            
            <div class="content">
                <h2>Build Information</h2>
                <table>
                    <tr><th>Property</th><th>Value</th></tr>
                    <tr><td>Project</td><td>${env.JOB_NAME}</td></tr>
                    <tr><td>Build Number</td><td>${env.BUILD_NUMBER}</td></tr>
                    <tr><td>Build Duration</td><td>${currentBuild.durationString}</td></tr>
                    <tr><td>Build URL</td><td><a href="${env.BUILD_URL}">${env.BUILD_URL}</a></td></tr>
                </table>
                
                <h2>Test Results</h2>
                <table>
                    <tr><th>Metric</th><th>Count</th></tr>
                    <tr><td>Total Tests</td><td>\${TEST_COUNTS,var="total"}</td></tr>
                    <tr><td>Passed</td><td style="color: green;">\${TEST_COUNTS,var="pass"}</td></tr>
                    <tr><td>Failed</td><td style="color: red;">\${TEST_COUNTS,var="fail"}</td></tr>
                    <tr><td>Skipped</td><td>\${TEST_COUNTS,var="skip"}</td></tr>
                </table>
                
                <h2>Reports</h2>
                <ul>
                    <li><a href="${env.BUILD_URL}allure">📊 Allure Report</a></li>
                    <li><a href="${env.BUILD_URL}testReport">📄 JUnit Report</a></li>
                    <li><a href="${env.BUILD_URL}Playwright_20HTML_20Report">🎭 Playwright Report</a></li>
                    <li><a href="${env.BUILD_URL}console">📝 Console Output</a></li>
                </ul>
            </div>
        </body>
        </html>
    """,
    to: 'team@yourcompany.com',
    mimeType: 'text/html'
)
```

### Template 2: Simple Text Email

```groovy
emailext (
    subject: "Playwright Tests - Build #${env.BUILD_NUMBER} - ${currentBuild.result}",
    body: """
        Build Status: ${currentBuild.result}
        Project: ${env.JOB_NAME}
        Build Number: ${env.BUILD_NUMBER}
        Build URL: ${env.BUILD_URL}
        
        Test Summary:
        - Total: \${TEST_COUNTS,var="total"}
        - Passed: \${TEST_COUNTS,var="pass"}
        - Failed: \${TEST_COUNTS,var="fail"}
        
        View Reports:
        - Allure: ${env.BUILD_URL}allure
        - Console: ${env.BUILD_URL}console
    """,
    to: 'team@yourcompany.com'
)
```

---

## 🔐 Lấy Gmail App Password

Nếu dùng Gmail, bạn cần tạo **App Password**:

1. Vào Google Account: https://myaccount.google.com/
2. **Security** → **2-Step Verification** (bật nếu chưa có)
3. Scroll xuống → **App passwords**
4. **Select app**: Mail
5. **Select device**: Other (Custom name) → Nhập "Jenkins"
6. Click **Generate**
7. Copy password 16 ký tự
8. Dùng password này trong Jenkins SMTP configuration

---

## 📧 Email Recipients Options

### Gửi cho nhiều người
```groovy
to: 'dev1@company.com, dev2@company.com, qa@company.com'
```

### Gửi CC và BCC
```groovy
emailext (
    to: 'team@company.com',
    cc: 'manager@company.com',
    bcc: 'archive@company.com',
    // ... other settings
)
```

### Gửi cho người commit code
```groovy
emailext (
    to: '${DEFAULT_RECIPIENTS}',
    recipientProviders: [
        developers(),  // Người commit code
        requestor(),   // Người trigger build
        culprits()     // Người gây ra lỗi
    ],
    // ... other settings
)
```

---

## 🎯 Best Practices

1. ✅ **Không spam**: Chỉ gửi email khi failed hoặc fixed
2. ✅ **HTML format**: Dễ đọc hơn plain text
3. ✅ **Include links**: Link đến reports và console output
4. ✅ **Compress logs**: Nếu attach log files
5. ✅ **Test thoroughly**: Test email trước khi deploy
6. ✅ **Use templates**: Tạo template để reuse

---

## 🆘 Troubleshooting

### ❌ Không nhận được email

**Kiểm tra:**
1. SMTP settings đúng chưa
2. Credentials đúng chưa (dùng App Password cho Gmail)
3. Port và SSL/TLS settings
4. Firewall có block port 465/587 không
5. Check spam folder

**Debug:**
```groovy
// Thêm vào Jenkinsfile để debug
echo "Sending email to: team@company.com"
echo "Build result: ${currentBuild.result}"
```

### ❌ Email bị vào Spam

**Giải pháp:**
1. Whitelist địa chỉ jenkins@yourcompany.com
2. Dùng domain email chính thức
3. Cấu hình SPF/DKIM records

---

## 📚 Tài Liệu Tham Khảo

- [Email Extension Plugin Documentation](https://plugins.jenkins.io/email-ext/)
- [Jenkins Email Notification](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/#post)
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)

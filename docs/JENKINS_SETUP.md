# Hướng Dẫn Setup Jenkins CI/CD cho Playwright

## 📋 Mục Lục
1. [Cài Đặt Jenkins](#1-cài-đặt-jenkins)
2. [Cài Đặt Plugins Cần Thiết](#2-cài-đặt-plugins-cần-thiết)
3. [Cấu Hình Global Tools](#3-cấu-hình-global-tools)
4. [Tạo Jenkins Pipeline Job](#4-tạo-jenkins-pipeline-job)
5. [Cấu Hình Webhook (Optional)](#5-cấu-hình-webhook-optional)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Cài Đặt Jenkins

### Option A: Docker (Khuyến nghị)

```bash
# Pull Jenkins image
docker pull jenkins/jenkins:lts

# Run Jenkins container
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
```

### Option B: Cài Đặt Trực Tiếp

#### macOS
```bash
brew install jenkins-lts
brew services start jenkins-lts
```

#### Ubuntu/Debian
```bash
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt-get update
sudo apt-get install jenkins
sudo systemctl start jenkins
```

### Truy Cập Jenkins
1. Mở trình duyệt: `http://localhost:8080`
2. Lấy initial admin password:
   ```bash
   # Docker
   docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   
   # Local installation
   cat /var/lib/jenkins/secrets/initialAdminPassword
   ```
3. Chọn **"Install suggested plugins"**
4. Tạo admin user

---

## 2. Cài Đặt Plugins Cần Thiết

### Cách 1: Qua Jenkins UI
1. Vào **Dashboard** → **Manage Jenkins** → **Manage Plugins**
2. Chọn tab **Available**
3. Tìm và cài đặt các plugins sau:

#### Required Plugins
- ✅ **NodeJS Plugin** - Để chạy Node.js
- ✅ **Allure Jenkins Plugin** - Để hiển thị Allure reports
- ✅ **HTML Publisher Plugin** - Để publish HTML reports
- ✅ **JUnit Plugin** - Để hiển thị JUnit test results (thường đã có sẵn)

#### Optional Plugins
- 📧 **Email Extension Plugin** - Gửi email thông báo
- 🔔 **Slack Notification Plugin** - Gửi thông báo qua Slack
- 🐙 **GitHub Plugin** - Tích hợp với GitHub
- 🦊 **GitLab Plugin** - Tích hợp với GitLab

4. Click **Install without restart** hoặc **Download now and install after restart**

### Cách 2: Qua Jenkins CLI
```bash
# Download Jenkins CLI
wget http://localhost:8080/jnlpJars/jenkins-cli.jar

# Install plugins
java -jar jenkins-cli.jar -s http://localhost:8080/ install-plugin nodejs
java -jar jenkins-cli.jar -s http://localhost:8080/ install-plugin allure-jenkins-plugin
java -jar jenkins-cli.jar -s http://localhost:8080/ install-plugin htmlpublisher
```

---

## 3. Cấu Hình Global Tools

### 3.1 Cấu Hình NodeJS

1. Vào **Dashboard** → **Manage Jenkins** → **Global Tool Configuration**
2. Scroll xuống phần **NodeJS**
3. Click **Add NodeJS**
4. Cấu hình:
   - **Name**: `NodeJS 18` (phải khớp với tên trong Jenkinsfile)
   - **Version**: Chọn `NodeJS 18.x` hoặc cao hơn
   - ✅ Check **Install automatically**
5. Click **Save**

### 3.2 Cấu Hình Allure Commandline

1. Trong cùng trang **Global Tool Configuration**
2. Scroll xuống phần **Allure Commandline**
3. Click **Add Allure Commandline**
4. Cấu hình:
   - **Name**: `Allure`
   - **Version**: Chọn phiên bản mới nhất
   - ✅ Check **Install automatically**
5. Click **Save**

---

## 4. Tạo Jenkins Pipeline Job

### Bước 1: Tạo New Item
1. Vào **Dashboard** → **New Item**
2. Nhập tên job: `Playwright-Tests`
3. Chọn **Pipeline**
4. Click **OK**

### Bước 2: Cấu Hình Pipeline

#### Option A: Pipeline from SCM (Khuyến nghị)
1. Scroll xuống phần **Pipeline**
2. Chọn **Definition**: `Pipeline script from SCM`
3. **SCM**: Chọn `Git`
4. **Repository URL**: Nhập URL repository của bạn
   ```
   https://github.com/your-username/test-playwright-base.git
   ```
5. **Credentials**: Thêm credentials nếu repo private
6. **Branch Specifier**: `*/main` hoặc `*/master`
7. **Script Path**: `Jenkinsfile`
8. Click **Save**

#### Option B: Pipeline Script (Test nhanh)
1. Scroll xuống phần **Pipeline**
2. Chọn **Definition**: `Pipeline script`
3. Copy nội dung từ file `Jenkinsfile` vào ô **Script**
4. Click **Save**

### Bước 3: Cấu Hình Build Triggers (Optional)

#### Trigger tự động khi có commit
1. Trong job configuration, chọn tab **Build Triggers**
2. ✅ Check **Poll SCM**
3. **Schedule**: `H/5 * * * *` (check mỗi 5 phút)
4. Hoặc ✅ Check **GitHub hook trigger for GITScm polling** (nếu dùng GitHub)

---

## 5. Cấu Hình Webhook (Optional)

### GitHub Webhook
1. Vào repository trên GitHub
2. **Settings** → **Webhooks** → **Add webhook**
3. **Payload URL**: `http://your-jenkins-url:8080/github-webhook/`
4. **Content type**: `application/json`
5. **Events**: Chọn `Just the push event`
6. Click **Add webhook**

### GitLab Webhook
1. Vào project trên GitLab
2. **Settings** → **Webhooks**
3. **URL**: `http://your-jenkins-url:8080/project/Playwright-Tests`
4. **Trigger**: Check `Push events`
5. Click **Add webhook**

---

## 6. Troubleshooting

### ❌ Lỗi: "npx: command not found"
**Giải pháp**: Kiểm tra NodeJS đã được cấu hình đúng trong Global Tool Configuration

### ❌ Lỗi: "Allure command not found"
**Giải pháp**: 
1. Cài đặt Allure Commandline trong Global Tool Configuration
2. Hoặc thêm stage install allure:
```groovy
stage('Install Allure') {
    steps {
        sh 'npm install -g allure-commandline'
    }
}
```

### ❌ Lỗi: "Browser not found"
**Giải pháp**: Đảm bảo stage "Install Playwright Browsers" đang chạy:
```groovy
sh 'npx playwright install --with-deps'
```

### ❌ Lỗi: Permission denied khi chạy tests
**Giải pháp**: Thêm quyền execute cho Jenkins user:
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### ❌ Reports không hiển thị
**Giải pháp**: 
1. Kiểm tra plugins đã cài đặt đầy đủ
2. Vào **Manage Jenkins** → **Script Console** và chạy:
```groovy
System.setProperty("hudson.model.DirectoryBrowserSupport.CSP", "")
```

---

## 📊 Xem Test Reports

Sau khi build thành công, bạn có thể xem reports tại:

1. **Allure Report**: Click vào build → **Allure Report**
2. **JUnit Report**: Click vào build → **Test Result**
3. **HTML Report**: Click vào build → **Playwright HTML Report**

---

## 🎯 Best Practices

1. ✅ Sử dụng **Pipeline from SCM** thay vì Pipeline script
2. ✅ Enable **Build Triggers** để tự động chạy tests
3. ✅ Cấu hình **Email/Slack notifications** để nhận thông báo
4. ✅ Sử dụng **Docker agent** để đảm bảo môi trường consistent
5. ✅ Archive artifacts và reports để dễ dàng debug

---

## 📚 Tài Liệu Tham Khảo

- [Jenkins Official Documentation](https://www.jenkins.io/doc/)
- [Playwright Documentation](https://playwright.dev/)
- [Allure Jenkins Plugin](https://docs.qameta.io/allure/#_jenkins)
- [NodeJS Plugin](https://plugins.jenkins.io/nodejs/)

---

## 🆘 Cần Hỗ Trợ?

Nếu gặp vấn đề, hãy kiểm tra:
1. Jenkins logs: `http://localhost:8080/log/all`
2. Build console output trong từng build
3. System logs của Jenkins server

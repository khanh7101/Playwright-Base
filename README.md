# 🎭 Playwright Automation Framework với Allure Report

Framework tự động hóa kiểm thử Playwright tích hợp Allure Report, email thông báo tự động và hỗ trợ 6 nền tảng CI/CD.

## 📋 Mục Lục

- [Tính Năng](#-tính-năng)
- [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
- [Cài Đặt](#-cài-đặt)
- [Cấu Hình](#️-cấu-hình)
- [Sử Dụng](#-sử-dụng)
- [Viết Test](#-viết-test)
- [CI/CD](#-cicd)
- [Xử Lý Lỗi](#-xử-lý-lỗi)

---

## 🚀 Tính Năng

### Core Features
- ✅ **Allure Report** - Báo cáo HTML đẹp mắt với screenshots, videos, lịch sử test
- ✅ **Email Tự Động** - Gửi email báo cáo qua Gmail với template Handlebars
- ✅ **Multi-Browser** - Hỗ trợ Chromium, Firefox, WebKit
- ✅ **Multi-Environment** - Dễ dàng chuyển đổi giữa dev/staging/prod
- ✅ **Parallel Execution** - Chạy test song song để tăng tốc độ

### CI/CD Support
- ✅ **GitLab CI** - Template đầy đủ với GitLab Pages
- ✅ **GitHub Actions** - Workflow với GitHub Pages
- ✅ **Jenkins** - Jenkinsfile với Allure plugin
- ✅ **CircleCI** - Config với artifact storage
- ✅ **Azure Pipelines** - Pipeline với test results
- ✅ **Bitbucket Pipelines** - Config với downloads

### Developer Experience
- ✅ **TypeScript** - Type safety đầy đủ
- ✅ **Colored Logging** - Console output dễ đọc
- ✅ **Environment Validation** - Kiểm tra cấu hình trước khi chạy
- ✅ **Report Cleanup** - Tự động xóa report cũ
- ✅ **Documentation** - Hướng dẫn chi tiết cho mọi platform

---

## 💻 Yêu Cầu Hệ Thống

### Bắt Buộc
- **Node.js** 18 trở lên
- **npm** hoặc **yarn**
- **Java Runtime** (cho Allure CLI)

### Tùy Chọn
- **Gmail Account** với 2FA (cho email notifications)
- **CI/CD Platform** (GitLab, GitHub, Jenkins, etc.)

---

## 📦 Cài Đặt

### 1. Clone Repository

```bash
git clone git@gitlab.enouvo.com:enouvo/team-qa/playwright-code-base.git
cd playwright-code-base
```

### 2. Cài Dependencies

```bash
npm install
```

### 3. Cài Playwright Browsers

```bash
npx playwright install --with-deps
```

### 4. Cài Java (cho Allure)

**macOS (Homebrew):**
```bash
brew install openjdk@17
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

**Windows:**
- Download từ [Oracle Java](https://www.oracle.com/java/technologies/downloads/)
- Hoặc dùng [Chocolatey](https://chocolatey.org/): `choco install openjdk17`

**Verify Java:**
```bash
java -version
```

### 5. Tạo File .env

```bash
cp .env.example .env
```

---

## ⚙️ Cấu Hình

### Environment Variables

Mở file `.env` và cấu hình:

#### 1. Chọn Environment

```bash
# Development (mặc định)
TEST_ENV=dev
BASE_URL=https://dev.example.com

# Staging
# TEST_ENV=staging
# BASE_URL=https://staging.example.com

# Production
# TEST_ENV=prod
# BASE_URL=https://example.com
```

#### 2. Gmail SMTP (cho email notifications)

**Bước 1: Bật 2FA trên Gmail**
- Vào [Google Account Security](https://myaccount.google.com/security)
- Bật "2-Step Verification"

**Bước 2: Tạo App Password**
- Vào [App Passwords](https://myaccount.google.com/apppasswords)
- Chọn "Mail" và "Other"
- Copy mã 16 ký tự

**Bước 3: Cấu hình trong .env**
```bash
GMAIL_USER=automation@enouvo.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop  # 16 ký tự
```

#### 3. Email Recipients

```bash
# Người nhận khi test PASS
EMAIL_RECIPIENTS_PASSED=qa-team@enouvo.com,dev-team@enouvo.com

# Người nhận khi test FAIL (thường nhiều người hơn)
EMAIL_RECIPIENTS_FAILED=qa-team@enouvo.com,dev-team@enouvo.com,manager@enouvo.com
```

#### 4. Company Branding

```bash
COMPANY_NAME=Enouvo
COMPANY_WEBSITE=https://enouvo.com
COMPANY_LOGO_URL=https://i.ibb.co/yVnfHM0/LOGO-EIS-11.png
```

#### 5. Browser Configuration

```bash
# Chọn browsers để test
BROWSERS=chromium,firefox,webkit  # Tất cả browsers
# BROWSERS=chromium                # Chỉ Chromium
# BROWSERS=chromium,firefox        # Chromium và Firefox
```

#### 6. Parallel Execution

```bash
# Số workers chạy song song
WORKERS=1           # Chạy tuần tự (chậm nhưng ổn định)
# WORKERS=4         # 4 workers song song (nhanh)
# WORKERS=          # Auto (50% CPU cores)

# Chạy tất cả tests song song
FULLY_PARALLEL=false  # Tests trong cùng file chạy tuần tự
# FULLY_PARALLEL=true # Tất cả tests chạy song song
```

---

## 🎯 Sử Dụng

### Commands Cơ Bản

#### 1. Kiểm Tra Cấu Hình

```bash
npm run validate:env
```

Kiểm tra:
- ✅ File `.env` tồn tại
- ✅ Gmail credentials hợp lệ
- ✅ Allure CLI đã cài
- ✅ BASE_URL đúng format

#### 2. Chạy Tests

```bash
# Chạy tất cả tests
npm run test

# Chạy tests với tag cụ thể
npx playwright test --grep @smoke

# Chạy tests trong file cụ thể
npx playwright test tests/specs/examples/allure-demo.spec.ts
```

#### 3. Xem Allure Report

```bash
# Generate và mở report
npm run allure:generate
npm run allure:open

# Hoặc serve report trực tiếp
npm run allure:serve
```

#### 4. Chạy Full Workflow

```bash
# Chạy test + generate report + gửi email
npm run test:report
```

**Workflow này sẽ:**
1. Validate environment
2. Chạy Playwright tests
3. Generate Allure HTML report
4. Gửi email với link report
5. Cleanup reports cũ

#### 5. Cleanup Reports Cũ

```bash
npm run report:clean
```

Xóa reports cũ hơn `REPORT_RETENTION_DAYS` (mặc định: 30 ngày)

---

## 📝 Viết Test

### Basic Test với Allure

```typescript
import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test('Login thành công', async ({ page }) => {
  // Organize test
  await allure.epic('User Management');
  await allure.feature('Authentication');
  await allure.story('Login Flow');
  await allure.severity('critical');
  await allure.tag('smoke');
  
  // Test steps
  await test.step('Mở trang login', async () => {
    await page.goto('https://example.com/login');
    
    // Attach screenshot
    const screenshot = await page.screenshot();
    await allure.attachment('Login Page', screenshot, 'image/png');
  });
  
  await test.step('Nhập thông tin đăng nhập', async () => {
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'password123');
  });
  
  await test.step('Submit và verify', async () => {
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
  });
});
```

### Allure Annotations

#### Severity Levels
```typescript
await allure.severity('blocker');   // Chặn release
await allure.severity('critical');  // Lỗi nghiêm trọng
await allure.severity('normal');    // Lỗi thường
await allure.severity('minor');     // Lỗi nhỏ
await allure.severity('trivial');   // Lỗi không quan trọng
```

#### Tags
```typescript
await allure.tag('smoke');       // Smoke test
await allure.tag('regression');  // Regression test
await allure.tag('api');         // API test
```

#### Attachments
```typescript
// Screenshot
const screenshot = await page.screenshot();
await allure.attachment('Screenshot', screenshot, 'image/png');

// HTML
const html = await page.content();
await allure.attachment('Page HTML', html, 'text/html');

// JSON
const data = { user: 'test', status: 'active' };
await allure.attachment('User Data', JSON.stringify(data, null, 2), 'application/json');

// Text
await allure.attachment('Notes', 'Test completed successfully', 'text/plain');
```

#### Parameters
```typescript
await allure.parameter('Environment', 'staging');
await allure.parameter('Browser', 'chromium');
await allure.parameter('User Role', 'admin');
```

### Example Test Structure

Xem file mẫu: `tests/specs/examples/allure-demo.spec.ts`

---

## 🔄 CI/CD

### So Sánh Platforms

| Platform | Độ Phức Tạp | Phù Hợp Với | Free Tier |
|----------|-------------|-------------|-----------|
| **GitLab CI** | ⭐⭐ Dễ | Enouvo, Enterprise | Unlimited |
| **GitHub Actions** | ⭐⭐ Dễ | Open Source | 2000 phút/tháng |
| **Jenkins** | ⭐⭐⭐⭐ Khó | Enterprise, Custom | Self-hosted |
| **CircleCI** | ⭐⭐⭐ Trung bình | Startups | Limited credits |
| **Azure Pipelines** | ⭐⭐⭐ Trung bình | Microsoft stack | 1800 phút/tháng |
| **Bitbucket** | ⭐⭐⭐ Trung bình | Atlassian | 50 phút/tháng |

### Setup GitLab CI (Recommended cho Enouvo)

#### 1. Copy Template

```bash
cp .ci-templates/gitlab/.gitlab-ci.yml .
```

#### 2. Cấu Hình CI/CD Variables

Vào **Settings > CI/CD > Variables** và thêm:

| Variable | Value | Protected | Masked |
|----------|-------|-----------|--------|
| `GMAIL_USER` | automation@enouvo.com | ✅ | ❌ |
| `GMAIL_APP_PASSWORD` | 16-ký-tự-password | ✅ | ✅ |
| `EMAIL_RECIPIENTS_PASSED` | qa@enouvo.com | ❌ | ❌ |
| `EMAIL_RECIPIENTS_FAILED` | qa@enouvo.com,manager@enouvo.com | ❌ | ❌ |
| `TEST_ENV` | dev | ❌ | ❌ |
| `BASE_URL` | https://dev.example.com | ❌ | ❌ |

#### 3. Enable GitLab Pages

- Vào **Settings > Pages**
- Pages sẽ tự động enable sau lần chạy pipeline đầu tiên

#### 4. Push và Chạy

```bash
git add .gitlab-ci.yml
git commit -m "Add GitLab CI pipeline"
git push
```

#### 5. Xem Report

Report sẽ có tại:
```
https://enouvo.gitlab.io/team-qa/playwright-code-base/reports/{pipeline-id}
```

### Setup Platforms Khác

Xem hướng dẫn chi tiết trong:
- **GitLab CI**: `.ci-templates/gitlab/README.md`
- **GitHub Actions**: `.ci-templates/github/README.md`
- **Jenkins**: `.ci-templates/jenkins/README.md`
- **CircleCI**: `.ci-templates/circleci/README.md`
- **Azure Pipelines**: `.ci-templates/azure/README.md`
- **Bitbucket**: `.ci-templates/bitbucket/README.md`

---

## 🔧 Xử Lý Lỗi

### Email Không Gửi Được

**Nguyên nhân:**
- Gmail credentials sai
- 2FA chưa bật
- App Password không đúng format

**Giải pháp:**
```bash
# 1. Kiểm tra credentials
npm run validate:env

# 2. Verify App Password có 16 ký tự
echo $GMAIL_APP_PASSWORD | wc -c  # Phải là 17 (16 + newline)

# 3. Test email riêng
node -e "console.log(process.env.GMAIL_USER)"
```

### Allure Report Không Generate

**Nguyên nhân:**
- Java chưa cài
- Allure CLI không tìm thấy

**Giải pháp:**
```bash
# 1. Kiểm tra Java
java -version

# 2. Cài Java nếu chưa có
brew install openjdk@17  # macOS

# 3. Kiểm tra Allure
npx allure --version

# 4. Reinstall nếu cần
npm install
```

### Tests Fail Trong CI Nhưng Pass Ở Local

**Nguyên nhân:**
- Browser version khác nhau
- BASE_URL không accessible từ CI
- Timing issues

**Giải pháp:**
```typescript
// 1. Thêm explicit waits
await page.waitForLoadState('networkidle');

// 2. Increase timeout
test.setTimeout(60000);  // 60 seconds

// 3. Check environment
console.log('Testing on:', process.env.BASE_URL);
```

### Port Conflict (Report Server)

**Nguyên nhân:**
- Port 8080 đang được sử dụng

**Giải pháp:**
```bash
# Đổi port trong .env
REPORT_SERVER_PORT=8081

# Hoặc kill process đang dùng port
lsof -ti:8080 | xargs kill -9
```

---

## 📚 Tài Liệu Tham Khảo

### Internal Docs
- [CI/CD Overview](./.ci-templates/README.md)
- [GitLab CI Setup](./.ci-templates/gitlab/README.md)
- [GitHub Actions Setup](./.ci-templates/github/README.md)

### External Resources
- [Playwright Documentation](https://playwright.dev/)
- [Allure Framework](https://docs.qameta.io/allure/)
- [Gmail App Passwords](https://myaccount.google.com/apppasswords)

---

## 📁 Cấu Trúc Project

```
playwright-code-base/
├── .ci-templates/          # CI/CD templates cho 6 platforms
│   ├── gitlab/            # GitLab CI
│   ├── github/            # GitHub Actions
│   ├── jenkins/           # Jenkins
│   ├── circleci/          # CircleCI
│   ├── azure/             # Azure Pipelines
│   └── bitbucket/         # Bitbucket Pipelines
├── config/
│   ├── capabilities/      # Browser configs
│   ├── environments/      # Environment configs (dev/staging/prod)
│   ├── reporters/         # Reporter configs
│   └── views/             # Email templates (Handlebars)
├── scripts/
│   ├── utils/             # Utility functions
│   ├── email-sender.ts    # Email notification logic
│   ├── test-runner.ts     # Main orchestration
│   ├── validate-env.ts    # Environment validation
│   └── cleanup-reports.ts # Report cleanup
├── tests/
│   ├── specs/             # Test files
│   │   ├── examples/      # Example tests với Allure
│   │   └── website/       # Website tests
│   ├── support/           # Test helpers
│   └── hooks/             # Global setup/teardown
├── pages/                 # Page Object Models
├── .env.example           # Environment template
├── playwright.config.ts   # Playwright config
└── package.json
```

---

## 🎯 Quick Start Checklist

- [ ] Clone repository
- [ ] `npm install`
- [ ] `npx playwright install --with-deps`
- [ ] Cài Java (`brew install openjdk@17`)
- [ ] `cp .env.example .env`
- [ ] Cấu hình Gmail credentials trong `.env`
- [ ] `npm run validate:env`
- [ ] `npm run test`
- [ ] `npm run allure:generate && npm run allure:open`
- [ ] Setup CI/CD platform (optional)

---

## 👥 Team

**Enouvo QA Team**

---

## 📝 License

ISC

---

**Cần hỗ trợ?** Liên hệ QA team hoặc xem documentation trong `./docs/`

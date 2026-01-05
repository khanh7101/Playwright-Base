import type { PlaywrightTestConfig } from '@playwright/test';

/**
 * Base Configuration
 * Shared defaults for all test environments
 */
export const baseConfig: Partial<PlaywrightTestConfig> = {
    /**
     * testDir: Thư mục chứa các file test (*.spec.ts)
     */
    testDir: './tests/specs',

    /**
     * retries: Số lần retry khi test fail
     * - 0: Không retry (development)
     * - 1-2: Retry cho CI/CD để tránh flaky tests
     */
    retries: process.env.CI ? 2 : 0,

    /**
     * fullyParallel: Chạy tất cả tests song song
     * - true: Tất cả tests chạy song song (nhanh nhưng cần cẩn thận với shared state)
     * - false: Tests trong cùng file chạy tuần tự
     */
    fullyParallel: false,

    /**
     * forbidOnly: Fail build nếu có test.only (tránh commit nhầm)
     */
    forbidOnly: !!process.env.CI,

    /**
     * workers: Số lượng worker processes chạy song song
     * - undefined: Tự động (50% CPU cores)
     * - 1: Chạy tuần tự (debug hoặc tests có dependencies)
     * - N: Chạy N tests cùng lúc
     */
    workers: process.env.CI ? 1 : undefined,

    /**
     * expect: Cấu hình cho assertions
     */
    expect: {
        /**
         * timeout: Thời gian tối đa cho expect() chờ condition đúng (ms)
         */
        timeout: 60000, // 60 giây

        /**
         * toHaveScreenshot: Cấu hình cho screenshot comparison
         */
        toHaveScreenshot: {
            maxDiffPixels: 120000, // Số pixel khác biệt tối đa được chấp nhận
        },

        /**
         * toMatchSnapshot: Cấu hình cho snapshot comparison
         */
        toMatchSnapshot: {
            maxDiffPixelRatio: 0.1, // Tỷ lệ pixel khác biệt (0-1), 0.1 = 10%
        },
    },

    /**
     * use: Cấu hình chung cho tất cả tests
     */
    use: {
        /**
         * headless: Chạy browser ẩn (không hiển thị UI)
         * - true: Chạy nhanh, dùng cho CI/CD
         * - false: Hiển thị browser, dùng khi debug
         */
        headless: process.env.CI ? true : false,

        /**
         * viewport: Kích thước cửa sổ browser
         * - { width: 1280, height: 720 }: Kích thước cố định
         * - null: Dùng kích thước mặc định của browser
         */
        viewport: { width: 1280, height: 1080 },

        /**
         * trace: Thu thập trace để debug
         * - 'off': Không thu thập
         * - 'on': Luôn thu thập (chậm)
         * - 'on-first-retry': Chỉ thu thập khi retry
         * - 'retain-on-failure': Giữ lại khi fail
         */
        trace: 'on-first-retry',

        /**
         * screenshot: Chụp ảnh màn hình
         * - 'off': Không chụp
         * - 'on': Luôn chụp
         * - 'only-on-failure': Chỉ chụp khi fail
         */
        screenshot: 'only-on-failure',

        /**
         * video: Quay video
         * - 'off': Không quay
         * - 'on': Luôn quay
         * - 'retain-on-failure': Giữ lại khi fail
         * - 'on-first-retry': Chỉ quay khi retry
         */
        video: 'retain-on-failure',

        /**
         * actionTimeout: Timeout cho mỗi action (click, fill, etc.) - ms
         */
        actionTimeout: 60000, // 60 giây

        /**
         * navigationTimeout: Timeout cho navigation (goto, reload, etc.) - ms
         */
        navigationTimeout: 120000, // 120 giây

        /**
         * launchOptions: Tùy chọn khi khởi động browser
         */
        launchOptions: {
            args: [
                '--start-maximized', // Mở browser full màn hình
                // '--disable-web-security', // Tắt CORS (chỉ dùng khi cần thiết)
            ],
        },

        /**
         * contextOptions: Tùy chọn cho browser context
         */
        contextOptions: {
            /**
             * permissions: Cấp quyền cho browser
             * VD: clipboard-read, geolocation, notifications, etc.
             */
            permissions: ['clipboard-read', 'clipboard-write'],
        },

        /**
         * storageState: Load authentication state từ file
         * Dùng để tránh login lại mỗi test
         * Uncomment khi đã có file state.json:
         */
        // storageState: 'state.json',
    },

    /**
     * globalSetup: File chạy 1 lần trước tất cả tests
     * Dùng để setup database, authentication, etc.
     * Uncomment khi cần:
     */
    // globalSetup: './tests/hooks/globalSetup.ts',

    /**
     * globalTeardown: File chạy 1 lần sau tất cả tests
     * Dùng để cleanup
     */
    // globalTeardown: './tests/hooks/globalTeardown.ts',
};

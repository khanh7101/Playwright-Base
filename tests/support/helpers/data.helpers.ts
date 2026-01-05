/**
 * Data Helpers
 * Utility functions for generating test data
 */

/**
 * Generate random string
 * @param length Length of the string
 * @returns Random string
 */
export function randomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Generate random email
 * @param domain Email domain (default: 'example.com')
 * @returns Random email address
 */
export function randomEmail(domain: string = 'example.com'): string {
    return `test_${randomString(8)}@${domain}`;
}

/**
 * Generate random number in range
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @returns Random number
 */
export function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate timestamp-based unique ID
 * @returns Unique ID string
 */
export function uniqueId(): string {
    return `${Date.now()}_${randomString(6)}`;
}

/**
 * Format date to string
 * @param date Date object
 * @param format Format string (default: 'YYYY-MM-DD')
 * @returns Formatted date string
 */
export function formatDate(date: Date = new Date(), format: string = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day);
}

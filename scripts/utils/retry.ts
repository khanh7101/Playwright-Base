/**
 * Retry logic for operations that may fail temporarily
 */
export async function retry<T>(
    fn: () => Promise<T>,
    options: {
        maxAttempts?: number;
        delayMs?: number;
        onRetry?: (attempt: number, error: Error) => void;
    } = {}
): Promise<T> {
    const { maxAttempts = 3, delayMs = 1000, onRetry } = options;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxAttempts) {
                throw error;
            }

            if (onRetry) {
                onRetry(attempt, error as Error);
            }

            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
        }
    }

    throw new Error('Retry failed - this should never happen');
}

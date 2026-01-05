/**
 * Global Teardown
 * Runs once after all tests
 * 
 * Use this for:
 * - Cleanup operations
 * - Stopping services
 * - Removing test data
 * - Generating final reports
 */

async function globalTeardown() {
    console.log('🧹 Running global teardown...');

    // Example: Cleanup operations
    // const fs = require('fs');
    // if (fs.existsSync('state.json')) {
    //   fs.unlinkSync('state.json');
    // }

    console.log('✅ Global teardown completed');
}

export default globalTeardown;

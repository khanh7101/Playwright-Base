import { devConfig } from './dev';
import { prodConfig } from './prod';
import { stagingConfig } from './staging';

/**
 * Environment Configurations
 * Export all environment configs
 */
export { devConfig } from './dev';
export { stagingConfig } from './staging';
export { prodConfig } from './prod';

/**
 * Get current environment config based on NODE_ENV
 * Default to dev if not specified
 */
export const getCurrentEnvConfig = () => {
    const env = process.env.NODE_ENV || 'DEV';

    switch (env.toUpperCase()) {
        case 'PROD':
        case 'PRODUCTION':
            return prodConfig;
        case 'STAGING':
            return stagingConfig;
        case 'DEV':
        case 'DEVELOPMENT':
        default:
            return devConfig;
    }
};

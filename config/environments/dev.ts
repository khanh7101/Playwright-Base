import { getEnvFunction } from '../../tests/support/helpers/env.helpers';

/**
 * Development Environment Configuration
 */
export const devConfig = {
    use: {
        baseURL: getEnvFunction().baseURL,
    },
};

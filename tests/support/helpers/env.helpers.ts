export const getEnvFunction = () => {
    // Specify environment: PROD or DEV (default is DEV)
    const env = process.env.NODE_ENV === 'PROD' ? 'PROD' : 'DEV';

    return {
        userName: process.env[`USERNAME_${env}`] as string,
        password: process.env[`PASSWORD_${env}`] as string,
        baseURL: process.env[`${env}_ENV`] as string,
    };
};

import chalk from 'chalk';

/**
 * Logger utility with colored output
 */
export class Logger {
    static info(message: string) {
        console.log(chalk.blue('ℹ'), message);
    }

    static success(message: string) {
        console.log(chalk.green('✅'), message);
    }

    static warning(message: string) {
        console.log(chalk.yellow('⚠️'), message);
    }

    static error(message: string, error?: Error) {
        console.error(chalk.red('❌'), message);
        if (error) {
            console.error(chalk.red(error.stack || error.message));
        }
    }

    static step(message: string) {
        console.log(chalk.cyan('→'), message);
    }

    static debug(message: string) {
        if (process.env.DEBUG) {
            console.log(chalk.gray('🔍'), message);
        }
    }
}

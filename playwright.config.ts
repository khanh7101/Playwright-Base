import type { PlaywrightTestConfig } from '@playwright/test';
import 'dotenv/config';
import { baseConfig } from './config/base.config';
import { defaultBrowsers } from './config/capabilities';
import { getCurrentEnvConfig } from './config/environments';
import { reporters } from './config/reporters';

const config: PlaywrightTestConfig = {
  ...baseConfig,
  ...getCurrentEnvConfig(),

  reporter: reporters as any,
  projects: defaultBrowsers,
};

export default config;

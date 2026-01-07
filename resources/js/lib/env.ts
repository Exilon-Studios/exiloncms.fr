/**
 * Environment Variables Validation with T3 Env + Zod
 * Type-safe env with runtime validation
 */

import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Client-side environment variables (exposed to browser)
   * Must be prefixed with VITE_
   */
  clientPrefix: 'VITE_',

  client: {
    VITE_APP_NAME: z.string().default('ExilonCMS'),
    VITE_APP_ENV: z.enum(['local', 'development', 'staging', 'production']).default('production'),
    VITE_APP_DEBUG: z.string().transform((val) => val === 'true').default('false'),
  },

  /**
   * Runtime environment variables
   * Values come from import.meta.env (Vite)
   */
  runtimeEnv: import.meta.env,

  /**
   * Skip validation in production builds
   */
  skipValidation: import.meta.env.PROD,
});

// Export typed env for use across the app
export type Env = typeof env;

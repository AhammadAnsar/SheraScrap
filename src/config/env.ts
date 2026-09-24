/**
 * Centralized Environment Configuration
 * Single authoritative source for runtime environment variables, site domain, and mode detection.
 * Enforces strict environment separation (development / staging / production).
 */

import { SITE_CONFIG } from './site';

export interface AppEnvironment {
  nodeEnv: 'development' | 'staging' | 'production';
  isProduction: boolean;
  isDevelopment: boolean;
  isStaging: boolean;
  port: number;
  siteUrl: string;
  appUrl: string;
  hasGeminiKey: boolean;
}

function getNodeEnv(): 'development' | 'staging' | 'production' {
  const env = (typeof process !== 'undefined' && process.env && process.env.NODE_ENV) || 'development';
  if (env === 'production' || env === 'staging') {
    return env;
  }
  return 'development';
}

function getPort(): number {
  if (typeof process !== 'undefined' && process.env && process.env.PORT) {
    const p = parseInt(process.env.PORT, 10);
    if (!isNaN(p) && p > 0) return p;
  }
  return 3000;
}

function getSiteUrl(): string {
  // Always defaults to the canonical production domain according to System Instructions
  if (typeof process !== 'undefined' && process.env && process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/+$/, '');
  }
  return SITE_CONFIG.canonicalDomain;
}

function getAppUrl(): string {
  if (typeof process !== 'undefined' && process.env && process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/+$/, '');
  }
  return getSiteUrl();
}

const currentEnv = getNodeEnv();

export const ENV: AppEnvironment = {
  nodeEnv: currentEnv,
  isProduction: currentEnv === 'production',
  isDevelopment: currentEnv === 'development',
  isStaging: currentEnv === 'staging',
  port: getPort(),
  siteUrl: getSiteUrl(),
  appUrl: getAppUrl(),
  hasGeminiKey: typeof process !== 'undefined' && Boolean(process.env && process.env.GEMINI_API_KEY),
};

/**
 * Global constant for canonical production site URL
 */
export const SITE_URL = ENV.siteUrl;

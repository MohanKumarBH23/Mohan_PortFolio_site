/**
 * @fileoverview Environment Configuration Resolver & Schema Validator.
 * Separates environment variables from application code, resolves the active
 * profile (`development` | `staging` | `production`), validates required keys,
 * and exposes a deeply frozen configuration object.
 */

import './runtimeEnv.js';
import { ConfigError } from '../core/errors.js';

const VALID_ENVIRONMENTS = new Set(['development', 'staging', 'production']);
const VALID_LOG_LEVELS = new Set(['debug', 'info', 'warn', 'error', 'silent']);

/**
 * Recursively freezes an object graph to prevent accidental runtime mutation.
 *
 * @template T
 * @param {T} obj
 * @returns {Readonly<T>}
 */
function deepFreeze(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  Object.freeze(obj);
  for (const value of Object.values(obj)) {
    deepFreeze(value);
  }
  return obj;
}

/**
 * Validates that a URL string (when non-empty) uses HTTPS or HTTP (in dev).
 *
 * @param {string} url
 * @param {string} fieldName
 * @param {string} envName
 */
function assertValidUrl(url, fieldName, envName) {
  if (!url) return;
  let parsed;
  try {
    parsed = new URL(url);
  } catch (err) {
    throw new ConfigError(`Invalid URL configured for ${fieldName}: "${url}"`, {
      cause: err,
      details: { fieldName }
    });
  }

  const allowedProtocols = envName === 'development' ? ['https:', 'http:'] : ['https:'];
  if (!allowedProtocols.includes(parsed.protocol)) {
    throw new ConfigError(
      `Unsupported protocol "${parsed.protocol}" for ${fieldName} in ${envName}`,
      { details: { fieldName, protocol: parsed.protocol } }
    );
  }
}

/**
 * Resolves the active environment name from explicit config or browser hostname.
 *
 * @param {object} rawEnv
 * @param {string} [hostname]
 * @returns {'development' | 'staging' | 'production'}
 */
export function resolveEnvironmentName(rawEnv, hostname = '') {
  const explicit = rawEnv?.appEnv || rawEnv?.APP_ENV;
  if (explicit && VALID_ENVIRONMENTS.has(explicit)) {
    return explicit;
  }

  const normalizedHost = String(hostname || '').toLowerCase();
  if (!normalizedHost || normalizedHost === 'localhost' || normalizedHost === '127.0.0.1' || normalizedHost === '0.0.0.0') {
    return 'development';
  }

  const stagingHosts = rawEnv?.environments?.staging?.hostnames || [];
  if (stagingHosts.some((domain) => normalizedHost.endsWith(domain))) {
    return 'staging';
  }

  return 'production';
}

/**
 * Validates and builds a frozen runtime config object.
 *
 * @param {object} rawConfig - Raw runtime payload (defaults to `globalThis.__PORTFOLIO_RUNTIME_ENV__`).
 * @param {{ hostname?: string }} [context] - Optional runtime context for testing.
 * @returns {Readonly<object>} Validated frozen application configuration.
 * @throws {ConfigError} When configuration values fail schema validation.
 */
export function createAppConfig(rawConfig, context = {}) {
  const source = rawConfig || globalThis.__PORTFOLIO_RUNTIME_ENV__;
  if (!source || typeof source !== 'object') {
    throw new ConfigError(
      'Runtime environment configuration is missing. Ensure runtimeEnv.js is loaded or run `npm run env:build`.'
    );
  }

  const hostname =
    context.hostname ??
    (typeof globalThis.location !== 'undefined' ? globalThis.location.hostname : '');
  const envName = resolveEnvironmentName(source, hostname);
  const envProfile = source.environments?.[envName] || {};

  const timeoutMs = Number(source.api?.timeoutMs ?? 8000);
  if (!Number.isFinite(timeoutMs) || timeoutMs < 500 || timeoutMs > 60000) {
    throw new ConfigError(`Invalid api.timeoutMs: ${timeoutMs}. Expected 500..60000 ms.`);
  }

  const maxRetries = Number(source.api?.maxRetries ?? 2);
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) {
    throw new ConfigError(`Invalid api.maxRetries: ${maxRetries}. Expected integer 0..5.`);
  }

  const retryDelayMs = Number(source.api?.retryDelayMs ?? 500);
  if (!Number.isFinite(retryDelayMs) || retryDelayMs < 0) {
    throw new ConfigError(`Invalid api.retryDelayMs: ${retryDelayMs}.`);
  }

  const cooldownMs = Number(source.contact?.cooldownMs ?? 30000);
  if (!Number.isFinite(cooldownMs) || cooldownMs < 0) {
    throw new ConfigError(`Invalid contact.cooldownMs: ${cooldownMs}.`);
  }

  const googleAppsScriptUrl = String(source.api?.endpoints?.googleAppsScriptUrl || '').trim();
  const formSubmitUrl = String(source.api?.endpoints?.formSubmitUrl || '').trim();
  const baseUrl = String(source.api?.baseUrl || '').trim();

  assertValidUrl(googleAppsScriptUrl, 'api.endpoints.googleAppsScriptUrl', envName);
  assertValidUrl(formSubmitUrl, 'api.endpoints.formSubmitUrl', envName);
  assertValidUrl(baseUrl, 'api.baseUrl', envName);

  const logLevel = source.overrides?.logLevel || envProfile.logLevel || 'info';
  if (!VALID_LOG_LEVELS.has(logLevel)) {
    throw new ConfigError(`Invalid logLevel "${logLevel}".`);
  }

  if (!source.storage?.inquiriesKey || !source.storage?.cooldownKey) {
    throw new ConfigError('Missing required storage key definitions in environment config.');
  }

  const resolvedConfig = {
    env: envName,
    isDevelopment: envName === 'development',
    isProduction: envName === 'production',
    appName: source.appName || 'Portfolio',
    appVersion: source.appVersion || '2.0.0',
    siteUrl: source.siteUrl || '',
    contactRecipientEmail: source.contactRecipientEmail || '',
    api: {
      baseUrl,
      timeoutMs,
      maxRetries,
      retryDelayMs,
      endpoints: {
        googleAppsScriptUrl,
        formSubmitUrl
      }
    },
    contact: {
      cooldownMs,
      maxHistory: Number(source.contact?.maxHistory ?? 50),
      locale: source.contact?.locale || 'en-IN',
      timeZone: source.contact?.timeZone || 'Asia/Kolkata'
    },
    storage: {
      inquiriesKey: source.storage.inquiriesKey,
      cooldownKey: source.storage.cooldownKey
    },
    observability: {
      logLevel
    }
  };

  return deepFreeze(resolvedConfig);
}

let cachedConfig = null;

/**
 * Returns the validated singleton application config.
 *
 * @returns {Readonly<object>}
 */
export function getAppConfig() {
  if (!cachedConfig) {
    cachedConfig = createAppConfig();
  }
  return cachedConfig;
}


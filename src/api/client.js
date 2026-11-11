/**
 * @fileoverview Scalable, Resilient HTTP API Client.
 * Features AbortController request timeouts, exponential backoff retries with jitter,
 * request/response interceptors, safe JSON/text parsing, and typed error normalization.
 */

import { ApiError, NetworkError, TimeoutError, normalizeError } from '../core/errors.js';

const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);

/**
 * Delays execution for `ms` milliseconds.
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Resolves a relative endpoint path against `baseUrl` or returns an absolute URL intact.
 *
 * @param {string} baseUrl
 * @param {string} target
 * @returns {string}
 */
function resolveUrl(baseUrl, target) {
  if (/^https?:\/\//i.test(target)) {
    return target;
  }
  const cleanBase = (baseUrl || '').replace(/\/+$/, '');
  const cleanTarget = target.startsWith('/') ? target : `/${target}`;
  return `${cleanBase}${cleanTarget}`;
}

/**
 * Safely parses an HTTP Response body as JSON (falling back to plain text).
 *
 * @param {Response} response
 * @returns {Promise<unknown>}
 */
async function parseResponseBody(response) {
  if (response.type === 'opaque' || response.status === 204) {
    return null;
  }

  const contentType = (response.headers?.get?.('content-type') || '').toLowerCase();
  const rawText = await response.text().catch(() => '');
  if (!rawText) return null;

  if (contentType.includes('application/json') || rawText.trim().startsWith('{') || rawText.trim().startsWith('[')) {
    try {
      return JSON.parse(rawText);
    } catch {
      return rawText;
    }
  }
  return rawText;
}

/**
 * Reusable Fetch-backed HTTP client for portfolio APIs and external webhooks.
 */
export class ApiClient {
  /**
   * @param {object} [options]
   * @param {string} [options.baseUrl='']
   * @param {number} [options.timeoutMs=8000]
   * @param {number} [options.maxRetries=2]
   * @param {number} [options.retryDelayMs=500]
   * @param {Record<string, string>} [options.defaultHeaders]
   * @param {typeof fetch} [options.fetchImpl]
   * @param {object} [options.logger]
   */
  constructor({
    baseUrl = '',
    timeoutMs = 8000,
    maxRetries = 2,
    retryDelayMs = 500,
    defaultHeaders = {},
    fetchImpl,
    logger
  } = {}) {
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
    this.maxRetries = maxRetries;
    this.retryDelayMs = retryDelayMs;
    this.defaultHeaders = { Accept: 'application/json', ...defaultHeaders };
    this.fetchImpl = fetchImpl || globalThis.fetch?.bind(globalThis);
    this.logger = logger;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  /**
   * Registers a request interceptor `(context) => context | Promise<context>`.
   *
   * @param {Function} interceptor
   * @returns {() => void} Unregister function.
   */
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
    return () => {
      this.requestInterceptors = this.requestInterceptors.filter((fn) => fn !== interceptor);
    };
  }

  /**
   * Registers a response interceptor `(result) => result | Promise<result>`.
   *
   * @param {Function} interceptor
   * @returns {() => void} Unregister function.
   */
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
    return () => {
      this.responseInterceptors = this.responseInterceptors.filter((fn) => fn !== interceptor);
    };
  }

  /**
   * Executes an HTTP request with timeouts, interceptors, and retry logic.
   *
   * @param {string} endpoint
   * @param {object} [options]
   * @param {string} [options.method='GET']
   * @param {Record<string, string>} [options.headers]
   * @param {unknown} [options.body]
   * @param {RequestMode} [options.mode]
   * @param {number} [options.timeoutMs]
   * @param {number} [options.retries]
   * @param {boolean} [options.retryable=true]
   * @returns {Promise<{ ok: boolean, status: number, opaque: boolean, data: unknown, meta: { durationMs: number, attempts: number } }>}
   */
  async request(endpoint, options = {}) {
    if (typeof this.fetchImpl !== 'function') {
      throw new NetworkError('Fetch API is not available in the current runtime.');
    }

    let requestContext = {
      url: resolveUrl(this.baseUrl, endpoint),
      method: (options.method || 'GET').toUpperCase(),
      headers: { ...this.defaultHeaders, ...options.headers },
      body: options.body,
      mode: options.mode,
      timeoutMs: options.timeoutMs ?? this.timeoutMs,
      retries: options.retryable === false ? 0 : (options.retries ?? this.maxRetries)
    };

    for (const interceptor of this.requestInterceptors) {
      requestContext = (await interceptor(requestContext)) || requestContext;
    }

    const totalAttempts = requestContext.retries + 1;
    let lastError = null;

    for (let attempt = 1; attempt <= totalAttempts; attempt++) {
      const startedAt = Date.now();
      const controller = new AbortController();
      const timeoutHandle = setTimeout(() => controller.abort(), requestContext.timeoutMs);

      try {
        const fetchOptions = {
          method: requestContext.method,
          headers: requestContext.headers,
          signal: controller.signal
        };

        if (requestContext.mode) {
          fetchOptions.mode = requestContext.mode;
        }

        if (requestContext.body !== undefined && requestContext.method !== 'GET' && requestContext.method !== 'HEAD') {
          if (
            typeof requestContext.body === 'object' &&
            !(requestContext.body instanceof FormData) &&
            !(requestContext.body instanceof URLSearchParams)
          ) {
            fetchOptions.headers = {
              'Content-Type': 'application/json',
              ...fetchOptions.headers
            };
            fetchOptions.body = JSON.stringify(requestContext.body);
          } else {
            fetchOptions.body = requestContext.body;
          }
        }

        const response = await this.fetchImpl(requestContext.url, fetchOptions);
        const durationMs = Date.now() - startedAt;

        if (response.type === 'opaque') {
          const opaqueResult = {
            ok: true,
            status: 0,
            opaque: true,
            data: null,
            meta: { durationMs, attempts: attempt }
          };
          return this.#runResponseInterceptors(opaqueResult);
        }

        const data = await parseResponseBody(response);

        if (!response.ok) {
          const error = new ApiError(
            `API request to ${requestContext.url} failed with HTTP ${response.status}`,
            {
              statusCode: response.status,
              endpoint: requestContext.url,
              responseBody: data
            }
          );

          if (attempt < totalAttempts && RETRYABLE_STATUS_CODES.has(response.status)) {
            lastError = error;
            await this.#backoff(attempt, requestContext.url, error);
            continue;
          }
          throw error;
        }

        const result = {
          ok: true,
          status: response.status,
          opaque: false,
          data,
          meta: { durationMs, attempts: attempt }
        };
        return this.#runResponseInterceptors(result);
      } catch (err) {
        const normalized = err?.name === 'AbortError'
          ? new TimeoutError(requestContext.timeoutMs, `Request to ${requestContext.url} timed out after ${requestContext.timeoutMs}ms`, { cause: err })
          : normalizeError(err);

        lastError = normalized;
        const canRetry =
          attempt < totalAttempts &&
          (normalized instanceof NetworkError ||
            normalized instanceof TimeoutError ||
            (normalized instanceof ApiError && RETRYABLE_STATUS_CODES.has(normalized.statusCode)));

        if (canRetry) {
          await this.#backoff(attempt, requestContext.url, normalized);
          continue;
        }

        throw normalized;
      } finally {
        clearTimeout(timeoutHandle);
      }
    }

    throw lastError || new NetworkError('API request exhausted all retry attempts.');
  }

  async #backoff(attempt, url, error) {
    const jitter = Math.floor(Math.random() * 150);
    const delay = this.retryDelayMs * Math.pow(2, attempt - 1) + jitter;
    this.logger?.warn(`Retrying API request (${attempt}) to ${url} in ${delay}ms`, {
      reason: error.message
    });
    await sleep(delay);
  }

  async #runResponseInterceptors(result) {
    let current = result;
    for (const interceptor of this.responseInterceptors) {
      current = (await interceptor(current)) || current;
    }
    return current;
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}


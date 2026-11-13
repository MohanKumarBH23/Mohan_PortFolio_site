/**
 * @fileoverview Typed Error Hierarchy & Error Normalization Helpers.
 * Provides structured operational errors across configuration, validation,
 * network transport, and API layers.
 */

/**
 * Base operational error class for the portfolio application.
 */
export class AppError extends Error {
  /**
   * @param {string} message - Human-readable error summary.
   * @param {object} [options]
   * @param {string} [options.code='APP_ERROR'] - Machine-readable error code.
   * @param {number} [options.statusCode=500] - Associated HTTP-like status code.
   * @param {object} [options.details] - Structured contextual metadata.
   * @param {unknown} [options.cause] - Underlying root cause error.
   * @param {boolean} [options.isOperational=true] - Whether error is expected/recoverable.
   */
  constructor(message, options = {}) {
    super(message, options.cause ? { cause: options.cause } : undefined);
    this.name = this.constructor.name;
    this.code = options.code || 'APP_ERROR';
    this.statusCode = options.statusCode ?? 500;
    this.details = options.details || null;
    this.isOperational = options.isOperational ?? true;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Serializes the error into a log-safe plain object.
   *
   * @returns {object}
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}

/** Raised when environment or runtime configuration is missing or invalid. */
export class ConfigError extends AppError {
  constructor(message, options = {}) {
    super(message, {
      code: options.code || 'CONFIG_ERROR',
      statusCode: 500,
      isOperational: false,
      ...options
    });
  }
}

/** Raised when user or payload validation fails; includes per-field error map. */
export class ValidationError extends AppError {
  /**
   * @param {string} message
   * @param {Record<string, string>} [fieldErrors={}]
   * @param {object} [options]
   */
  constructor(message, fieldErrors = {}, options = {}) {
    super(message, {
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      details: { fieldErrors },
      ...options
    });
    this.fieldErrors = fieldErrors;
  }
}

/** Raised when client-side or server-side rate limits prevent an action. */
export class RateLimitError extends AppError {
  /**
   * @param {string} message
   * @param {number} retryAfterSeconds
   * @param {object} [options]
   */
  constructor(message, retryAfterSeconds = 30, options = {}) {
    super(message, {
      code: 'RATE_LIMIT_ERROR',
      statusCode: 429,
      details: { retryAfterSeconds },
      ...options
    });
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

/** Raised when network connectivity, DNS, or CORS blocks a request. */
export class NetworkError extends AppError {
  constructor(message = 'Network connection failed. Please check your internet connection.', options = {}) {
    super(message, {
      code: 'NETWORK_ERROR',
      statusCode: 0,
      ...options
    });
  }
}

/** Raised when an asynchronous request exceeds its configured timeout. */
export class TimeoutError extends AppError {
  /**
   * @param {number} timeoutMs
   * @param {string} [message]
   * @param {object} [options]
   */
  constructor(timeoutMs, message, options = {}) {
    super(message || `Request timed out after ${timeoutMs}ms.`, {
      code: 'TIMEOUT_ERROR',
      statusCode: 408,
      details: { timeoutMs },
      ...options
    });
    this.timeoutMs = timeoutMs;
  }
}

/** Raised when an upstream HTTP/API endpoint responds with an error status or invalid payload. */
export class ApiError extends AppError {
  /**
   * @param {string} message
   * @param {object} [options]
   * @param {number} [options.statusCode=502]
   * @param {string} [options.endpoint]
   * @param {unknown} [options.responseBody]
   */
  constructor(message, options = {}) {
    super(message, {
      code: options.code || 'API_ERROR',
      statusCode: options.statusCode ?? 502,
      details: {
        endpoint: options.endpoint || null,
        responseBody: options.responseBody ?? null
      },
      ...options
    });
    this.endpoint = options.endpoint || null;
    this.responseBody = options.responseBody ?? null;
  }
}

/** Raised when a requested entity (e.g. project ID) does not exist. */
export class NotFoundError extends AppError {
  constructor(resourceName, id, options = {}) {
    super(`${resourceName} "${id}" was not found.`, {
      code: 'NOT_FOUND_ERROR',
      statusCode: 404,
      details: { resourceName, id },
      ...options
    });
  }
}

/**
 * Normalizes any unknown thrown value into an `AppError`.
 *
 * @param {unknown} err
 * @param {string} [fallbackMessage='An unexpected error occurred.']
 * @returns {AppError}
 */
export function normalizeError(err, fallbackMessage = 'An unexpected error occurred.') {
  if (err instanceof AppError) {
    return err;
  }

  if (err && typeof err === 'object' && err.name === 'AbortError') {
    return new TimeoutError(err.timeoutMs || 0, 'The operation timed out.', { cause: err });
  }

  if (err instanceof TypeError) {
    return new NetworkError(err.message || 'Network request could not be completed.', { cause: err });
  }

  if (err instanceof Error) {
    return new AppError(err.message || fallbackMessage, {
      code: 'UNEXPECTED_ERROR',
      cause: err,
      isOperational: false
    });
  }

  return new AppError(typeof err === 'string' ? err : fallbackMessage, {
    code: 'UNKNOWN_ERROR',
    details: { raw: err },
    isOperational: false
  });
}


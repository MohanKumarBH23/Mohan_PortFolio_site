/**
 * @fileoverview Environment-aware structured logger.
 * Filters output by configured severity level (`debug` | `info` | `warn` | `error` | `silent`).
 */

const LOG_PRIORITY = Object.freeze({
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 100
});

/**
 * Creates a structured, namespaced logger instance.
 *
 * @param {object} [options]
 * @param {'debug'|'info'|'warn'|'error'|'silent'} [options.level='info']
 * @param {string} [options.namespace='App']
 * @returns {object} Logger interface with `debug`, `info`, `warn`, `error`, and `child`.
 */
export function createLogger({ level = 'info', namespace = 'App' } = {}) {
  const minPriority = LOG_PRIORITY[level] ?? LOG_PRIORITY.info;

  function emit(method, msgLevel, message, meta) {
    if ((LOG_PRIORITY[msgLevel] ?? 100) < minPriority) {
      return;
    }

    const prefix = `[${namespace}]`;
    const consoleFn = typeof console[method] === 'function' ? console[method].bind(console) : console.log.bind(console);
    if (meta !== undefined) {
      consoleFn(`${prefix} ${message}`, meta);
    } else {
      consoleFn(`${prefix} ${message}`);
    }
  }

  return Object.freeze({
    debug: (message, meta) => emit('debug', 'debug', message, meta),
    info: (message, meta) => emit('info', 'info', message, meta),
    warn: (message, meta) => emit('warn', 'warn', message, meta),
    error: (message, meta) => emit('error', 'error', message, meta),
    /**
     * Derives a child logger sharing the same threshold with a scoped namespace.
     *
     * @param {string} childNamespace
     */
    child: (childNamespace) =>
      createLogger({ level, namespace: `${namespace}:${childNamespace}` })
  });
}


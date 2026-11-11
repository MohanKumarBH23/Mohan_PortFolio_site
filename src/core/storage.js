/**
 * @fileoverview Safe Persistence Storage Adapter.
 * Wraps `localStorage` with automatic in-memory fallback when browser storage
 * is restricted, full, or unavailable (e.g. private browsing / SSR / Node tests).
 */

/**
 * Resolves `window.localStorage` safely without throwing SecurityError.
 *
 * @returns {Storage | null}
 */
function resolveBrowserStorage() {
  try {
    if (typeof globalThis.localStorage !== 'undefined') {
      const testKey = '__storage_probe__';
      globalThis.localStorage.setItem(testKey, '1');
      globalThis.localStorage.removeItem(testKey);
      return globalThis.localStorage;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Creates a resilient key-value storage wrapper.
 *
 * @param {object} [options]
 * @param {Storage | null} [options.backend] - Optional custom Storage backend for testing.
 * @param {{ warn: Function }} [options.logger] - Optional logger for storage degradation notices.
 * @returns {object} Storage interface (`getString`, `setString`, `getJSON`, `setJSON`, `remove`, `isPersistent`).
 */
export function createStorageService({ backend, logger } = {}) {
  const memoryFallback = new Map();
  const dirtyMemoryKeys = new Set();
  const storage = backend !== undefined ? backend : resolveBrowserStorage();

  function warnDegraded(action, key, err) {
    if (logger && typeof logger.warn === 'function') {
      logger.warn(`Storage ${action} failed for key "${key}"; using in-memory fallback.`, {
        error: err?.message || String(err)
      });
    }
  }

  return Object.freeze({
    isPersistent: Boolean(storage),

    /**
     * Reads a raw string value safely.
     *
     * @param {string} key
     * @param {string | null} [fallback=null]
     * @returns {string | null}
     */
    getString(key, fallback = null) {
      if (!key) return fallback;
      if (dirtyMemoryKeys.has(key) && memoryFallback.has(key)) {
        return memoryFallback.get(key);
      }
      try {
        if (storage) {
          const val = storage.getItem(key);
          if (val !== null) return val;
        }
      } catch (err) {
        warnDegraded('read', key, err);
      }
      return memoryFallback.has(key) ? memoryFallback.get(key) : fallback;
    },

    /**
     * Writes a raw string value safely, updating in-memory mirror as fallback.
     *
     * @param {string} key
     * @param {string} value
     * @returns {boolean} True if persisted to primary storage backend.
     */
    setString(key, value) {
      if (!key) return false;
      const strVal = String(value);
      memoryFallback.set(key, strVal);
      if (!storage) {
        dirtyMemoryKeys.add(key);
        return false;
      }

      try {
        storage.setItem(key, strVal);
        dirtyMemoryKeys.delete(key);
        return true;
      } catch (err) {
        dirtyMemoryKeys.add(key);
        warnDegraded('write', key, err);
        return false;
      }
    },

    /**
     * Reads and parses a JSON value safely; recovers gracefully from corrupted JSON.
     *
     * @template T
     * @param {string} key
     * @param {T} fallback
     * @returns {T}
     */
    getJSON(key, fallback) {
      const raw = this.getString(key, null);
      if (raw === null) return fallback;
      try {
        return JSON.parse(raw);
      } catch (err) {
        warnDegraded('JSON.parse', key, err);
        return fallback;
      }
    },

    /**
     * Serializes and writes a JSON value safely.
     *
     * @param {string} key
     * @param {unknown} value
     * @returns {boolean}
     */
    setJSON(key, value) {
      try {
        return this.setString(key, JSON.stringify(value));
      } catch (err) {
        warnDegraded('JSON.stringify', key, err);
        return false;
      }
    },

    /**
     * Removes a key from storage and fallback cache.
     *
     * @param {string} key
     */
    remove(key) {
      if (!key) return;
      memoryFallback.delete(key);
      dirtyMemoryKeys.delete(key);
      if (!storage) return;
      try {
        storage.removeItem(key);
      } catch (err) {
        warnDegraded('remove', key, err);
      }
    }
  });
}

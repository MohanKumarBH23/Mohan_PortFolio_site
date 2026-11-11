/**
 * @fileoverview Clipboard Service abstracting async Clipboard API and legacy execCommand fallback.
 */

import { AppError, ValidationError } from '../core/errors.js';

/**
 * Creates a ClipboardService instance.
 *
 * @param {object} [deps]
 * @param {{ writeText?: Function } | null} [deps.clipboardApi]
 * @param {(text: string) => boolean} [deps.legacyCopyFn]
 * @param {object} [deps.logger]
 */
export function createClipboardService({ clipboardApi, legacyCopyFn, logger } = {}) {
  const asyncApi =
    clipboardApi !== undefined
      ? clipboardApi
      : (typeof navigator !== 'undefined' ? navigator.clipboard : null);

  function defaultLegacyCopy(text) {
    if (typeof document === 'undefined') return false;
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    ta.style.pointerEvents = 'none';
    document.body.appendChild(ta);
    ta.select();
    let success = false;
    try {
      success = Boolean(document.execCommand('copy'));
    } catch {
      success = false;
    } finally {
      document.body.removeChild(ta);
    }
    return success;
  }

  const runLegacyCopy = legacyCopyFn || defaultLegacyCopy;

  return Object.freeze({
    /**
     * Copies text to the clipboard safely.
     *
     * @param {string} text
     * @returns {Promise<{ copied: boolean, method: 'clipboard' | 'legacy' }>}
     * @throws {ValidationError | AppError}
     */
    async copyText(text) {
      const value = String(text ?? '');
      if (!value) {
        throw new ValidationError('Nothing to copy.', { text: 'Empty clipboard payload' });
      }

      if (asyncApi && typeof asyncApi.writeText === 'function') {
        try {
          await asyncApi.writeText(value);
          return { copied: true, method: 'clipboard' };
        } catch (err) {
          logger?.warn('navigator.clipboard.writeText failed, trying legacy fallback', {
            error: err?.message || String(err)
          });
        }
      }

      const fallbackOk = runLegacyCopy(value);
      if (!fallbackOk) {
        throw new AppError('Clipboard access is blocked by your browser.', {
          code: 'CLIPBOARD_BLOCKED',
          statusCode: 403
        });
      }

      return { copied: true, method: 'legacy' };
    }
  });
}


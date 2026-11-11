/**
 * @fileoverview Pure Input Sanitization, HTML Escaping & URL Validation Helpers.
 */

const SAFE_URL_PROTOCOLS = new Set(['https:', 'http:', 'mailto:', 'tel:']);

/**
 * Escapes HTML special characters to neutralize XSS vectors in text interpolation.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Normalizes plain-text user input by trimming, stripping unsafe ASCII control chars,
 * and bounding maximum length.
 *
 * @param {unknown} value
 * @param {object} [options]
 * @param {number} [options.maxLength=5000]
 * @param {boolean} [options.preserveNewlines=false]
 * @returns {string}
 */
export function normalizeText(value, { maxLength = 5000, preserveNewlines = false } = {}) {
  const raw = String(value ?? '').trim();
  // Strip C0 control chars except tab/newline when preserveNewlines is enabled
  const cleaned = preserveNewlines
    ? raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    : raw.replace(/[\x00-\x1F\x7F]/g, ' ').replace(/\s+/g, ' ');
  return cleaned.slice(0, maxLength).trim();
}

/**
 * Validates and sanitizes navigation or asset URLs, blocking `javascript:`,
 * `vbscript:`, and arbitrary `data:` URIs.
 *
 * @param {string} rawUrl
 * @param {string} [fallback='#']
 * @returns {string}
 */
export function sanitizeUrl(rawUrl, fallback = '#') {
  const trimmed = String(rawUrl ?? '').trim();
  if (!trimmed) return fallback;

  // Allow safe relative URLs and in-page anchors
  if (
    trimmed.startsWith('#') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('../') ||
    /^[a-zA-Z0-9._-]+\//.test(trimmed)
  ) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    return SAFE_URL_PROTOCOLS.has(parsed.protocol) ? parsed.href : fallback;
  } catch {
    return fallback;
  }
}


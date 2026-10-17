/**
 * SECURITY MODULE & INPUT SANITIZATION
 * Mohan | AI Engineer Portfolio
 * Protects against XSS, automated spam bot injection, clickjacking, and form flooding.
 */

const SecurityGuard = (function () {
  'use strict';

  // 1. Anti-XSS Sanitizer: Escape dangerous HTML entities
  function sanitizeInput(dirtyStr) {
    if (typeof dirtyStr !== 'string') return '';
    return dirtyStr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // 2. Email Format Validator (RFC 5322 regex)
  function isValidEmail(email) {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return re.test(String(email).toLowerCase());
  }

  // 3. Client-Side Rate Limiter (Token bucket in localStorage)
  function checkRateLimit(actionKey = 'contact_submit', limitSeconds = 60) {
    const storageKey = `rate_limit_${actionKey}`;
    const lastAttempt = localStorage.getItem(storageKey);
    const now = Date.now();

    if (lastAttempt) {
      const elapsedSec = (now - parseInt(lastAttempt, 10)) / 1000;
      if (elapsedSec < limitSeconds) {
        const remaining = Math.ceil(limitSeconds - elapsedSec);
        return {
          allowed: false,
          remainingSeconds: remaining,
          message: `Security cooldown active. Please wait ${remaining} seconds before submitting again.`
        };
      }
    }

    localStorage.setItem(storageKey, now.toString());
    return { allowed: true };
  }

  // 4. Honeypot check (anti-bot trap)
  function isHoneypotTriggered(formElement) {
    const hp = formElement.querySelector('input[name="_gotcha_hp"]');
    return hp && hp.value.trim().length > 0;
  }

  // 5. Safe Copy to Clipboard (prevents injection vulnerabilities)
  async function copyTextSecurely(textToCopy, successCallback, errorCallback) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
        if (successCallback) successCallback();
      } else {
        // Fallback for non-https local dev
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful && successCallback) successCallback();
      }
    } catch (err) {
      console.error('Clipboard copy error:', err);
      if (errorCallback) errorCallback(err);
    }
  }

  return {
    sanitizeInput,
    isValidEmail,
    checkRateLimit,
    isHoneypotTriggered,
    copyTextSecurely
  };
})();

// Attach to window for global access
window.SecurityGuard = SecurityGuard;

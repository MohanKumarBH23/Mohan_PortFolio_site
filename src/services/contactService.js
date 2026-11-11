/**
 * @fileoverview Contact Business Logic Service.
 * Handles inquiry validation, bot honeypot trapping, client-side rate limiting,
 * local inquiry archiving, and remote delivery orchestration — completely decoupled from DOM UI.
 */

import { AppError, RateLimitError, ValidationError, normalizeError } from '../core/errors.js';
import { normalizeText } from '../core/sanitize.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validates and normalizes contact form input fields.
 *
 * @param {object} input
 * @param {string} [input.name]
 * @param {string} [input.email]
 * @param {string} [input.subject]
 * @param {string} [input.message]
 * @returns {{ valid: boolean, fieldErrors: Record<string, string>, sanitized: { name: string, email: string, subject: string, message: string } }}
 */
export function validateContactInput(input = {}) {
  const name = normalizeText(input.name, { maxLength: 100 });
  const email = normalizeText(input.email, { maxLength: 254 });
  const rawSubject = normalizeText(input.subject, { maxLength: 150 });
  const message = normalizeText(input.message, { maxLength: 5000, preserveNewlines: true });

  const fieldErrors = {};

  if (!name) {
    fieldErrors.name = 'Name is required.';
  } else if (name.length < 2) {
    fieldErrors.name = 'Name must be at least 2 characters.';
  }

  if (!email) {
    fieldErrors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(email.toLowerCase())) {
    fieldErrors.email = 'Please provide a valid email address.';
  }

  if (!message) {
    fieldErrors.message = 'Message is required.';
  } else if (message.length < 10) {
    fieldErrors.message = 'Please enter at least 10 characters so I have enough context.';
  }

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
    sanitized: {
      name,
      email,
      subject: rawSubject || 'General Portfolio Inquiry',
      message
    }
  };
}

/**
 * Generates a compact inquiry reference identifier (`INQ-XXXXXX`).
 *
 * @returns {string}
 */
export function generateReferenceId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `INQ-${suffix}`;
}

/**
 * Formats an inquiry timestamp according to configured locale & timezone.
 *
 * @param {Date} date
 * @param {string} locale
 * @param {string} timeZone
 * @returns {string}
 */
export function formatSubmissionTime(date, locale = 'en-IN', timeZone = 'Asia/Kolkata') {
  try {
    return date.toLocaleString(locale, {
      timeZone,
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  } catch {
    return date.toISOString();
  }
}

/**
 * Creates a ContactService bound to config, storage, and repository dependencies.
 *
 * @param {object} deps
 * @param {Readonly<object>} deps.config
 * @param {object} deps.storage
 * @param {object} deps.contactRepository
 * @param {object} [deps.logger]
 */
export function createContactService({ config, storage, contactRepository, logger }) {
  const { cooldownMs, maxHistory, locale, timeZone } = config.contact;
  const { inquiriesKey, cooldownKey } = config.storage;

  function getCooldownStatus(now = Date.now()) {
    const storedUntil = Number(storage.getString(cooldownKey, '0'));
    if (!Number.isFinite(storedUntil) || storedUntil <= now) {
      return { allowed: true, retryAfterSeconds: 0, cooldownUntil: 0 };
    }
    const retryAfterSeconds = Math.ceil((storedUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds, cooldownUntil: storedUntil };
  }

  function getHistory() {
    const entries = storage.getJSON(inquiriesKey, []);
    return Array.isArray(entries) ? entries : [];
  }

  function archiveLocally(submission) {
    const existing = getHistory();
    const updated = [submission, ...existing].slice(0, maxHistory);
    storage.setJSON(inquiriesKey, updated);
  }

  return Object.freeze({
    validateContactInput,
    getCooldownStatus,
    getHistory,

    /**
     * Processes and dispatches a contact inquiry.
     *
     * @param {object} rawInput
     * @param {string} [rawInput.name]
     * @param {string} [rawInput.email]
     * @param {string} [rawInput.subject]
     * @param {string} [rawInput.message]
     * @param {string} [rawInput.honeypot]
     * @param {number} [now]
     * @returns {Promise<{ botDropped: boolean, submission?: object, cooldownUntil?: number, delivery?: object }>}
     * @throws {RateLimitError | ValidationError | AppError}
     */
    async submitInquiry(rawInput = {}, now = Date.now()) {
      // 1. Silent honeypot anti-spam trap
      if (rawInput.honeypot && String(rawInput.honeypot).trim().length > 0) {
        logger?.warn('Honeypot field triggered; dropping automated submission.');
        return { botDropped: true };
      }

      // 2. Client-side token-bucket cooldown guard
      const cooldown = getCooldownStatus(now);
      if (!cooldown.allowed) {
        throw new RateLimitError(
          `Please wait ${cooldown.retryAfterSeconds}s before sending another inquiry.`,
          cooldown.retryAfterSeconds
        );
      }

      // 3. Field sanitization & validation
      const validation = validateContactInput(rawInput);
      if (!validation.valid) {
        const firstMessage =
          Object.values(validation.fieldErrors)[0] || 'Please check your input fields.';
        throw new ValidationError(firstMessage, validation.fieldErrors);
      }

      // 4. Build normalized inquiry record
      const refId = generateReferenceId();
      const submittedDate = new Date(now);
      const timestamp = submittedDate.toISOString();
      const dateFormatted = formatSubmissionTime(submittedDate, locale, timeZone);

      const submission = {
        id: refId,
        name: validation.sanitized.name,
        email: validation.sanitized.email,
        subject: validation.sanitized.subject,
        message: validation.sanitized.message,
        timestamp,
        dateFormatted
      };

      // 5. Persist locally first so the user never loses their draft on network loss
      archiveLocally(submission);

      // 6. Dispatch remotely via ContactRepository
      try {
        const delivery = await contactRepository.submitInquiry({
          name: submission.name,
          email: submission.email,
          subject: submission.subject,
          message: submission.message,
          referenceId: refId,
          submittedAtFormatted: dateFormatted
        });

        const nextCooldownUntil = now + cooldownMs;
        if (cooldownMs > 0) {
          storage.setString(cooldownKey, String(nextCooldownUntil));
        }

        return {
          botDropped: false,
          submission,
          cooldownUntil: nextCooldownUntil,
          delivery
        };
      } catch (err) {
        const normalized = normalizeError(err, 'Remote inquiry delivery failed.');
        throw new AppError(normalized.message, {
          code: normalized.code,
          statusCode: normalized.statusCode,
          cause: normalized,
          details: { ...(normalized.details || {}), refId }
        });
      }
    }
  });
}


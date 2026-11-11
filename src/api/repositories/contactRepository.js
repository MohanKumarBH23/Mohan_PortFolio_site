/**
 * @fileoverview Contact Transport Repository.
 * Abstracts inquiry delivery across configured transport channels (REST API,
 * FormSubmit AJAX endpoint, and Google Apps Script Sheet/Email webhook).
 */

import { ApiError, ConfigError } from '../../core/errors.js';

/**
 * Creates a contact transport repository instance.
 *
 * @param {object} deps
 * @param {import('../client.js').ApiClient} deps.apiClient
 * @param {object} deps.endpoints
 * @param {object} [deps.logger]
 * @returns {object} Repository methods (`submitInquiry`, `checkHealth`).
 */
export function createContactRepository({ apiClient, endpoints, logger }) {
  return Object.freeze({
    /**
     * Dispatches a validated inquiry payload to configured remote transports.
     *
     * @param {object} inquiry
     * @param {string} inquiry.name
     * @param {string} inquiry.email
     * @param {string} inquiry.subject
     * @param {string} inquiry.message
     * @param {string} inquiry.referenceId
     * @param {string} inquiry.submittedAtFormatted
     * @returns {Promise<{ refId: string, channels: { primary: string, secondaryDispatched: boolean } }>}
     * @throws {ConfigError | ApiError}
     */
    async submitInquiry(inquiry) {
      const { formSubmit, appsScriptWebhook, customRestApi } = endpoints.contact;

      if (!formSubmit.enabled && !appsScriptWebhook.enabled && !customRestApi.enabled) {
        throw new ConfigError('No contact delivery endpoints are configured.');
      }

      // If a dedicated backend REST API is configured via API_BASE_URL, use it as primary
      if (customRestApi.enabled) {
        const response = await apiClient.post(
          customRestApi.url,
          {
            name: inquiry.name,
            email: inquiry.email,
            subject: inquiry.subject,
            message: inquiry.message,
            referenceId: inquiry.referenceId,
            submittedAt: inquiry.submittedAtFormatted
          },
          { retryable: customRestApi.retryable }
        );
        return {
          refId: inquiry.referenceId,
          channels: { primary: 'customRestApi', secondaryDispatched: false },
          response: response.data
        };
      }

      // Fire Google Sheets webhook in parallel when enabled (non-blocking failure logged cleanly)
      const sheetPromise = appsScriptWebhook.enabled
        ? apiClient
            .post(
              appsScriptWebhook.url,
              {
                name: inquiry.name,
                email: inquiry.email,
                subject: inquiry.subject,
                message: inquiry.message,
                reference_id: inquiry.referenceId,
                timestamp: inquiry.submittedAtFormatted
              },
              {
                mode: appsScriptWebhook.mode,
                retryable: appsScriptWebhook.retryable
              }
            )
            .then(() => ({ ok: true }))
            .catch((err) => {
              logger?.warn('Google Sheets webhook dispatch warning', {
                refId: inquiry.referenceId,
                error: err.message
              });
              return { ok: false, error: err };
            })
        : Promise.resolve({ ok: false, skipped: true });

      if (formSubmit.enabled) {
        const emailResponse = await apiClient.post(
          formSubmit.url,
          {
            name: inquiry.name,
            email: inquiry.email,
            _subject: `[Portfolio Inquiry] ${inquiry.subject}`,
            message: inquiry.message,
            reference_id: inquiry.referenceId,
            submitted_at: inquiry.submittedAtFormatted
          },
          { retryable: formSubmit.retryable }
        );

        const sheetResult = await sheetPromise;

        if (
          emailResponse.data &&
          typeof emailResponse.data === 'object' &&
          (emailResponse.data.success === false || emailResponse.data.success === 'false')
        ) {
          throw new ApiError(
            emailResponse.data.message || 'Email gateway rejected the inquiry.',
            { statusCode: 502, endpoint: formSubmit.url, responseBody: emailResponse.data }
          );
        }

        return {
          refId: inquiry.referenceId,
          channels: {
            primary: 'formSubmit',
            secondaryDispatched: Boolean(sheetResult.ok)
          }
        };
      }

      // Apps Script webhook-only mode when FormSubmit is intentionally disabled
      const webhookRes = await apiClient.post(
        appsScriptWebhook.url,
        {
          name: inquiry.name,
          email: inquiry.email,
          subject: inquiry.subject,
          message: inquiry.message,
          reference_id: inquiry.referenceId,
          timestamp: inquiry.submittedAtFormatted
        },
        { mode: appsScriptWebhook.mode, retryable: appsScriptWebhook.retryable }
      );

      return {
        refId: inquiry.referenceId,
        channels: { primary: 'appsScriptWebhook', secondaryDispatched: Boolean(webhookRes.ok) }
      };
    },

    /**
     * Probes configured webhook health endpoint.
     *
     * @returns {Promise<{ available: boolean, status: unknown }>}
     */
    async checkHealth() {
      const health = endpoints.system.appsScriptHealth;
      if (!health.enabled) {
        return { available: false, status: 'disabled' };
      }
      const res = await apiClient.get(health.url, { retryable: false });
      return { available: res.ok, status: res.data };
    }
  });
}


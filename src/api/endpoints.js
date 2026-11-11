/**
 * @fileoverview Centralized API Endpoint Registry.
 * Maps logical API operations to environment-configured endpoints and transport policies,
 * allowing backend migration (e.g., from serverless webhooks to a REST API) without
 * modifying business services or UI components.
 */

/**
 * Builds the frozen endpoint catalog from validated application configuration.
 *
 * @param {Readonly<object>} config
 * @returns {Readonly<object>}
 */
export function createEndpoints(config) {
  const formSubmitUrl = config?.api?.endpoints?.formSubmitUrl || '';
  const appsScriptUrl = config?.api?.endpoints?.googleAppsScriptUrl || '';
  const baseUrl = config?.api?.baseUrl || '';

  return Object.freeze({
    contact: Object.freeze({
      formSubmit: Object.freeze({
        url: formSubmitUrl,
        method: 'POST',
        enabled: Boolean(formSubmitUrl),
        retryable: true,
        mode: 'cors'
      }),
      appsScriptWebhook: Object.freeze({
        url: appsScriptUrl,
        method: 'POST',
        enabled: Boolean(appsScriptUrl && appsScriptUrl.startsWith('https://script.google.com')),
        retryable: false, // Opaque no-cors webhook cannot verify idempotency on retry
        mode: 'no-cors'
      }),
      customRestApi: Object.freeze({
        url: baseUrl ? '/v1/inquiries' : '',
        method: 'POST',
        enabled: Boolean(baseUrl),
        retryable: true,
        mode: 'cors'
      })
    }),
    system: Object.freeze({
      appsScriptHealth: Object.freeze({
        url: appsScriptUrl,
        method: 'GET',
        enabled: Boolean(appsScriptUrl && appsScriptUrl.startsWith('https://script.google.com')),
        retryable: false
      })
    })
  });
}


# Scalable API Layer & Webhook Contract

## Client Architecture (`src/api/`)

The frontend API subsystem separates HTTP mechanics, endpoint routing, and transport orchestration into three layers:

1. **HTTP Transport Client (`src/api/client.js` — `ApiClient`)**
   - **Timeouts**: Enforces per-request `AbortController` timeouts (`config.api.timeoutMs`).
   - **Retries**: Exponential backoff with randomized jitter on transient errors (`408`, `425`, `429`, `5xx`, `NetworkError`, `TimeoutError`). Non-retryable `4xx` responses fail fast.
   - **Interceptors**: Extensible `addRequestInterceptor` and `addResponseInterceptor` hooks for future auth tokens, tracing headers, or response telemetry.
   - **Opaque Support**: Explicitly supports `mode: 'no-cors'` for Google Apps Script web app redirects.

2. **Centralized Endpoint Registry (`src/api/endpoints.js`)**
   - Maps domain operations (`contact.formSubmit`, `contact.appsScriptWebhook`, `contact.customRestApi`, `system.appsScriptHealth`) from validated environment config.
   - Enables migrating from serverless FormSubmit/Apps Script to a dedicated REST backend simply by configuring `API_BASE_URL` in `.env` and rebuilding runtime env (`npm run env:build`).

3. **Domain Repositories (`src/api/repositories/contactRepository.js`)**
   - `submitInquiry(inquiry)`:
     - Routes to `customRestApi` (`POST ${API_BASE_URL}/v1/inquiries`) when `API_BASE_URL` is configured.
     - Otherwise dispatches primary email via FormSubmit AJAX and logs to Google Sheets via `appsScriptWebhook` in parallel.
   - `checkHealth()`: Probes `GET` webhook status endpoint.

---

## Adding a New API Resource

To add a new backend domain (e.g., live blog posts or analytics):

1. Add any environment URL/keys to `config/env.defaults.json`, `.env.example`, and `scripts/generate-env.mjs`.
2. Register the endpoint definition inside `src/api/endpoints.js`.
3. Create `src/api/repositories/<resource>Repository.js` consuming `apiClient` and `endpoints`.
4. Consume the repository inside a pure business service in `src/services/`.

---

## Serverless Backend Contract (`api/google-apps-script/Code.gs`)

### Configuration (Script Properties)

Set in Google Apps Script under **Project Settings → Script Properties**:

| Key | Required | Description |
| :--- | :--- | :--- |
| `SPREADSHEET_ID` | Yes | Google Sheet ID where inquiries are appended |
| `RECIPIENT_EMAIL` | Yes | Destination inbox for HTML email notifications |
| `TIMEZONE` | No | IANA timezone for logged timestamps (default: `Asia/Kolkata`) |

### `GET /exec` — Healthcheck

Response (`200 OK`, JSON):
```json
{
  "ok": true,
  "status": "online",
  "configured": true,
  "timestamp": "2026-11-11T13:15:00.000Z",
  "message": "Portfolio Contact Webhook is online."
}
```

### `POST /exec` — Submit Inquiry

Accepted Content-Types: `application/json` or `application/x-www-form-urlencoded`.

Payload:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "AI Engineering Opportunity",
  "message": "Interested in discussing an ML role.",
  "reference_id": "INQ-A1B2C3",
  "timestamp": "11 Nov 2026, 6:45 pm"
}
```

Response (`200 OK`, JSON):
```json
{
  "ok": true,
  "result": "success",
  "refId": "INQ-A1B2C3",
  "timestamp": "2026-11-11 18:45:00",
  "message": "Inquiry recorded and notification email dispatched."
}
```

Error Response Codes:
- `LOCK_TIMEOUT`: Concurrent lock busy after 10s
- `CONFIG_MISSING`: Missing Script Properties (`SPREADSHEET_ID` or `RECIPIENT_EMAIL`)
- `BAD_REQUEST`: Malformed JSON or empty request event
- `VALIDATION_ERROR`: Invalid name, email, or message length
- `STORAGE_ERROR`: Spreadsheet inaccessible


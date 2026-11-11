/**
 * ==============================================================================
 * Google Apps Script Serverless Webhook Handler
 * Mohan Kumar B.H Portfolio — Inquiry Ingestion & Email Alert Service
 *
 * CONFIGURATION (Required in Apps Script -> Project Settings -> Script Properties):
 *   - SPREADSHEET_ID   : Target Google Sheet ID
 *   - RECIPIENT_EMAIL  : Notification destination email address
 *   - TIMEZONE         : Optional IANA timezone (default: "Asia/Kolkata")
 *
 * Never hardcode private Sheet IDs or secrets directly in source code.
 * ==============================================================================
 */

var LOCK_TIMEOUT_MS = 10000;
var DEFAULT_TIMEZONE = "Asia/Kolkata";
var MAX_FIELD_LENGTH = {
  name: 120,
  email: 254,
  subject: 160,
  message: 5000,
  refId: 32
};

/**
 * Escapes HTML special characters to prevent HTML injection in notification emails.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeHtml_(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Builds a standardized JSON response payload.
 *
 * @param {object} payload
 * @returns {GoogleAppsScript.Content.TextOutput}
 */
function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Loads and validates runtime environment configuration from Script Properties.
 *
 * @returns {{ spreadsheetId: string, recipientEmail: string, timeZone: string }}
 */
function getServerConfig_() {
  var props = PropertiesService.getScriptProperties();
  var spreadsheetId = (props.getProperty("SPREADSHEET_ID") || "").trim();
  var recipientEmail = (props.getProperty("RECIPIENT_EMAIL") || "").trim();
  var timeZone = (props.getProperty("TIMEZONE") || DEFAULT_TIMEZONE).trim();

  if (!spreadsheetId) {
    throw new Error("CONFIG_MISSING: Script Property 'SPREADSHEET_ID' is not configured.");
  }
  if (!recipientEmail) {
    throw new Error("CONFIG_MISSING: Script Property 'RECIPIENT_EMAIL' is not configured.");
  }

  return {
    spreadsheetId: spreadsheetId,
    recipientEmail: recipientEmail,
    timeZone: timeZone || DEFAULT_TIMEZONE
  };
}

/**
 * Parses incoming webhook payload from JSON or URL-encoded form parameters.
 *
 * @param {GoogleAppsScript.Events.DoPost} e
 * @returns {object}
 */
function parseRequestPayload_(e) {
  if (!e) {
    throw new Error("BAD_REQUEST: Empty request event received.");
  }

  if (e.postData && e.postData.contents) {
    var contentType = (e.postData.type || "").toLowerCase();
    if (contentType.indexOf("application/json") !== -1 || e.postData.contents.trim().charAt(0) === "{") {
      try {
        return JSON.parse(e.postData.contents);
      } catch (parseErr) {
        if (e.parameter) return e.parameter;
        throw new Error("BAD_REQUEST: Malformed JSON payload.");
      }
    }
  }

  return e.parameter || {};
}

/**
 * Sanitizes and validates incoming inquiry fields.
 *
 * @param {object} raw
 * @returns {{ name: string, email: string, subject: string, message: string, refId: string, clientTime: string }}
 */
function validatePayload_(raw) {
  var name = String(raw.name || "").trim().slice(0, MAX_FIELD_LENGTH.name);
  var email = String(raw.email || "").trim().slice(0, MAX_FIELD_LENGTH.email);
  var subject = String(raw.subject || "General Portfolio Inquiry").trim().slice(0, MAX_FIELD_LENGTH.subject);
  var message = String(raw.message || "").trim().slice(0, MAX_FIELD_LENGTH.message);
  var refId = String(raw.reference_id || raw.refId || "INQ-WEB").trim().slice(0, MAX_FIELD_LENGTH.refId);
  var clientTime = String(raw.timestamp || new Date().toISOString()).trim();

  if (!name || name.length < 2) {
    throw new Error("VALIDATION_ERROR: Sender name must be at least 2 characters.");
  }

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email)) {
    throw new Error("VALIDATION_ERROR: Valid sender email is required.");
  }

  if (!message || message.length < 5) {
    throw new Error("VALIDATION_ERROR: Message must be at least 5 characters.");
  }

  return {
    name: name,
    email: email,
    subject: subject || "General Portfolio Inquiry",
    message: message,
    refId: refId,
    clientTime: clientTime
  };
}

/**
 * Ensures the target sheet exists and has a styled header row.
 *
 * @param {string} spreadsheetId
 * @returns {GoogleAppsScript.Spreadsheet.Sheet}
 */
function getOrInitSheet_(spreadsheetId) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(spreadsheetId);
  if (!spreadsheet) {
    throw new Error("STORAGE_ERROR: Unable to open target spreadsheet.");
  }

  var sheet = spreadsheet.getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp (IST)",
      "Sender Name",
      "Sender Email",
      "Purpose of Inquiry",
      "Message",
      "Reference ID",
      "Client Submission Time"
    ]);

    var headerRange = sheet.getRange(1, 1, 1, 7);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#0f172a");
    headerRange.setFontColor("#f8fafc");
    headerRange.setFontSize(11);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * Healthcheck endpoint (`GET`).
 *
 * @returns {GoogleAppsScript.Content.TextOutput}
 */
function doGet() {
  try {
    var config = getServerConfig_();
    return jsonResponse_({
      ok: true,
      status: "online",
      configured: Boolean(config.spreadsheetId && config.recipientEmail),
      timestamp: new Date().toISOString(),
      message: "Portfolio Contact Webhook is online."
    });
  } catch (err) {
    return jsonResponse_({
      ok: false,
      status: "misconfigured",
      error: err.message || String(err)
    });
  }
}

/**
 * Inquiry ingestion endpoint (`POST`).
 *
 * @param {GoogleAppsScript.Events.DoPost} e
 * @returns {GoogleAppsScript.Content.TextOutput}
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  var hasLock = lock.tryLock(LOCK_TIMEOUT_MS);

  if (!hasLock) {
    return jsonResponse_({
      ok: false,
      result: "error",
      code: "LOCK_TIMEOUT",
      message: "Service is busy processing another inquiry. Please retry shortly."
    });
  }

  try {
    var config = getServerConfig_();
    var rawPayload = parseRequestPayload_(e);
    var inquiry = validatePayload_(rawPayload);

    var now = new Date();
    var formattedTimestamp = Utilities.formatDate(now, config.timeZone, "yyyy-MM-dd HH:mm:ss");

    var sheet = getOrInitSheet_(config.spreadsheetId);
    sheet.appendRow([
      formattedTimestamp,
      inquiry.name,
      inquiry.email,
      inquiry.subject,
      inquiry.message,
      inquiry.refId,
      inquiry.clientTime
    ]);

    var safeName = escapeHtml_(inquiry.name);
    var safeEmail = escapeHtml_(inquiry.email);
    var safeSubject = escapeHtml_(inquiry.subject);
    var safeMessage = escapeHtml_(inquiry.message);
    var safeRefId = escapeHtml_(inquiry.refId);

    var htmlTemplate =
      '<div style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Arial,sans-serif;max-width:620px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px;background-color:#ffffff;color:#1e293b;">' +
        '<div style="border-bottom:2px solid #f43f5e;padding-bottom:14px;margin-bottom:20px;">' +
          '<h2 style="margin:0;color:#0f172a;font-size:20px;">New Inquiry Received &bull; Portfolio Website</h2>' +
          '<p style="margin:4px 0 0;color:#64748b;font-size:13px;">Logged in Google Sheet on ' + escapeHtml_(formattedTimestamp) + ' (' + escapeHtml_(config.timeZone) + ') &bull; Ref #' + safeRefId + '</p>' +
        '</div>' +
        '<table style="width:100%;border-collapse:collapse;margin-bottom:24px;">' +
          '<tr>' +
            '<td style="padding:10px 0;color:#64748b;font-size:14px;width:140px;border-bottom:1px solid #f1f5f9;"><strong>Sender Name:</strong></td>' +
            '<td style="padding:10px 0;color:#0f172a;font-size:15px;font-weight:600;border-bottom:1px solid #f1f5f9;">' + safeName + '</td>' +
          '</tr>' +
          '<tr>' +
            '<td style="padding:10px 0;color:#64748b;font-size:14px;border-bottom:1px solid #f1f5f9;"><strong>Sender Email:</strong></td>' +
            '<td style="padding:10px 0;font-size:15px;border-bottom:1px solid #f1f5f9;"><a href="mailto:' + encodeURIComponent(inquiry.email) + '" style="color:#f43f5e;text-decoration:none;font-weight:500;">' + safeEmail + '</a></td>' +
          '</tr>' +
          '<tr>' +
            '<td style="padding:10px 0;color:#64748b;font-size:14px;border-bottom:1px solid #f1f5f9;"><strong>Subject:</strong></td>' +
            '<td style="padding:10px 0;color:#0f172a;font-size:15px;border-bottom:1px solid #f1f5f9;">' + safeSubject + '</td>' +
          '</tr>' +
        '</table>' +
        '<div style="background-color:#f8fafc;border:1px solid #e2e8f0;padding:18px 20px;border-radius:6px;margin-bottom:24px;">' +
          '<h4 style="margin:0 0 10px;color:#475569;font-size:12px;text-transform:uppercase;letter-spacing:0.8px;">Message Content:</h4>' +
          '<p style="margin:0;color:#1e293b;font-size:15px;line-height:1.6;white-space:pre-wrap;">' + safeMessage + '</p>' +
        '</div>' +
        '<div style="text-align:center;padding-top:16px;border-top:1px solid #e2e8f0;">' +
          '<a href="mailto:' + encodeURIComponent(inquiry.email) + '?subject=' + encodeURIComponent("Re: " + inquiry.subject) + '" style="display:inline-block;background-color:#141312;color:#f0b938;text-decoration:none;padding:12px 28px;border-radius:4px;font-weight:600;font-size:14px;border:1px solid #d9a028;">Reply Directly to ' + safeName + '</a>' +
        '</div>' +
      '</div>';

    MailApp.sendEmail({
      to: config.recipientEmail,
      replyTo: inquiry.email,
      subject: "New Portfolio Inquiry [" + inquiry.refId + "] from " + inquiry.name + ": " + inquiry.subject,
      htmlBody: htmlTemplate
    });

    return jsonResponse_({
      ok: true,
      result: "success",
      refId: inquiry.refId,
      timestamp: formattedTimestamp,
      message: "Inquiry recorded and notification email dispatched."
    });
  } catch (err) {
    return jsonResponse_({
      ok: false,
      result: "error",
      code: (err.message || "").split(":")[0] || "INTERNAL_ERROR",
      error: err.message || String(err)
    });
  } finally {
    lock.releaseLock();
  }
}


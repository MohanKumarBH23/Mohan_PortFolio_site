/**
 * ==============================================================================
 * Google Apps Script for Mohan Kumar B.H Portfolio Contact Form
 * Destination: Saves submissions to Google Sheets & sends email notifications
 * Target Notification: mohankumarbh007@gmail.com
 * ==============================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Prevent concurrent write race conditions

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // If the sheet is brand new/empty, automatically configure the header row
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Sender Name",
        "Sender Email",
        "Purpose of Inquiry",
        "Message",
        "Client Submitted Time"
      ]);

      // Style header row
      var headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0f172a");
      headerRange.setFontColor("#f8fafc");
      headerRange.setFontSize(11);
      sheet.setFrozenRows(1);
    }

    // Parse incoming data (supports both FormData parameters & raw JSON payloads)
    var data = {};
    if (e.postData && e.postData.type === "application/json") {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    var now = new Date();
    var name = (data.name || "Anonymous").toString().trim();
    var email = (data.email || "No Email Provided").toString().trim();
    var subject = (data.subject || "General Portfolio Inquiry").toString().trim();
    var message = (data.message || "No message body provided.").toString().trim();
    var clientTime = data.timestamp ? data.timestamp.toString() : now.toISOString();

    // Format IST Timestamp for Indian Standard Time
    var istTimestamp = Utilities.formatDate(now, "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");

    // Append new submission to the Google Sheet
    sheet.appendRow([
      istTimestamp,
      name,
      email,
      subject,
      message,
      clientTime
    ]);

    // Send instant notification email to mohankumarbh007@gmail.com
    var recipientEmail = "mohankumarbh007@gmail.com";
    var emailSubject = "📬 New Portfolio Inquiry from " + name + ": \"" + subject + "\"";

    var htmlTemplate = 
      '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">' +
        '<div style="border-bottom: 2px solid #f43f5e; padding-bottom: 14px; margin-bottom: 20px;">' +
          '<h2 style="margin: 0; color: #0f172a; font-size: 20px;">New Inquiry Received &bull; Portfolio Website</h2>' +
          '<p style="margin: 4px 0 0; color: #64748b; font-size: 13px;">Logged in Google Sheet on ' + istTimestamp + ' IST</p>' +
        '</div>' +
        
        '<table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">' +
          '<tr>' +
            '<td style="padding: 10px 0; color: #64748b; font-size: 14px; width: 140px; border-bottom: 1px solid #f1f5f9;"><strong>Sender Name:</strong></td>' +
            '<td style="padding: 10px 0; color: #0f172a; font-size: 15px; font-weight: 600; border-bottom: 1px solid #f1f5f9;">' + name + '</td>' +
          '</tr>' +
          '<tr>' +
            '<td style="padding: 10px 0; color: #64748b; font-size: 14px; border-bottom: 1px solid #f1f5f9;"><strong>Sender Email:</strong></td>' +
            '<td style="padding: 10px 0; font-size: 15px; border-bottom: 1px solid #f1f5f9;"><a href="mailto:' + email + '" style="color: #f43f5e; text-decoration: none; font-weight: 500;">' + email + '</a></td>' +
          '</tr>' +
          '<tr>' +
            '<td style="padding: 10px 0; color: #64748b; font-size: 14px; border-bottom: 1px solid #f1f5f9;"><strong>Purpose of Inquiry:</strong></td>' +
            '<td style="padding: 10px 0; color: #0f172a; font-size: 15px; border-bottom: 1px solid #f1f5f9;">' + subject + '</td>' +
          '</tr>' +
        '</table>' +
        
        '<div style="background-color: #f8fafc; border-left: 4px solid #f43f5e; padding: 16px 20px; border-radius: 6px; margin-bottom: 24px;">' +
          '<h4 style="margin: 0 0 10px; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px;">Message Content:</h4>' +
          '<p style="margin: 0; color: #1e293b; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">' + message + '</p>' +
        '</div>' +
        
        '<div style="text-align: center; padding-top: 16px; border-top: 1px solid #e2e8f0;">' +
          '<a href="mailto:' + email + '?subject=' + encodeURIComponent('Re: ' + subject) + '" style="display: inline-block; background-color: #f43f5e; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">Reply Directly to ' + name + '</a>' +
        '</div>' +
      '</div>';

    MailApp.sendEmail({
      to: recipientEmail,
      replyTo: email,
      subject: emailSubject,
      htmlBody: htmlTemplate
    });

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "message": "Inquiry recorded and email dispatched." }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

# Google Sheets & Email Notification Setup Guide
**Connected Sheet:** [Mohan Portfolio Submissions](https://docs.google.com/spreadsheets/d/1WrptqgCnLYrPDP3fhgjWs-Je9qzoWT9QesasZB1m6jY/edit?usp=sharing)  
**Target Email:** `mohankumarbh007@gmail.com`  
**Portfolio:** Mohan Kumar B.H &bull; AI & ML Engineer

---

### Step 1: Open Your Existing Google Sheet
1. Open your Google Sheet in your browser:  
   👉 **[https://docs.google.com/spreadsheets/d/1WrptqgCnLYrPDP3fhgjWs-Je9qzoWT9QesasZB1m6jY/edit](https://docs.google.com/spreadsheets/d/1WrptqgCnLYrPDP3fhgjWs-Je9qzoWT9QesasZB1m6jY/edit)**

---

### Step 2: Open Google Apps Script
1. Inside your Google Sheet, click **Extensions** in the top menu bar.
2. Select **Apps Script**.
3. A new Apps Script editor tab will open.
4. Delete all existing code in the editor (`function myFunction() { ... }`).
5. Open [`google-apps-script.js`](file:///c:/Users/Dell/Desktop/Projects/Mohan%20PF/google-apps-script.js) from your project folder, copy its entire contents, and paste it into the editor.
6. Click the **Save** icon (diskette icon) or press `Ctrl + S`.

---

### Step 3: Deploy as Web App
1. In the upper right of the Apps Script window, click the blue **Deploy** button.
2. Select **New deployment**.
3. In the modal that opens, click the gear icon (⚙) next to "Select type" and choose **Web app**.
4. Configure the fields as follows:
   - **Description**: `Portfolio Contact Form Handler`
   - **Execute as**: **Me (mohankumarbh007@gmail.com)**
   - **Who has access**: **Anyone** *(Important: Must be 'Anyone' so website visitors can submit messages without logging into Google)*
5. Click **Deploy**.
6. When prompted, click **Authorize access**:
   - Choose your account: `mohankumarbh007@gmail.com`.
   - If Google shows a warning saying *"Google hasn't verified this app"*, click **Advanced** at the bottom, then click **Go to Untitled project (unsafe)**.
   - Click **Allow** to permit the script to write rows to your Google Sheet and send emails.
7. Copy the generated **Web app URL**. It will look like:
   ```text
   https://script.google.com/macros/s/AKfycb.../exec
   ```

---

### Step 4: Paste Your Web App URL into Your Website
1. Open [`js/main.js`](file:///c:/Users/Dell/Desktop/Projects/Mohan%20PF/js/main.js).
2. Around line 549, find:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = '';
   ```
3. Paste your Web App URL inside the quotes:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```
4. Save the file. (Or share the Web App URL here, and I'll paste it directly!)

---

### Verification:
1. Open your portfolio in your browser (`http://localhost:8080`).
2. Scroll to the **Let's Connect** section.
3. Fill out the form with a test message and click **Send Secure Inquiry**.
4. The inquiry is **accepted directly on the website** with an instant green confirmation card and Reference ID (`#INQ-XXXXXX`) — no mail client is opened!
5. Check your Google Sheet: a new row will be created with the timestamp, name, email, subject, and message!
6. Check your Gmail (`mohankumarbh007@gmail.com`): you will have received an email notification with a 1-click reply button!


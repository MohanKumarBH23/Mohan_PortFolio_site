# Google Sheets & Email Notification Setup Guide

**Connected Sheet:** [Mohan Portfolio Submissions](https://docs.google.com/spreadsheets/d/1WrptqgCnLYrPDP3fhgjWs-Je9qzoWT9QesasZB1m6jY/edit?usp=sharing)  
**Portfolio:** Mohan Kumar B.H &bull; AI & ML Engineer

---

### Step 1: Open Your Google Sheet
1. Open your Google Sheet in your browser:
   `https://docs.google.com/spreadsheets/d/1WrptqgCnLYrPDP3fhgjWs-Je9qzoWT9QesasZB1m6jY/edit`

---

### Step 2: Configure Google Apps Script Code
1. Inside your Google Sheet, click **Extensions** → **Apps Script**.
2. Delete any placeholder code in `Code.gs`.
3. Copy the entire contents of [`api/google-apps-script/Code.gs`](../api/google-apps-script/Code.gs) and paste it into `Code.gs`.
4. Save (`Ctrl + S`).

---

### Step 3: Set Script Properties (Environment Secrets)
Private spreadsheet IDs and recipient emails are separated from code via Apps Script **Script Properties**:

1. In the Apps Script editor, open **Project Settings** (gear icon on the left sidebar).
2. Scroll to **Script Properties** and click **Add script property** for each:
   - `SPREADSHEET_ID` = `1WrptqgCnLYrPDP3fhgjWs-Je9qzoWT9QesasZB1m6jY`
   - `RECIPIENT_EMAIL` = `mohankumarbh007@gmail.com`
   - `TIMEZONE` = `Asia/Kolkata` *(optional, defaults to `Asia/Kolkata`)*
3. Click **Save script properties**.

---

### Step 4: Deploy as Web App
1. Click **Deploy** → **New deployment**.
2. Click the gear icon next to **Select type** and choose **Web app**.
3. Configure:
   - **Description**: `Portfolio Contact Form Handler`
   - **Execute as**: **Me**
   - **Who has access**: **Anyone** *(Required so visitors can submit without Google sign-in)*
4. Click **Deploy** and authorize access when prompted.
5. Copy the generated **Web app URL** (`https://script.google.com/macros/s/.../exec`).

---

### Step 5: Configure Portfolio Environment
1. Copy `.env.example` to `.env` in the project root (never commit `.env`):
   ```bash
   cp .env.example .env
   ```
2. Set `GOOGLE_APPS_SCRIPT_URL` (and `FORMSUBMIT_ENDPOINT` if used) inside `.env`:
   ```env
   GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
   FORMSUBMIT_ENDPOINT=https://formsubmit.co/ajax/mohankumarbh007@gmail.com
   ```
3. Build the browser runtime config:
   ```bash
   npm run env:build
   ```
4. Verify locally via `npm run dev` and test submitting a message in the **Let's Connect** section.

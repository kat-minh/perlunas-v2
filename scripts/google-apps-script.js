/**
 * Hành Trình Việt — Lead capture endpoint (Google Apps Script Web App)
 * ====================================================================
 * 1. Create a Google Sheet, add a tab named "Leads".
 * 2. Extensions → Apps Script, paste this file.
 * 3. Set SECRET below to a random string and copy it to the site's
 *    LEAD_WEBHOOK_SECRET env var.
 * 4. Deploy → New deployment → Web app:
 *      Execute as: Me   |   Who has access: Anyone
 * 5. Copy the Web App URL into GOOGLE_SHEETS_WEBHOOK_URL on Vercel.
 */

const SECRET = "CHANGE_ME_TO_A_RANDOM_STRING";
const SHEET_NAME = "Leads";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (SECRET && data.secret !== SECRET) {
      return json({ ok: false, error: "unauthorized" });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    // Write a header row once.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Submitted At", "Name", "Phone", "Destination",
        "Travel Date", "Group Size", "Channel", "Source",
      ]);
    }

    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.name || "",
      data.phone || "",
      data.destination || "",
      data.travelDate || "",
      data.groupSize || "",
      data.channel || "",
      data.source || "landing",
    ]);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

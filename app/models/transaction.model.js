const { google } = require("googleapis");
const sheetAuth = require("../config/google-sheet.js");
const { getSpreadSheetId } = require("../config/google-sheet.js");
const { formatDate } = require("../utils/formatDate.js");

const SPREADSHEET_ID = getSpreadSheetId();
const HEADERS = ["Timestamp", "Description", "Amount", "Source", "Type"];

/**
 *
 * @param {object} transaction
 * @param {string} sheetName
 */

async function appendTransactionToSheet(transaction, sheetName) {
  const auth = await sheetAuth.getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  await ensureSheetExists(sheets, SPREADSHEET_ID, sheetName);

  const rowData = [
    formatDate(new Date()),
    transaction.description,
    transaction.amount,
    transaction.source,
    transaction.type,
  ];

  const resource = {
    values: [rowData],
  };

  try {
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:E`,
      valueInputOption: "USER_ENTERED",
      resource: resource,
    });
    return result.data;
  } catch (error) {
    console.error("Error saat menulis ke Google Sheets", error.message);
    throw new Error("Gagal mencatat transaksi ke Google Sheets");
  }
}

async function ensureSheetExists(sheets, spreadsheetId, sheetName) {
  const metadata = await sheets.spreadsheets.get({
    spreadsheetId: spreadsheetId,
  });
  const existingSheet = metadata.data.sheets.find(
    (s) => s.properties.title === sheetName
  );

  if (existingSheet) {
    return;
  }
  console.log(`Sheet ${sheetName} tidak ditemukan. Membuat sheet baru...`);

  const batchUpdateRequest = {
    requests: [
      {
        addSheet: {
          properties: {
            title: sheetName,
          },
        },
      },
    ],
  };

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: spreadsheetId,
    resource: batchUpdateRequest,
  });

  const headerValueResource = {
    values: [HEADERS],
  };
  await sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheetId,
    range: `${sheetName}!A1:E1`, // Menulis header di baris pertama
    valueInputOption: "USER_ENTERED",
    resource: headerValueResource,
  });

  console.log(`Sheet "${sheetName}" berhasil dibuat dengan header.`);
}

module.exports = { appendTransactionToSheet };

const { google } = require("googleapis");
const sheetAuth = require("../config/google-sheet.js");
const { getSpreadSheetId } = require("../config/google-sheet.js");
const { formatDate } = require("../utils/formatDate.js");

const SPREADSHEET_ID = getSpreadSheetId();

async function appendTransactionToSheet(transaction) {
  const auth = await sheetAuth.getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const rowData = [
    formatDate(new Date()),
    transaction.description,
    transaction.amount,
    transaction.source,
    "Pengeluaran",
  ];

  const resource = {
    values: [rowData],
  };

  try {
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "A2:E",
      valueInputOption: "USER_ENTERED",
      resource: resource,
    });
    return result.data;
  } catch (error) {
    console.error("Error saat menulis ke Google Sheets", error.message);
    throw new Error("Gagal mencatat transaksi ke Google Sheets");
  }
}

module.exports = { appendTransactionToSheet };

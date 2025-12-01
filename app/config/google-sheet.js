require("dotenv").config();
const { GoogleAuth } = require("google-auth-library");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const KEY_FILE_PATH = process.env.SERVICE_ACCOUNT_KEY_PATH;

function getAuth() {
  const auth = new GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: SCOPES,
  });

  return auth.getClient();
}

function getSpreadSheetId() {
  return process.env.SPREADSHEET_ID;
}

module.exports = { getAuth, getSpreadSheetId };

const parser = require("../utils/parser");
const transactionModel = require("../models/transaction.model.js");
const twilio = require("twilio");

async function handleIncomingMessage(req, res) {
  const incomingMessage = req.body.Body;
  const twiml = new twilio.twiml.MessagingResponse();
  const now = new Date();
  const monthName = now.toLocaleString("id-ID", { month: "long" });
  const year = now.getFullYear();
  const sheetName = `${monthName} - ${year}`;
  console.log("🚀 ~ handleIncomingMessage ~ sheetName:", sheetName);

  let replyMessage = "";

  try {
    const transactionData = parser.parseMessage(incomingMessage);
    if (transactionData) {
      await transactionModel.appendTransactionToSheet(
        transactionData,
        sheetName
      );
      replyMessage = `✅ Dicatat: **${
        transactionData.description
      }** Rp${transactionData.amount.toLocaleString("id-ID")} (via ${
        transactionData.source
      }).`;
    } else {
      replyMessage =
        "❌ Format tidak dikenali. Mohon gunakan format: Deskripsi Jumlah via Sumber. Contoh: Makan siang 25000 via mandiri";
    }
  } catch (error) {
    console.error("Error saat memproses pesan:", error);
    replyMessage = "Maaf, terjadi kesalahan server. Silakan coba lagi.";
  }
  twiml.message(replyMessage);
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
}

module.exports = { handleIncomingMessage };

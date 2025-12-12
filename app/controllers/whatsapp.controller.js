// app/controllers/whatsapp.controller.js

const twilio = require("twilio");
const parser = require("../utils/parser");
const transactionModel = require("../models/transaction.model");

// Fungsi utama yang dipanggil oleh router
async function handleIncomingMessage(req, res) {
  const incomingMessage = req.body.Body;
  const twiml = new twilio.twiml.MessagingResponse();
  let replyMessage = "";

  try {
    const transactionData = parser.parseMessage(incomingMessage);

    if (transactionData) {
      // Tentukan Bulan dan Tahun saat ini (untuk logika multi-sheet)
      const now = new Date();
      const monthName = now.toLocaleString("id-ID", { month: "long" });
      const year = now.getFullYear();
      const sheetName = `${monthName} - ${year}`;

      // 1. Simpan ke Google Sheets (Logika utama)
      await transactionModel.appendTransactionToSheet(
        transactionData,
        sheetName
      );

      // 2. Buat Balasan Konfirmasi yang Dinamis (Fokus di sini)

      // Format jumlah ke mata uang Rupiah
      const formattedAmount = transactionData.amount.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });

      // Tentukan kata kerja/keterangan yang sesuai
      const verb =
        transactionData.type === "Pendapatan"
          ? "diterima sebagai"
          : "dicatat sebagai";

      // Susun pesan balasan yang lengkap
      replyMessage =
        `✅ *Transaksi Berhasil Dicatat!*\n\n` +
        `📝 *Deskripsi:* ${transactionData.description}\n` +
        `💵 *Jumlah:* ${formattedAmount}\n` +
        `🏦 *Sumber/Akun:* ${transactionData.source}\n` +
        `📊 *Tipe:* ${transactionData.type} ${verb} transaksi di sheet *${sheetName}*.`;
    } else {
      // Jika parsing gagal
      replyMessage =
        "❌ Format tidak dikenali. Mohon gunakan format:\n" +
        "```\nDeskripsi Jumlah via Sumber\n```\n" +
        "Contoh Pengeluaran: *Makan siang 25000 via mandiri*\n" +
        "Contoh Pendapatan: *Gaji 5000000 via bca*";
    }
  } catch (error) {
    console.error("Error saat memproses pesan:", error);
    replyMessage = "❌ Maaf, terjadi kesalahan server saat mencatat data Anda.";
  }

  // Kirim balasan kembali ke Twilio (dalam format TwiML)
  console.log("🚀 ~ handleIncomingMessage ~ replyMessage:", replyMessage);
  twiml.message(replyMessage);
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
}

module.exports = { handleIncomingMessage };

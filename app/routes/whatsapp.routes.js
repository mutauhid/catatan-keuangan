const express = require("express");
const controller = require("../controllers/whatsapp.controller.js"); // Pastikan path benar!

const router = express.Router();

// Twilio akan mengirim POST request ke URL yang Anda set di Sandbox
router.post("/whatsapp", controller.handleIncomingMessage);

module.exports = router;

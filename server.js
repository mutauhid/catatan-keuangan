require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const whatsappRoutes = require("./app/routes/whatsapp.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(whatsappRoutes);

app.get("/", (req, res) => {
  res.send("Server Pencatatan Keuangan WhatsApp berjalan!");
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
  console.log(`URL Webhook (via ngrok): https://<your-ngrok-url>/whatsapp`);
});

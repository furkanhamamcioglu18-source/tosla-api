import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API çalışıyor");
});

app.post("/pay", async (req, res) => {
  try {

    const rnd = Math.floor(Math.random() * 1000000).toString();

    const timeSpan = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0,14);

    const hashString =
      process.env.TOSLA_API_PASS +
      process.env.TOSLA_CLIENT_ID +
      process.env.TOSLA_API_USER +
      rnd +
      timeSpan;

    const hash = crypto
      .createHash("sha512")
      .update(hashString)
      .digest("base64");

    const response = await axios.post(
      process.env.TOSLA_URL,
      {
        clientId: process.env.TOSLA_CLIENT_ID,
        apiUser: process.env.TOSLA_API_USER,
        rnd: rnd,
        timeSpan: timeSpan,
        hash: hash,

        orderId: const body = {
  clientId: parseInt(clientId),
  apiUser,
  rnd,
  timeSpan,
  hash,
  orderId: Date.now().toString(),
  callbackUrl: "https://tosla-api.onrender.com/callback",
  amount,
  currency: 949
};
        amount: 200000, // 2000 TL
        currency: 949,
        callbackUrl: "https://tosla-api.onrender.com/callback",
      }
    );

    res.json(response.data);

  } catch (error) {
    console.log("HATA:", error.response?.data || error.message);
    res.json({ status: "HATA", detay: error.response?.data });
  }
});

app.listen(3000, () => console.log("çalışıyor"));

app.post("/callback", (req, res) => {
  try {
    const {
      clientId,
      apiUser,
      orderId,
      rnd,
      timeSpan,
      hash,
      status,
      amount,
      transactionId
    } = req.body;

    const apiPass = process.env.API_PASS;

    const crypto = require("crypto");

    const hashString =
      apiPass + clientId + apiUser + orderId + rnd + timeSpan + status + amount;

    const calculatedHash = crypto
      .createHash("sha512")
      .update(hashString)
      .digest("base64");

    if (calculatedHash !== hash) {
      console.log("❌ HASH HATALI");
      return res.status(400).send("hash error");
    }

    if (status === "Onaylandı") {
      console.log("✅ ÖDEME BAŞARILI", transactionId);
    } else {
      console.log("❌ ÖDEME BAŞARISIZ");
    }

    res.send("OK");
  } catch (err) {
    console.log("HATA:", err);
    res.status(500).send("error");
  }
});
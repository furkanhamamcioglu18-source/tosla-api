require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API çalışıyor");
});

app.post("/pay", async (req, res) => {
  try {
    const response = await axios.post(process.env.TOSLA_URL, {
      clientId: process.env.TOSLA_CLIENT_ID,
      apiUser: process.env.TOSLA_API_USER,
      apiPass: process.env.TOSLA_API_PASS,

      amount: req.body.amount,
      currency: "TRY",
      orderId: req.body.orderId,

      cardNumber: req.body.cardNumber,
      expiryMonth: req.body.expiryMonth,
      expiryYear: req.body.expiryYear,
      cvv: req.body.cvv
    });

    res.json(response.data);

  } catch (err) {
    res.status(500).json(err.response?.data || "HATA");
  }
});

app.listen(3000, () => console.log("çalışıyor"));
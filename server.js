import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// test
app.get("/", (req, res) => {
  res.send("API çalışıyor");
});

// ödeme endpoint
app.post("/pay", async (req, res) => {
  try {
    const response = await axios.post(
      process.env.TOSLA_URL,
      {
        amount: req.body.amount,
        clientId: process.env.TOSLA_CLIENT_ID
      },
      {
        auth: {
          username: process.env.TOSLA_API_USER,
          password: process.env.TOSLA_API_PASS
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.log("HATA:", error.response?.data || error.message);
    res.json({ status: "HATA", detay: error.response?.data || error.message });
  }
});

app.listen(3000, () => console.log("çalışıyor"));
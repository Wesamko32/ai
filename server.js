
const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const chatResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const chatData = await chatResponse.json();
    const reply = chatData.choices[0].message.content;

    // إرسال إلى Discord Webhook
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: `💬 رسالة: ${userMessage}
🤖 رد AI: ${reply}` })
    });

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: "فشل الاتصال بـ ChatGPT." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Leqlawi AI server running on port " + PORT));

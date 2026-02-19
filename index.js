const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
const twilio = require("twilio");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Webhook endpoint
app.post("/webhook", async (req, res) => {
  const incomingMsg = req.body.Body;
  const from = req.body.From;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional real estate assistant in Dubai." },
        { role: "user", content: incomingMsg }
      ],
    });

    const reply = completion.choices[0].message.content;

    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(reply);

    res.type("text/xml").send(twiml.toString());
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

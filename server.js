import express from "express";
import cors from "cors";
import OpenAI from "openai";

import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// Create OpenAI client (server-safe)
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Endpoint your frontend will call
app.post("/ask", async (req, res) => {
    try {
        const userInput = req.body.input;

        const response = await client.responses.create({
            model: "gpt-5-nano",
            input: userInput
        });

        // Send the AI text back to the browser
        res.json({
            answer: response.output_text
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

const port = 3000;
app.listen(port, () => console.log("Server running on port " + port));
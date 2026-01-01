import express from "express";
import cors from "cors";
import OpenAI from "openai";
import 'dotenv/config';
import path from "path";                    // <--- Added this
import { fileURLToPath } from "url";        // <--- Added this for ES Modules

// Needed to recreate __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import your routes
import signupRoute from './signup.js';
import loginRoute from './login.js';

const app = express();
// Use Render's port or default to 3000
const port = process.env.PORT || 3000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// SERVING STATIC FILES
// This tells Express to serve your index.html and CSS from the current folder
app.use(express.static(path.join(__dirname, './')));

// This handles the "Root" URL (the link Render gives you)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 1. OPENAI LOGIC
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/ask", async (req, res) => {
    try {
        const userInput = req.body.input;
        const response = await client.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: userInput }]
        });

        res.json({
            answer: response.choices[0].message.content
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 2. AUTH ROUTES (Signup/Login)
app.use('/auth', signupRoute);
app.use('/auth', loginRoute);

// START SERVER
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Ready for AI chats and Signups!`);
});
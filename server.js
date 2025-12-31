import express from "express";
import cors from "cors";
import OpenAI from "openai";
import 'dotenv/config';

// Import your routes
// Note: When using "import", you often need the .js extension
import signupRoute from './signup.js';
// import loginRoute from './routes/login.js'; 
import loginRoute from './login.js';

const app = express();
const port = 3000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serves your HTML files

// 1. OPENAI LOGIC
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/ask", async (req, res) => {
    try {
        const userInput = req.body.input;
        // Note: Check your OpenAI model name. Usually it is "gpt-4o" or "gpt-3.5-turbo"
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

//login route
app.use('/auth', loginRoute);


// START SERVER
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Ready for AI chats and Signups!`);
});
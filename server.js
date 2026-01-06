import express from "express";
import cors from "cors";
import OpenAI from "openai";
import 'dotenv/config';
import path from "path";
import { fileURLToPath } from "url";
import prisma from './db.js';

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
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

app.post("/ask", async (req, res) => {
    try {
        const userInput = req.body.input;
        const response = await client.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    "role": "system",
                    "content": "Your name is Colossus. When asked, introduce yourself as Colossus and be professional. You don't need to introduce yourself if they do not ask."
                },
                {
                    "role": "user",
                    "content": userInput
                }
            ]
        });

        res.json({
            answer: response.choices[0].message.content
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Add a favorite
app.post("/api/favorites/add", async (req, res) => {
    const { userId, businessId } = req.body;
    try {
        const favorite = await prisma.favorite.create({
            data: {
                userId: parseInt(userId),
                businessId: parseInt(businessId)
            }
        });
        res.status(200).json(favorite);
    } catch (e) {
        res.status(500).json({ error: "Could not save favorite" });
    }
});

// Remove a favorite
app.post("/api/favorites/remove", async (req, res) => {
    const { userId, businessId } = req.body;
    try {
        await prisma.favorite.deleteMany({
            where: {
                userId: parseInt(userId),
                businessId: parseInt(businessId)
            }
        });
        res.status(200).json({ message: "Deleted" });
    } catch (e) {
        res.status(500).json({ error: "Could not remove favorite" });
    }
});

app.get("/api/favorites/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const favorites = await prisma.favorite.findMany({
            where: { userId: parseInt(userId) },
            select: { businessId: true }
        });
        // Return a simple array of IDs: [10, 22, 5]
        res.json(favorites.map(f => f.businessId));
    } catch (e) {
        res.status(500).json({ error: "Could not load favorites" });
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
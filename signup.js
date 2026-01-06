import express from 'express';
import bcrypt from 'bcrypt';
import prisma from './db.js';
import { validateTurnstile } from './validate.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const token = req.body['cf-turnstile-response'];
    const ip = req.ip;
    try {
        if (!token) {
            return res.status(400).json({ error: "Please complete the security check." });
        }
        const turnstileResult = await validateTurnstile(token, ip);
        if (!turnstileResult.success) {
            return res.status(403).json({ error: "Bot detection failed. Try again." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { firstName, lastName, email, password: hashedPassword },
        });
        res.status(201).json({ message: "User created!", userId: newUser.id });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Email already exists or data is invalid" });
    }
});

export default router; // Use "export default" instead of "module.exports"
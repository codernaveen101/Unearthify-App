import express from 'express';
import bcrypt from 'bcrypt';
import prisma from './db.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
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
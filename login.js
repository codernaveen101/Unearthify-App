import express from 'express';
import bcrypt from 'bcrypt';
import prisma from './db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user by email
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        // 2. If user doesn't exist, stop here
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 3. Compare the entered password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // SUCCESS: You would typically set up a session or JWT here
            res.json({ message: "Login successful!", user: { firstName: user.firstName, lastName: user.lastName } });
        } else {
            // FAILURE: Passwords didn't match
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ error: "Something went wrong on the server" });
    }
});

export default router;
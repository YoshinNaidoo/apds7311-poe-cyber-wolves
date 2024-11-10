import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { bruteForce, resetBruteForce } from '../middleware/bruteForceProtectionMiddleware.js';
import loginAttemptLogger from '../middleware/loginAttemptLogMiddleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// base route
router.get('/', (req, res) => {
    res.send("Hello auth");
});

// Login route
router.post('/login', bruteForce.prevent, loginAttemptLogger, async (req, res) => {
    try {
        const { username, password, ibanPayer } = req.body;

        // Find user
        const user = await User.findOne({ username }).select('+password');
        if (!user) {
            console.log('User not found');
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Incorrect password');
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // Check IBAN
        if (user.ibanPayer !== ibanPayer) {
            console.log('Incorrect IBAN');
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // Create token - moved outside nested try-catch
        const token = jwt.sign(
            { 
                id: user._id,
                username: user.username,
                ibanPayer: user.ibanPayer 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Reset brute force counter on successful login
        await resetBruteForce(req, res, () => {
            res.json({
                token,
                user: {
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            });
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            message: 'Internal Server error',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Register route
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, username, idNumber, password, ibanPayer } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [
                { username },
                { idNumber },
                { ibanPayer }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists (duplicate username/id/acc number)"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            firstName,
            lastName,
            username,
            idNumber,
            password: hashedPassword,
            ibanPayer
        });

        await newUser.save();
        
        res.status(201).json({
            message: "User created successfully",
            username: newUser.username
        });

    } catch (err) {
        console.error('Registration error:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation Error',
                error: err.message
            });
        }
        res.status(500).json({
            message: 'Registration failed',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

export default router;
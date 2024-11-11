import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { bruteForce, resetBruteForce } from '../middleware/bruteForceProtectionMiddleware.js';

import loginAttemptLogger from '../middleware/loginAttemptLogMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';
import Post from '../models/Post.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// Login endpoint
router.post('/', bruteForce.prevent, loginAttemptLogger, async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt for username:', username);

        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required'
            });
        }
        
        const query = { username: String(username) };
        const employee = await Employee.findOne(query);

        if (!employee) {
            console.log('Employee not found:', username);
            return res.status(401).json({
                message: 'Authentication failed'
            });
        }

        console.log('Employee found, verifying password');
        const isValidPassword = await bcrypt.compare(password, employee.password);
        if (!isValidPassword) {
            console.log('Invalid password for:', username);
            return res.status(401).json({
                message: 'Authentication failed'
            });
        }

        console.log('Password verified, generating token');
        const token = jwt.sign(
            { 
                employeeId: employee.employeeId, 
                username: employee.username,
                role: employee.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login successful for:', username);
        res.status(200).json({
            token: token,
            employeeId: employee.employeeId,
            username: employee.username,
            role: employee.role
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Login failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get employee profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const employee = await Employee.findOne(
            { employeeId: req.userData.employeeId },
            { password: 0 }
        );
        
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(employee);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ 
            message: 'Failed to fetch profile',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get pending transactions
router.get('/transactions/pending', authMiddleware, async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 });
            
        res.json(posts);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ 
            message: 'Failed to fetch transactions',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
});

// Verify transaction
router.put('/transactions/:id/verify', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        
        const isSwiftCodeValid = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(post.swiftCode);
        const isIbanValid = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(post.ibanPayee);

        if (!isSwiftCodeValid || !isIbanValid) {
            return res.status(400).json({ message: 'Invalid SWIFT code or IBAN' });
        }

        // Update the post with verification details
        post.verifiedBy = req.userData.employeeId;
        post.verifiedAt = new Date();
        post.status = 'verified';

        await post.save();

        res.json({
            message: 'Transaction verified successfully',
            post
        });

    } catch (err) {
        console.error('Error verifying transaction:', err);
        res.status(500).json({ 
            message: 'Failed to verify transaction',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
});

export default router;
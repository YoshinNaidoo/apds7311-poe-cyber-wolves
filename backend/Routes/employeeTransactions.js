// Routes/employeeTransactions.js
import express from 'express';
import mongoose from 'mongoose';
import { checkAuth } from '../middleware/check-auth.js';

const router = express.Router();

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    customerName: String,
    accountNumber: String,
    amount: Number,
    currency: String,
    swiftCode: String,
    status: { type: String, default: 'pending' },
    verifiedBy: String,
    verifiedAt: Date
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Get all pending transactions
router.get('/pending', checkAuth, async (req, res) => {
    try {
        if (req.userData.role !== 'employee') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const transactions = await Transaction.find({ status: 'pending' });
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
});

// Verify and submit transaction to SWIFT
router.post('/verify/:transactionId', checkAuth, async (req, res) => {
    try {
        if (req.userData.role !== 'employee') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { transactionId } = req.params;
        const { swiftCode } = req.body;

        // Validate SWIFT code format
        const swiftCodeRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
        if (!swiftCodeRegex.test(swiftCode)) {
            return res.status(400).json({ message: 'Invalid SWIFT code format' });
        }

        const transaction = await Transaction.findByIdAndUpdate(
            transactionId,
            {
                $set: {
                    status: 'verified',
                    verifiedBy: req.userData.employeeId,
                    verifiedAt: new Date(),
                    swiftCode: swiftCode
                }
            },
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // In a real application, you would integrate with SWIFT's API here
        console.log(`Transaction ${transactionId} submitted to SWIFT with code ${swiftCode}`);

        res.status(200).json({
            message: 'Transaction verified and submitted to SWIFT',
            transaction
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ message: 'Error verifying transaction' });
    }
});

export default router;
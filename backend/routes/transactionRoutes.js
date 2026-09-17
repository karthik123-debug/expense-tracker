// backend/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/authMiddleware'); // Crucial import

// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions
// @access  Private 
router.get('/', protect, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 });
        return res.status(200).json(transactions);
    } catch (err) {
        return res.status(500).json({ message: 'Server Error: Could not fetch transactions' });
    }
});

// @desc    Add new transaction
// @route   POST /api/transactions
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { text, amount, date, category, type, note } = req.body;
        
        if (!text || !amount || !date || !category || !type) {
            return res.status(400).json({ message: 'Please include all required fields' });
        }
        
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) {
            return res.status(400).json({ message: 'Amount must be a valid number' });
        }

        const transaction = await Transaction.create({
            user: req.user._id, 
            text,
            amount: numAmount,
            date,
            category,
            type,
            note
        });

        return res.status(201).json(transaction);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error: Could not add transaction' });
    }
});

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Check ownership
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this transaction' });
        }

        transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } 
        );

        return res.status(200).json(transaction);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error: Could not update transaction' });
    }
});

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Check ownership
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this transaction' });
        }

        await transaction.deleteOne();

        return res.status(200).json({ message: 'Transaction removed' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error: Could not delete transaction' });
    }
});

// @desc    Delete ALL transactions for the user
// @route   DELETE /api/transactions/clearall
// @access  Private
router.delete('/clearall', protect, async (req, res) => {
    try {
        const result = await Transaction.deleteMany({ user: req.user._id });
        return res.status(200).json({ message: `${result.deletedCount} transactions removed.` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error: Could not clear all transactions' });
    }
});

module.exports = router;
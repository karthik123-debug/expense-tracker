// backend/models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    // Link transaction to a user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        trim: true,
        required: [true, 'Please add some text'],
    },
    amount: {
        // Can be positive (income) or negative (expense)
        type: Number,
        required: [true, 'Please add a positive or negative number'],
    },
    date: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['income', 'expense'], // Enforce type consistency
        required: true,
    },
    note: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// FIX: Check if model exists before compiling to prevent OverwriteModelError
module.exports = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
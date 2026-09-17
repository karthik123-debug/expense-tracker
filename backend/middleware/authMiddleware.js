// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            // This handles expired/malformed tokens
            return res.status(401).json({ message: 'Not authorized, token failed' }); // ADDED 'return'
        }
    }

    if (!token) {
        // This handles no token at all
        return res.status(401).json({ message: 'Not authorized, no token' }); // ADDED 'return'
    }
};

module.exports = { protect };
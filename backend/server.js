// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Allows us to accept JSON data in the body
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
}));

// Routes
// Note: require() returns the router function, which is correct.
app.use('/api/users', require('./routes/authRoutes')); 
app.use('/api/transactions', require('./routes/transactionRoutes')); 

// Basic check route (Should be outside of the route imports above)
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
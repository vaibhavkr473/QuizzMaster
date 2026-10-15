const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const resultRoutes = require('./routes/resultRoutes');
const profileRoutes = require('./routes/profileRoutes');
const leaderboardRoutes = require('./routes/LeaderboardRoutes');
// const openaiRoute = require('./routes/openai');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
const allowedOrigins = new Set([
    ...(process.env.CORS_ORIGIN || '').split(','),
    process.env.VITE_FRONTEND_URL,
    ...(!process.env.CORS_ORIGIN && !process.env.VITE_FRONTEND_URL
        ? ['http://localhost:3000', 'http://localhost:5173']
        : [])
].map((origin) => origin?.trim()).filter(Boolean));

app.use(cors({
    origin: (origin, callback) => {
        callback(null, !origin || allowedOrigins.has(origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    limits: { fileSize: 0.1 * 1024 * 1024 },
    createParentPath: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Health check route
app.get('/', (req, res) => {
    res.send('Quiz App Backend is running!');
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/quizzes/generate', quizRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/user', profileRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
// app.use('/api/openai', openaiRoute);

// Serve static files
app.use('/avatars', express.static(path.join(__dirname, 'public/uploads/avatars')));

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Add this after your routes

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Export the app
module.exports = app;

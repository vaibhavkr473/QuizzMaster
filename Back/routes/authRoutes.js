const express = require('express');
const { signup, login, sendOTP, verifyOTP, getMe, resetPassword, verifyEmail } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Sign & Verify
router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword); // Add reset-password route
router.get('/verify-email', verifyEmail);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
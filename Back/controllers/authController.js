const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTP, sendVerificationEmail } = require('../utils/email');

// In-memory OTP storage with Map
const otpStorage = new Map();

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Signup with password hashing
exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password, username } = req.body;

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ email: normalizedEmail }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or username already exists" });
    }

    // Create user
    const user = new User({
      name,
      email: normalizedEmail,
      phone,
      password, // Raw password passed here
      username,
      isVerified: true, // Set isVerified to true by default
    });

    await user.save(); // Password is hashed by the pre('save') hook

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: messages.join(", ") });
    }

    res.status(500).json({ error: "Signup failed" });
  }
};

// Login with password verification
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: email }],
    });
    if (!user) {
      return res.status(400).json({ error: 'Invalid USER Credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid PASS Credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Cannot fetch user' });
  }
};

// Send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase();

    // Generate new OTP
    const otp = generateOTP();
    
    // Store OTP with expiration (10 minutes)
    otpStorage.set(normalizedEmail, {
      otp,
      expiresAt: Date.now() + 600000, // 10 minutes
      attempts: 0 // Track verification attempts
    });

    // Log for debugging
    console.log(`OTP for ${normalizedEmail}:`, otp);

    // Send OTP via email
    await sendOTP(normalizedEmail, otp);

    res.json({ 
      success: true, 
      message: 'OTP sent successfully',
      expiresIn: '10 minutes'
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const normalizedEmail = email.toLowerCase();
    const storedData = otpStorage.get(normalizedEmail);

    // Check if OTP exists
    if (!storedData) {
      return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
    }

    // Check attempts
    if (storedData.attempts >= 3) {
      otpStorage.delete(normalizedEmail);
      return res.status(400).json({ error: 'Too many attempts. Please request a new OTP.' });
    }

    // Increment attempts
    storedData.attempts += 1;
    otpStorage.set(normalizedEmail, storedData);

    // Verify expiration
    if (Date.now() > storedData.expiresAt) {
      otpStorage.delete(normalizedEmail);
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({ 
        error: 'Invalid OTP',
        remainingAttempts: 3 - storedData.attempts
      });
    }

    // OTP is valid - clean up
    otpStorage.delete(normalizedEmail);

    res.json({ 
      success: true, 
      message: 'OTP verified successfully' 
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    const storedOtp = otpStorage.get(normalizedEmail);
    if (!storedOtp || storedOtp.otp !== otp) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    otpStorage.delete(normalizedEmail);
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Update the user's `isVerified` field
    const user = await User.findByIdAndUpdate(decoded.userId, { isVerified: true }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Email verification failed' });
  }
};

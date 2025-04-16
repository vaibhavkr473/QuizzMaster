const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^[0-9]{10}$/, "Please use a valid 10-digit phone number"],
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        match: [/^[a-zA-Z0-9]+$/, "Username must contain only letters and numbers"],
        trim: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12); // Cost factor is 12
    next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quizId: { type: String, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    feedback: { type: Array, default: [] },
    timeSpent: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);
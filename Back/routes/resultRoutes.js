const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    getResults,
    getResultById,
    saveResult,
    getUserSummary,
    getLeaderboard
} = require('../controllers/resultsController');

// Results routes
router.get('/summary', protect, getUserSummary);
router.get('/leaderboard', protect, getLeaderboard);
router.get('/:id', protect, getResultById);
router.get('/:quizId', getResults); // Ensure `getResults` is properly defined
router.post('/', protect, saveResult);

module.exports = router;
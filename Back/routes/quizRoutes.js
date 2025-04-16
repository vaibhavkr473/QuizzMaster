const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    getAllQuizzes, 
    getQuizById,
    submitQuiz,
    generateQuiz
} = require('../controllers/quizController');

// Update routes to handle async functions
router.get('/', async (req, res, next) => {
    try {
        await getAllQuizzes(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        await getQuizById(req, res);
    } catch (error) {
        next(error);
    }
});

router.post('/generate', protect, generateQuiz);
router.post('/:id/submit', protect, submitQuiz);

module.exports = router;
const path = require('path');
const fs = require('fs').promises;
const Result = require('../models/Result');

// Remove direct requires and add async loading function
const loadQuizzes = async () => {
    try {
        const dataDir = path.join(__dirname, '..', 'data');
        const files = await fs.readdir(dataDir);
        let allQuizzes = [];

        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(dataDir, file);
                const fileContent = await fs.readFile(filePath, 'utf-8');
                const quizzes = JSON.parse(fileContent);
                
                // Add category based on filename
                const category = file.replace('.json', '');
                const categorizedQuizzes = quizzes.map(quiz => ({
                    ...quiz,
                    category: category === 'quizzes' ? 'General' : category
                }));
                
                allQuizzes = [...allQuizzes, ...categorizedQuizzes];
            }
        }
        return allQuizzes;
    } catch (error) {
        console.error('Error loading quizzes:', error);
        return [];
    }
};

// Update getAllQuizzes to use async loading
exports.getAllQuizzes = async (req, res) => {
    try {
        const allQuizzes = await loadQuizzes();
        
        // Add generated quizzes if they exist
        const quizzesToSend = [
            ...allQuizzes,
            ...(global.generatedQuizzes || [])
        ];

        res.status(200).json(quizzesToSend);
    } catch (err) {
        console.error('Error fetching quizzes:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update getQuizById to use async loading
exports.getQuizById = async (req, res) => {
    try {
        const quizId = req.params.id;
        const allQuizzes = await loadQuizzes();
        
        // Search in all quizzes
        let quiz = allQuizzes.find(q => q.id === quizId);
        
        // If not found in JSON files, check generated quizzes
        if (!quiz && global.generatedQuizzes) {
            quiz = global.generatedQuizzes.find(q => q.id === quizId);
        }

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(200).json(quiz);
    } catch (err) {
        console.error('Error fetching quiz:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update the submitQuiz function
exports.submitQuiz = async (req, res) => {
    try {
        const { answers, timeSpent } = req.body;
        const quizId = req.params.id;

        if (!req.userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Load all quizzes and find the specific quiz
        const allQuizzes = await loadQuizzes();
        const quiz = allQuizzes.find(q => q.id === quizId) || 
                    (global.generatedQuizzes || []).find(q => q.id === quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Invalid answers format' });
        }

        // Calculate score and generate feedback
        let score = 0;
        const feedback = quiz.questions.map((question, index) => {
            const userAnswer = answers[index]?.selectedAnswer || null;
            const isCorrect = question.answer === userAnswer;
            if (isCorrect) score++;

            return {
                questionText: question.question || `Question ${index + 1}`,
                selectedAnswer: userAnswer || 'Not answered',
                correctAnswer: question.answer,
                isCorrect,
                explanation: question.explanation || null
            };
        });

        // Save result to database
        const result = await Result.create({
            user: req.userId,
            quizId,
            score,
            totalQuestions: quiz.questions.length,
            feedback,
            timeSpent: timeSpent || 0,
            completedAt: new Date()
        });

        // Return comprehensive response
        res.status(200).json({
            success: true,
            resultId: result._id,
            quizId,
            score,
            totalQuestions: quiz.questions.length,
            percentageScore: Math.round((score / quiz.questions.length) * 100),
            feedback,
            timeSpent: timeSpent || 0
        });

    } catch (error) {
        console.error('Quiz submission error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error submitting quiz',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Add this new controller function
exports.generateQuiz = async (req, res) => {
    try {
        const { quiz } = req.body;
        
        if (!quiz || !quiz.questions) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid quiz format' 
            });
        }

        // Create a unique ID for the generated quiz
        const generatedQuiz = {
            id: `generated-${Date.now()}`,
            title: quiz.title || 'Generated Quiz',
            questions: quiz.questions,
            isGenerated: true,
            createdBy: req.userId,
            createdAt: new Date()
        };

        // Store in memory (or you can store in database)
        global.generatedQuizzes = global.generatedQuizzes || [];
        global.generatedQuizzes.push(generatedQuiz);

        res.status(201).json(generatedQuiz);
    } catch (error) {
        console.error('Quiz generation error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to process generated quiz' 
        });
    }
};
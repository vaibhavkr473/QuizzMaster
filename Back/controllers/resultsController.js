const Result = require('../models/Result');
const User = require('../models/User');

// Helper functions
const generateRecommendations = (categoryScores) => {
    const recommendations = [];
    categoryScores.forEach(({ category, score }) => {
        if (score < 70) {
            recommendations.push({
                title: `Improve ${category}`,
                description: `Your score in ${category} is ${score}%. Try more practice quizzes in this category.`
            });
        }
    });
    return recommendations;
};

const calculateUserRank = async (userId, userScore) => {
    try {
        const betterScores = await Result.aggregate([
            {
                $group: {
                    _id: '$user',
                    averageScore: { $avg: { $divide: ['$score', '$totalQuestions'] } }
                }
            },
            {
                $match: {
                    averageScore: { $gt: userScore / 100 }
                }
            },
            { $count: 'count' }
        ]);
        return (betterScores[0]?.count || 0) + 1;
    } catch (error) {
        console.error('Error calculating rank:', error);
        return 'N/A';
    }
};

// Define all controller functions without exports.
const getResults = async (req, res) => {
    try {
        const { quizId } = req.params;
        const results = await Result.find({ quizId });

        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'Results not found' });
        }

        res.json(results);
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ message: 'Failed to fetch results' });
    }
};

const getResultById = async (req, res) => {
    try {
        const result = await Result.findOne({
            quizId: req.params.id,
            user: req.userId
        });

        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }

        res.json(result);
    } catch (error) {
        console.error('Error fetching result:', error);
        res.status(500).json({ message: 'Failed to fetch result' });
    }
};

const saveResult = async (req, res) => {
    try {
        const { quizId, score, totalQuestions, feedback, timeSpent } = req.body;

        // Validate required fields
        if (!quizId || score === undefined || !totalQuestions) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Use findOneAndUpdate with upsert option
        const result = await Result.findOneAndUpdate(
            {
                user: req.userId,
                quizId: quizId
            },
            {
                $set: {
                    score,
                    totalQuestions,
                    feedback,
                    timeSpent,
                    completedAt: new Date()
                }
            },
            {
                new: true,      // Return updated document
                upsert: true,   // Create if doesn't exist
                runValidators: true  // Run model validators
            }
        );

        // Send response
        res.status(200).json({
            success: true,
            message: 'Result saved successfully',
            resultId: result._id,
            quizId,
            score,
            totalQuestions,
            percentageScore: Math.round((score / totalQuestions) * 100),
            feedback,
            timeSpent
        });

    } catch (error) {
        console.error('Error saving result:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to save result',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const getUserSummary = async (req, res) => {
    try {
        const results = await Result.find({ user: req.userId });
        
        // Add default values to prevent SVG rendering issues
        const totalQuizzes = results.length || 0;
        const totalQuestions = results.reduce((sum, result) => sum + (result.totalQuestions || 0), 0);
        const correctAnswers = results.reduce((sum, result) => sum + (result.score || 0), 0);
        const incorrectAnswers = totalQuestions - correctAnswers;

        // Initialize categoryScores with default structure
        const categoryScores = {};
        results.forEach(result => {
            if (result.category) {
                if (!categoryScores[result.category]) {
                    categoryScores[result.category] = {
                        attempts: 0,
                        correct: 0,
                        total: 0
                    };
                }
                categoryScores[result.category].attempts++;
                categoryScores[result.category].correct += (result.score || 0);
                categoryScores[result.category].total += (result.totalQuestions || 0);
            }
        });

        // Ensure there's at least one category for the chart
        if (Object.keys(categoryScores).length === 0) {
            categoryScores['General'] = {
                attempts: 0,
                correct: 0,
                total: 1  // Prevent division by zero
            };
        }

        // Format for response with safe calculations
        const summary = {
            totalQuizzes,
            correctAnswers,
            incorrectAnswers,
            averageScore: totalQuestions > 0 
                ? Math.round((correctAnswers / totalQuestions) * 100) 
                : 0,
            rank: await calculateUserRank(req.userId),
            categoryPerformance: Object.entries(categoryScores).map(([category, data]) => ({
                category,
                score: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
                attempts: data.attempts
            })).filter(item => item.score >= 0)  // Remove invalid scores
        };

        res.json(summary);
    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).json({ 
            message: 'Error generating summary',
            error: error.message 
        });
    }
};

const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Result.aggregate([
            {
                $group: {
                    _id: '$user',
                    totalScore: { $sum: '$score' },
                    totalQuizzes: { $sum: 1 },
                    averageScore: { $avg: { $divide: ['$score', '$totalQuestions'] } }
                }
            },
            { $sort: { averageScore: -1 } },
            { $limit: 10 }
        ]);

        const populatedLeaderboard = await User.populate(leaderboard, {
            path: '_id',
            select: 'username avatar'
        });

        res.json(populatedLeaderboard.map(entry => ({
            userId: entry._id._id,
            username: entry._id.username,
            avatar: entry._id.avatar,
            score: Math.round(entry.averageScore * 100),
            totalQuizzes: entry.totalQuizzes
        })));
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Error fetching leaderboard' });
    }
};

// Single export at the end of the file
module.exports = {
    getResults,
    getResultById,
    saveResult,
    getUserSummary,
    getLeaderboard
};
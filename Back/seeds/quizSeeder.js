const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const quizzes = require('../data/quizzes.json');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        try {
            // Clear existing quizzes
            await Quiz.deleteMany({});
            
            // Insert quizzes from JSON
            await Quiz.insertMany(quizzes);
            
            console.log('Quiz data seeded successfully!');
            process.exit(0);
        } catch (error) {
            console.error('Error seeding quiz data:', error);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
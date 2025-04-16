const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Resume = require('../models/Resume');

const router = express.Router();

// Save resume
router.post('/', protect, async (req, res) => {
  try {
    const resume = new Resume({
      userId: req.userId,
      data: req.body
    });
    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save resume' });
  }
});

// Get user's resumes
router.get('/', protect, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

module.exports = router;
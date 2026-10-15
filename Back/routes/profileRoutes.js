const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  uploadAvatar
} = require('../controllers/profileController');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/profile/avatar', protect, uploadAvatar);

module.exports = router;
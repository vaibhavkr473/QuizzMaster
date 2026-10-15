const Profile = require('../models/Profile');
const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.userId });
    const user = await User.findById(req.userId);

    if (!profile) {
      // Create default profile if none exists
      profile = await Profile.create({
        user: req.userId,
        fullName: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        dob: null,
        gender: 'prefer not to say',
        education: {},
        work: {},
        skills: [],
        socialLinks: {}
      });
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    let profile = await Profile.findOne({ user: req.userId });

    if (!profile) {
      profile = new Profile({
        user: req.userId,
        ...updates
      });
    } else {
      Object.assign(profile, updates);
    }

    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Upload avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.avatar;
    const fileName = `${req.userId}-${Date.now()}${path.extname(file.name)}`;
    const filePath = `uploads/avatars/${fileName}`;

    await file.mv(path.join(__dirname, '..', 'public', filePath));

    const profile = await Profile.findOneAndUpdate(
      { user: req.userId },
      { avatar: `/avatars/${fileName}` },
      { new: true }
    );

    res.json({ avatar: profile.avatar });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
};
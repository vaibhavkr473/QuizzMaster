const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: String,
  email: String,
  phone: String,
  dob: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer not to say'],
    default: 'prefer not to say'
  },
  bio: String,
  location: String,
  avatar: String,
  education: {
    degree: String,
    institution: String,
    graduationYear: String,
    field: String,
    achievements: String
  },
  work: {
    currentRole: String,
    company: String,
    experience: String,
    skills: String,
    achievements: String
  },
  skills: [String],
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    website: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);
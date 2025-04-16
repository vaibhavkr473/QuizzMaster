import React, { useContext, useState, useEffect } from "react";
import {
  Container, Grid, Paper, Avatar, Typography, Button, IconButton, Tab, Tabs, Box, TextField, Chip, LinearProgress, Divider, Badge, Alert, MenuItem
} from "@mui/material";
import {
  Edit, PhotoCamera, Save, Cancel, School, Work, Email, Phone, LocationOn, LinkedIn, GitHub, Language, Twitter
} from "@mui/icons-material";
import { motion } from "framer-motion";
import AuthContext from "../context/AuthContext";
import api from "../services/api";
import styles from "../styles/pages/Profile.module.css";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [imagePreview, setImagePreview] = useState(null);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: null,
    gender: "prefer not to say",
    bio: "",
    location: "",
    education: {
      degree: "",
      institution: "",
      graduationYear: "",
      field: "",
      achievements: ""
    },
    work: {
      currentRole: "",
      company: "",
      experience: "",
      skills: "",
      achievements: ""
    },
    skills: [],
    socialLinks: {
      linkedin: "",
      github: "",
      twitter: "",
      website: ""
    }
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/profile");
      
      // Merge received data with default state structure
      setProfileData(prevState => ({
        ...prevState,
        ...response.data,
        // Ensure nested objects exist
        education: {
          ...prevState.education,
          ...(response.data.education || {})
        },
        work: {
          ...prevState.work,
          ...(response.data.work || {})
        },
        socialLinks: {
          ...prevState.socialLinks,
          ...(response.data.socialLinks || {})
        },
        skills: response.data.skills || []
      }));

      if (response.data.avatar) {
        setImagePreview(response.data.avatar);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      setMessage({
        type: "error",
        text: "Failed to fetch profile data"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put("/user/profile", profileData);
      setMessage({ 
        type: "success", 
        text: "Profile updated successfully" 
      });
      setEditMode(false);
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage({ 
        type: "error", 
        text: "Failed to update profile" 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Container className={styles.container}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Container className={styles.container}>
        <Paper elevation={3} className={styles.profileCard}>
          {/* Profile Header */}
          <Box className={styles.profileHeader}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                editMode && (
                  <IconButton 
                    color="primary" 
                    component="label" 
                    className={styles.uploadButton}
                  >
                    <PhotoCamera />
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleImageChange}
                    />
                  </IconButton>
                )
              }
            >
              <Avatar 
                src={imagePreview || user?.avatar} 
                className={styles.avatar}
              />
            </Badge>

            <Box className={styles.headerInfo}>
              <Typography variant="h4">
                {profileData.fullName || user?.username}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {profileData.email || user?.email}
              </Typography>
              {!editMode && (
                <Button
                  startIcon={<Edit />}
                  onClick={() => setEditMode(true)}
                  className={styles.editButton}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Box>

          {/* Message Alert */}
          {message.text && (
            <Alert 
              severity={message.type} 
              onClose={() => setMessage({ type: "", text: "" })}
              sx={{ mb: 2 }}
            >
              {message.text}
            </Alert>
          )}

          {/* Profile Content */}
          <Box className={styles.profileContent}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              className={styles.tabs}
            >
              <Tab label="Basic Info" />
              <Tab label="Education & Work" />
              <Tab label="Skills & Social" />
            </Tabs>

            {/* Tab Panels */}
            <Box className={styles.tabContent}>
              {activeTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={profileData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={profileData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Date of Birth"
                      value={profileData.dob ? new Date(profileData.dob).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleChange("dob", e.target.value)}
                      disabled={!editMode}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Gender"
                      value={profileData.gender}
                      onChange={(e) => handleChange("gender", e.target.value)}
                      disabled={!editMode}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                      <MenuItem value="prefer not to say">Prefer not to say</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      multiline
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      disabled={!editMode}
                    />
                  </Grid>
                </Grid>
              )}

              {activeTab === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      borderBottom: '2px solid #1976d2',
                      pb: 1,
                      mb: 3
                    }}>
                      Education Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Degree/Certification"
                          value={profileData.education.degree}
                          onChange={(e) => handleChange("education", {
                            ...profileData.education,
                            degree: e.target.value
                          })}
                          disabled={!editMode}
                          InputProps={{
                            startAdornment: (
                              <School sx={{ color: 'action.active', mr: 1 }} />
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Institution"
                          value={profileData.education.institution}
                          onChange={(e) => handleChange("education", {
                            ...profileData.education,
                            institution: e.target.value
                          })}
                          disabled={!editMode}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Field of Study"
                          value={profileData.education.field}
                          onChange={(e) => handleChange("education", {
                            ...profileData.education,
                            field: e.target.value
                          })}
                          disabled={!editMode}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Graduation Year"
                          type="number"
                          value={profileData.education.graduationYear}
                          onChange={(e) => handleChange("education", {
                            ...profileData.education,
                            graduationYear: e.target.value
                          })}
                          disabled={!editMode}
                          InputProps={{
                            inputProps: { min: 1900, max: new Date().getFullYear() + 5 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Academic Achievements"
                          multiline
                          rows={3}
                          value={profileData.education.achievements}
                          onChange={(e) => handleChange("education", {
                            ...profileData.education,
                            achievements: e.target.value
                          })}
                          disabled={!editMode}
                          placeholder="List your academic achievements, honors, or relevant coursework"
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" gutterBottom sx={{ 
                      borderBottom: '2px solid #1976d2',
                      pb: 1,
                      mb: 3
                    }}>
                      Work Experience
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Current Role"
                          value={profileData.work.currentRole}
                          onChange={(e) => handleChange("work", {
                            ...profileData.work,
                            currentRole: e.target.value
                          })}
                          disabled={!editMode}
                          InputProps={{
                            startAdornment: (
                              <Work sx={{ color: 'action.active', mr: 1 }} />
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Company/Organization"
                          value={profileData.work.company}
                          onChange={(e) => handleChange("work", {
                            ...profileData.work,
                            company: e.target.value
                          })}
                          disabled={!editMode}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Years of Experience"
                          value={profileData.work.experience}
                          onChange={(e) => handleChange("work", {
                            ...profileData.work,
                            experience: e.target.value
                          })}
                          disabled={!editMode}
                          placeholder="e.g., 5+ years"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Technical Skills"
                          value={profileData.work.skills}
                          onChange={(e) => handleChange("work", {
                            ...profileData.work,
                            skills: e.target.value
                          })}
                          disabled={!editMode}
                          placeholder="Key technical skills used in your role"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Professional Achievements"
                          multiline
                          rows={3}
                          value={profileData.work.achievements}
                          onChange={(e) => handleChange("work", {
                            ...profileData.work,
                            achievements: e.target.value
                          })}
                          disabled={!editMode}
                          placeholder="List your key professional achievements and responsibilities"
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        fullWidth
                        label="Current Location"
                        value={profileData.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: (
                            <LocationOn sx={{ color: 'action.active', mr: 1 }} />
                          ),
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              )}

              {activeTab === 2 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Skills (comma-separated)"
                      placeholder="React, JavaScript, Node.js..."
                      value={profileData.skills.join(", ")}
                      onChange={(e) => handleChange("skills", e.target.value.split(",").map(skill => skill.trim()))}
                      disabled={!editMode}
                      helperText="Enter your skills separated by commas"
                    />
                    <Box className={styles.chipGroup}>
                      {profileData.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          onDelete={editMode ? () => {
                            const newSkills = profileData.skills.filter((_, i) => i !== index);
                            handleChange("skills", newSkills);
                          } : undefined}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Social Links
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="LinkedIn"
                          value={profileData.socialLinks.linkedin}
                          onChange={(e) => handleChange("socialLinks", {
                            ...profileData.socialLinks,
                            linkedin: e.target.value
                          })}
                          disabled={!editMode}
                          InputProps={{
                            startAdornment: (
                              <LinkedIn sx={{ color: 'action.active', mr: 1 }} />
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="GitHub"
                          value={profileData.socialLinks.github}
                          onChange={(e) => handleChange("socialLinks", {
                            ...profileData.socialLinks,
                            github: e.target.value
                          })}
                          disabled={!editMode}
                          InputProps={{
                            startAdornment: (
                              <GitHub sx={{ color: 'action.active', mr: 1 }} />
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Twitter"
                          value={profileData.socialLinks.twitter}
                          onChange={(e) => handleChange("socialLinks", {
                            ...profileData.socialLinks,
                            twitter: e.target.value
                          })}
                          disabled={!editMode}
                          InputProps={{
                            startAdornment: (
                              <Twitter sx={{ color: 'action.active', mr: 1 }} />
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Personal Website"
                          value={profileData.socialLinks.website}
                          onChange={(e) => handleChange("socialLinks", {
                            ...profileData.socialLinks,
                            website: e.target.value
                          })}
                          disabled={!editMode}
                          InputProps={{
                            startAdornment: (
                              <Language sx={{ color: 'action.active', mr: 1 }} />
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Box>

          {/* Action Buttons */}
          {editMode && (
            <Box className={styles.actionButtons}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={saving}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => setEditMode(false)}
                disabled={saving}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </motion.div>
  );
};

export default Profile;
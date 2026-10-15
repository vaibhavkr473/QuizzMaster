import React, { useState } from 'react';
import {
  Container, Paper, Typography, Stepper, Step, StepLabel,
  Box, Button, Grid, TextField, IconButton, Chip, Divider,
  FormControl, InputLabel, Select, MenuItem, Dialog, DialogContent
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import styles from '../styles/pages/ResumeBuilder.module.css';
import ResumePreview from '../components/ResumePreview';

// Personal Info Form Component
const PersonalInfoForm = ({ formData, setFormData }) => {
  const [newHobby, setNewHobby] = useState('');

  const addHobby = () => {
    if (newHobby.trim()) {
      setFormData({
        ...formData,
        personalInfo: {
          ...formData.personalInfo,
          hobbies: [...formData.personalInfo.hobbies, newHobby.trim()]
        }
      });
      setNewHobby('');
    }
  };

  const removeHobby = (hobbyToRemove) => {
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        hobbies: formData.personalInfo.hobbies.filter(hobby => hobby !== hobbyToRemove)
      }
    });
  };

  return (
    <Grid container spacing={2}>
      {/* Existing fields */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Full Name"
          value={formData.personalInfo.fullName}
          onChange={(e) => setFormData({
            ...formData,
            personalInfo: { ...formData.personalInfo, fullName: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.personalInfo.email}
          onChange={(e) => setFormData({
            ...formData,
            personalInfo: { ...formData.personalInfo, email: e.target.value }
          })}
        />
      </Grid>
      
      {/* Add Date of Birth field */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Date of Birth"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={formData.personalInfo.dateOfBirth}
          onChange={(e) => setFormData({
            ...formData,
            personalInfo: { ...formData.personalInfo, dateOfBirth: e.target.value }
          })}
        />
      </Grid>

      {/* Rest of existing fields */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Phone"
          value={formData.personalInfo.phone}
          onChange={(e) => setFormData({
            ...formData,
            personalInfo: { ...formData.personalInfo, phone: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Location"
          value={formData.personalInfo.location}
          onChange={(e) => setFormData({
            ...formData,
            personalInfo: { ...formData.personalInfo, location: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="LinkedIn"
          value={formData.personalInfo.linkedin}
          onChange={(e) => setFormData({
            ...formData,
            personalInfo: { ...formData.personalInfo, linkedin: e.target.value }
          })}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="GitHub"
          value={formData.personalInfo.github}
          onChange={(e) => setFormData({
            ...formData,
            personalInfo: { ...formData.personalInfo, github: e.target.value }
          })}
        />
      </Grid>

      {/* Add Hobbies/Interests section */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          Hobbies & Interests
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            label="Add Hobby/Interest"
            value={newHobby}
            onChange={(e) => setNewHobby(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addHobby()}
          />
          <Button
            variant="contained"
            onClick={addHobby}
            startIcon={<AddIcon />}
          >
            Add
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {formData.personalInfo.hobbies.map((hobby, index) => (
            <Chip
              key={index}
              label={hobby}
              onDelete={() => removeHobby(hobby)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};

// Education Form Component
const EducationForm = ({ formData, setFormData }) => {
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, {
        school: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: ''
      }]
    });
  };

  const removeEducation = (index) => {
    const newEducation = formData.education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: newEducation });
  };

  return (
    <Box>
      {formData.education.map((edu, index) => (
        <Box key={index} className={styles.itemContainer}>
          <IconButton
            className={styles.deleteButton}
            onClick={() => removeEducation(index)}
          >
            <DeleteIcon />
          </IconButton>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="School/University"
                value={edu.school}
                onChange={(e) => {
                  const newEducation = [...formData.education];
                  newEducation[index].school = e.target.value;
                  setFormData({ ...formData, education: newEducation });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Degree"
                value={edu.degree}
                onChange={(e) => {
                  const newEducation = [...formData.education];
                  newEducation[index].degree = e.target.value;
                  setFormData({ ...formData, education: newEducation });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Field of Study"
                value={edu.field}
                onChange={(e) => {
                  const newEducation = [...formData.education];
                  newEducation[index].field = e.target.value;
                  setFormData({ ...formData, education: newEducation });
                }}
              />
            </Grid>
          </Grid>
        </Box>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={addEducation}
        className={styles.addButton}
      >
        Add Education
      </Button>
    </Box>
  );
};

// Experience Form Component
const ExperienceForm = ({ formData, setFormData }) => {
  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, {
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    });
  };

  const removeExperience = (index) => {
    const newExperience = formData.experience.filter((_, i) => i !== index);
    setFormData({ ...formData, experience: newExperience });
  };

  return (
    <Box>
      {formData.experience.map((exp, index) => (
        <Box key={index} className={styles.itemContainer}>
          <IconButton
            className={styles.deleteButton}
            onClick={() => removeExperience(index)}
          >
            <DeleteIcon />
          </IconButton>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                value={exp.company}
                onChange={(e) => {
                  const newExperience = [...formData.experience];
                  newExperience[index].company = e.target.value;
                  setFormData({ ...formData, experience: newExperience });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position"
                value={exp.position}
                onChange={(e) => {
                  const newExperience = [...formData.experience];
                  newExperience[index].position = e.target.value;
                  setFormData({ ...formData, experience: newExperience });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={exp.description}
                onChange={(e) => {
                  const newExperience = [...formData.experience];
                  newExperience[index].description = e.target.value;
                  setFormData({ ...formData, experience: newExperience });
                }}
              />
            </Grid>
          </Grid>
        </Box>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={addExperience}
        className={styles.addButton}
      >
        Add Experience
      </Button>
    </Box>
  );
};

// Skills Form Component
const SkillsForm = ({ formData, setFormData }) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Add Skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          />
        </Grid>
        <Grid item xs={12}>
          <Box className={styles.chipContainer}>
            {formData.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                onDelete={() => removeSkill(skill)}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

// Projects Form Component
const ProjectsForm = ({ formData, setFormData }) => {
  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, {
        name: '',
        description: '',
        technologies: [],
        link: ''
      }]
    });
  };

  const removeProject = (index) => {
    const newProjects = formData.projects.filter((_, i) => i !== index);
    setFormData({ ...formData, projects: newProjects });
  };

  return (
    <Box>
      {formData.projects.map((project, index) => (
        <Box key={index} className={styles.itemContainer}>
          <IconButton
            className={styles.deleteButton}
            onClick={() => removeProject(index)}
          >
            <DeleteIcon />
          </IconButton>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                value={project.name}
                onChange={(e) => {
                  const newProjects = [...formData.projects];
                  newProjects[index].name = e.target.value;
                  setFormData({ ...formData, projects: newProjects });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={project.description}
                onChange={(e) => {
                  const newProjects = [...formData.projects];
                  newProjects[index].description = e.target.value;
                  setFormData({ ...formData, projects: newProjects });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Link"
                value={project.link}
                onChange={(e) => {
                  const newProjects = [...formData.projects];
                  newProjects[index].link = e.target.value;
                  setFormData({ ...formData, projects: newProjects });
                }}
              />
            </Grid>
          </Grid>
        </Box>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={addProject}
        className={styles.addButton}
      >
        Add Project
      </Button>
    </Box>
  );
};

const ResumeBuilder = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      dateOfBirth: '', // Add this
      hobbies: [], // Add this
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
  });
  const [previewOpen, setPreviewOpen] = useState(false);

  const steps = ['Personal Info', 'Education', 'Experience', 'Skills', 'Projects'];

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleGenerateResume = () => {
    // Add resume generation logic here
    console.log('Generating Resume:', formData);
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const handleDownload = async () => {
    const doc = new jsPDF();
    
    // Personal Info
    doc.setFontSize(20);
    doc.text(formData.personalInfo.fullName, 20, 20);
    doc.setFontSize(12);
    doc.text(formData.personalInfo.email, 20, 30);
    doc.text(formData.personalInfo.phone, 20, 40);
    
    // Add other sections...
    
    doc.save('resume.pdf');

    // Save to database
    try {
      await api.post('/resumes', formData);
    } catch (error) {
      console.error('Error saving resume:', error);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <PersonalInfoForm formData={formData} setFormData={setFormData} />;
      case 1:
        return <EducationForm formData={formData} setFormData={setFormData} />;
      case 2:
        return <ExperienceForm formData={formData} setFormData={setFormData} />;
      case 3:
        return <SkillsForm formData={formData} setFormData={setFormData} />;
      case 4:
        return <ProjectsForm formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} className={styles.paper}>
          <Typography variant="h4" gutterBottom align="center">
            Resume Builder
          </Typography>
          <Stepper activeStep={activeStep} alternativeLabel className={styles.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box className={styles.formContainer}>
            {getStepContent(activeStep)}
          </Box>
          <Box className={styles.buttonContainer}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              className={styles.button}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateResume}
                startIcon={<DownloadIcon />}
              >
                Generate Resume
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={handlePreview}
              startIcon={<PreviewIcon />}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              onClick={handleDownload}
              startIcon={<DownloadIcon />}
            >
              Download PDF
            </Button>
          </Box>
        </Paper>
      </motion.div>
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <ResumePreview data={formData} />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ResumeBuilder;
import React from 'react';
import { Paper, Typography, Box, Chip, Divider } from '@mui/material';
import { 
  Email, Phone, LocationOn, LinkedIn, GitHub, Cake, EmojiEvents
} from '@mui/icons-material';
import styles from '../styles/components/ResumePreview.module.css';

const ResumePreview = ({ data }) => {
  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      {/* Header/Personal Info */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          {data.personalInfo.fullName}
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          {data.personalInfo.email && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Email fontSize="small" />
              <Typography>{data.personalInfo.email}</Typography>
            </Box>
          )}
          {data.personalInfo.phone && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Phone fontSize="small" />
              <Typography>{data.personalInfo.phone}</Typography>
            </Box>
          )}
          {data.personalInfo.location && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <LocationOn fontSize="small" />
              <Typography>{data.personalInfo.location}</Typography>
            </Box>
          )}
          {data.personalInfo.dateOfBirth && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Cake fontSize="small" />
              <Typography>{data.personalInfo.dateOfBirth}</Typography>
            </Box>
          )}
        </Box>
        <Box display="flex" gap={2} mt={1}>
          {data.personalInfo.linkedin && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <LinkedIn fontSize="small" />
              <Typography>{data.personalInfo.linkedin}</Typography>
            </Box>
          )}
          {data.personalInfo.github && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <GitHub fontSize="small" />
              <Typography>{data.personalInfo.github}</Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Education */}
      {data.education.length > 0 && (
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>Education</Typography>
          {data.education.map((edu, index) => (
            <Box key={index} mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                {edu.school}
              </Typography>
              <Typography>
                {edu.degree} in {edu.field}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Experience */}
      {data.experience.length > 0 && (
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>Experience</Typography>
          {data.experience.map((exp, index) => (
            <Box key={index} mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                {exp.position} at {exp.company}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {exp.description}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Skills */}
      {data.skills.length > 0 && (
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>Skills</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {data.skills.map((skill, index) => (
              <Chip key={index} label={skill} variant="outlined" />
            ))}
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Projects */}
      {data.projects.length > 0 && (
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>Projects</Typography>
          {data.projects.map((project, index) => (
            <Box key={index} mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                {project.name}
              </Typography>
              <Typography variant="body2">
                {project.description}
              </Typography>
              {project.link && (
                <Typography variant="body2" color="primary">
                  {project.link}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Hobbies & Interests */}
      {data.personalInfo.hobbies?.length > 0 && (
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Hobbies & Interests
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {data.personalInfo.hobbies.map((hobby, index) => (
              <Chip 
                key={index} 
                label={hobby} 
                variant="outlined"
                icon={<EmojiEvents />} 
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default ResumePreview;
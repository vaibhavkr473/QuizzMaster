import React from "react";
import { Container, Typography, Grid, Paper, Box, IconButton } from "@mui/material";
import { GitHub, LinkedIn, Code } from "@mui/icons-material";
import { motion } from "framer-motion";
import styles from "../styles/pages/AboutUs.module.css";

const AboutUs = () => {
  const developers = [
    {
      name: "Vaibhav Kumar",
      role: "Full-stack Developer",
      description: "Full-stack developer with expertise in MERN Stack. Passionate about creating innovative solutions.",
      github: "https://github.com/yourusername1",
      linkedin: "https://linkedin.com/in/yourusername1",
      portfolio: "https://yourportfolio1.com"
    },
    {
      name: "Prince Singh",
      role: "Backend Developer",
      description: "Backend specialist with focus on system architecture and database optimization. Expert in Node.js and MongoDB.",
      github: "https://github.com/yourusername2",
      linkedin: "https://linkedin.com/in/yourusername2",
      portfolio: "https://yourportfolio2.com"
    }
  ];

  return (
    <div>
      <Container maxWidth="lg" className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h2" align="center" gutterBottom>
            About Us
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            Meet the team behind QuizMaster
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {developers.map((dev, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper elevation={3} className={styles.developerCard}>
                  <Box className={styles.developerInfo}>
                    <Typography variant="h5">{dev.name}</Typography>
                    <Typography variant="subtitle1" color="primary">
                      {dev.role}
                    </Typography>
                    <Typography>{dev.description}</Typography>
                    <Box className={styles.socialLinks}>
                      <IconButton component="a" href={dev.github} target="_blank">
                        <GitHub />
                      </IconButton>
                      <IconButton component="a" href={dev.linkedin} target="_blank">
                        <LinkedIn />
                      </IconButton>
                      <IconButton component="a" href={dev.portfolio} target="_blank">
                        <Code />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </div>
  );
};

export default AboutUs;
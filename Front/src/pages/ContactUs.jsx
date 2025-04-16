import React, { useState } from "react";
import {
  Container, Typography, TextField, Button, Paper, Grid, Box,
  IconButton, Snackbar, Alert
} from "@mui/material";
import {
  Mail, Phone, LocationOn,
  Facebook, Twitter, Instagram, LinkedIn
} from "@mui/icons-material";
import { motion } from "framer-motion";
import styles from "../styles/pages/ContactUs.module.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenSnackbar(true);
    // Handle form submission logic here
  };

  return (
    <Container maxWidth="lg" className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" align="center" gutterBottom>
          Contact Us
        </Typography>

        <Grid container spacing={4}>
          {/* First Card - Contact Information */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} className={styles.contactCard}>
              <Typography variant="h5" gutterBottom>
                Get in Touch
              </Typography>
              
              <Box className={styles.contactItem}>
                <Mail className={styles.contactIcon} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Email
                  </Typography>
                  <Typography>support@quizmaster.com</Typography>
                </Box>
              </Box>

              <Box className={styles.contactItem}>
                <Phone className={styles.contactIcon} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Phone
                  </Typography>
                  <Typography>+1 (123) 456-7890</Typography>
                </Box>
              </Box>

              <Box className={styles.contactItem}>
                <LocationOn className={styles.contactIcon} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Address
                  </Typography>
                  <Typography>
                    Chandigarh University, NH-95 Chandigarh-Ludhiana Highway,
                    Punjab 140413, India
                  </Typography>
                </Box>
              </Box>

              {/* Map */}
              <Box className={styles.mapContainer}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3424.896123383367!2d76.57180827559357!3d30.7699755738611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ffb140bd63e07%3A0x68591e334d17a988!2sChandigarh%20University!5e0!3m2!1sen!2sin!4v1682841015977!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="CU Map"
                />
              </Box>
            </Paper>
          </Grid>

          {/* Second Card - Connect & Feedback Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} className={styles.contactCard}>
              <Typography variant="h5" gutterBottom>
                Connect With Us On
              </Typography>

              <Box className={styles.socialLinks}>
                <IconButton
                  href="https://facebook.com"
                  target="_blank"
                  className={styles.socialIcon}
                >
                  <Facebook />
                </IconButton>
                <IconButton
                  href="https://twitter.com"
                  target="_blank"
                  className={styles.socialIcon}
                >
                  <Twitter />
                </IconButton>
                <IconButton
                  href="https://instagram.com"
                  target="_blank"
                  className={styles.socialIcon}
                >
                  <Instagram />
                </IconButton>
                <IconButton
                  href="https://linkedin.com"
                  target="_blank"
                  className={styles.socialIcon}
                >
                  <LinkedIn />
                </IconButton>
              </Box>

              <Typography variant="h5" gutterBottom className={styles.formTitle}>
                Send Us a Message
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Name"
                  margin="normal"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <TextField
                  fullWidth
                  label="Email"
                  margin="normal"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <TextField
                  fullWidth
                  label="Message"
                  margin="normal"
                  multiline
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  className={styles.submitButton}
                >
                  Send Message
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Message sent successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactUs;
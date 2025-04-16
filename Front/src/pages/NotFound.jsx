import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/pages/NotFound.module.css";

const NotFound = () => {
  return (
    <div>
      <Navbar />
      <Container maxWidth="md" className={styles.container}>
        <Typography variant="h1" align="center" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" align="center" gutterBottom>
          Oops! Page Not Found
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          className={styles.button}
        >
          Go to Home
        </Button>
      </Container>
      <Footer />
    </div>
  );
};

export default NotFound;

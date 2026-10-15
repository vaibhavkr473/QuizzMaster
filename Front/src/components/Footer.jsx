import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart, FaArrowUp } from "react-icons/fa";
import { IconButton, Zoom, useTheme } from "@mui/material";
import styles from "../styles/components/Footer.module.css";

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerSection}>
            <h5>QuizMaster App</h5>
            <p>A platform to test your knowledge and improve your skills with interactive quizzes.</p>
            <div className={styles.socialIcons}>
              <a href={import.meta.env.VITE_FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href={import.meta.env.VITE_TWITTER_URL} target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href={import.meta.env.VITE_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href={import.meta.env.VITE_LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h5>Quick Links</h5>
            <ul className={styles.quickLinks}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/quizzes">Quiz</Link></li>
              <li><Link to="/results">Results</Link></li>
              {/* <li><Link to="/about-us">About Us</Link></li> */}
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h5>Contact Info</h5>
            <ul className={styles.contactInfo}>
              <li>Email: support@quizapp.com</li>
              <li>Phone: +1 (123) 456-7890</li>
              <li>Address: 123 Quiz Street, Knowledge City, Heaven Nation</li>
              {/* <li><Link to="/contact-us">Contact Us</li> */}
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>
            &copy; 2025 QuizMaster App. All rights reserved. Created with{" "}
            <FaHeart style={{ color: theme.palette.error.main }} /> by{" "}
            <strong>Vaibhav RaZz</strong>.
          </p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <IconButton
          onClick={scrollToTop}
          className={styles.scrollTop}
          aria-label="scroll to top"
        >
          <FaArrowUp />
        </IconButton>
      </Zoom>
    </>
  );
};

export default Footer;

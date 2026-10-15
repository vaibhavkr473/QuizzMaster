import React from 'react';
import { useTheme } from '@mui/material';
import { WbSunny, NightsStay } from '@mui/icons-material';
import { motion } from 'framer-motion';
import styles from '../styles/components/ThemeToggle.module.css';

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  const theme = useTheme();

  return (
    <motion.div
      className={styles.toggleWrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className={styles.switchTrack}
        onClick={toggleDarkMode}
        style={{
          backgroundColor: darkMode ? '#2c3e50' : '#f1c40f',
        }}
      >
        <motion.div
          className={styles.switchThumb}
          animate={{
            x: darkMode ? 32 : 0,
            backgroundColor: darkMode ? '#34495e' : '#f39c12'
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {darkMode ? (
            <NightsStay className={styles.icon} />
          ) : (
            <WbSunny className={styles.icon} />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ThemeToggle;
import React, { useContext, useState, useEffect } from "react";
import {  Container,  Typography,  Button,  Grid,  Paper, Box, TextField, Card, CardContent, IconButton, Avatar, CircularProgress, useTheme, Stack } from "@mui/material";
import {  Quiz, AutoAwesome, Timeline, Psychology, Mail, GitHub, LinkedIn, Code, CalendarMonth, WbSunny, Cloud, WaterDrop, Air, LocationOn, Visibility, Chat } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import AuthContext from "../context/AuthContext";
import styles from "../styles/pages/Home.module.css";
import Chatbot from '../components/Chatbot';

const developers = [
  {
    name: "Vaibhav Kumar",
    role: "Frontend Developer",
    description: "Frontend specialist with expertise in React, Material-UI, and modern JavaScript. Creating responsive and interactive user interfaces with a focus on user experience.",
    github: "https://github.com/vaibhavkr473",
    linkedin: "https://linkedin.com/in/vaibhav-kumar",
    portfolio: "https://vaibhavkumar.dev",
    avatar: "/path-to-vaibhav-image.jpg"
  },
  {
    name: "Prince Singh",
    role: "Backend Developer",
    description: "Backend expert specializing in Node.js, MongoDB, and API development. Building robust and scalable server-side solutions with focus on performance & database.",
    github: "https://github.com/princesingh",
    linkedin: "https://linkedin.com/in/prince-singh",
    portfolio: "https://princesingh.dev",
    avatar: "/path-to-prince-image.jpg"
  }
];

const weatherIconStyles = {
  weatherIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
  },
  sunnyIcon: {
    color: '#FFB100',
    fontSize: '2rem',
    filter: 'drop-shadow(0 0 8px rgba(255, 177, 0, 0.5))',
    animation: 'pulse 2s infinite'
  },
  cloudyIcon: {
    color: '#90CAF9',
    fontSize: '2rem',
    filter: 'drop-shadow(0 0 8px rgba(144, 202, 249, 0.5))',
  }
};

const Home = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // First, get current weather
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Chandigarh,IN&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
        );
        
        if (!currentResponse.ok) {
          throw new Error('Weather API authentication failed');
        }
        
        const currentData = await currentResponse.json();
        
        // Then get 7-day forecast using coordinates
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
        );
        
        if (!forecastResponse.ok) {
          throw new Error('Forecast API authentication failed');
        }
        
        const forecastData = await forecastResponse.json();
        
        setWeather({
          current: currentData,
          forecast: forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 7) // Get one reading per day
        });
      } catch (error) {
        console.error('Error fetching weather:', error);
        setLocationError('Failed to fetch weather data. Please check your API key.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  const WeatherCard = () => (
    <Paper 
      className={styles.weatherCard}
      elevation={3}
      sx={{
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, rgba(26,26,26,0.9), rgba(45,45,45,0.9))'
          : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(245,245,245,0.9))'
      }}
    >
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : locationError ? (
        <Typography color="error" align="center">
          {locationError}
        </Typography>
      ) : weather && weather.current ? (
        <>
          <div className={styles.currentWeather}>
            <div className={styles.weatherInfo}>
              <Typography className={styles.temperature}>
                {Math.round(weather.current.main.temp)}°C
              </Typography>
              <Typography className={styles.weatherDescription}>
                {weather.current.weather[0].description}
                <Box component="span" ml={1}>
                  · {weather.current.name}, {weather.current.sys.country}
                </Box>
              </Typography>
              <div className={styles.weatherDetails}>
                <div className={styles.weatherDetailItem}>
                  <WaterDrop fontSize="small" />
                  <span>{weather.current.main.humidity}%</span>
                </div>
                <div className={styles.weatherDetailItem}>
                  <Air fontSize="small" />
                  <span>{Math.round(weather.current.wind.speed * 3.6)} km/h</span>
                </div>
                <div className={styles.weatherDetailItem}>
                  <Visibility fontSize="small" />
                  <span>{(weather.current.visibility / 1000).toFixed(1)} km</span>
                </div>
              </div>
            </div>
            <div className={`${styles.weatherIcon} ${styles.weatherIconLarge} ${
              weather.current.main.temp > 20 ? styles.sunnyAnimation : styles.cloudyAnimation
            }`}>
              {weather.current.main.temp > 20 ? <WbSunny /> : <Cloud />}
            </div>
          </div>
          <div className={styles.forecastSection}>
            {weather.forecast.map((forecast, index) => (
              <div key={index} className={styles.forecastDay}>
                <Typography variant="body2">
                  {new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                </Typography>
                <div className={styles.weatherIcon}>
                  {forecast.weather[0].main === "Clear" ? <WbSunny fontSize="small" /> : <Cloud fontSize="small" />}
                </div>
                <Typography variant="body2">{Math.round(forecast.main.temp)}°C</Typography>
              </div>
            ))}
          </div>
        </>
      ) : (
        <Typography>No weather data available</Typography>
      )}
    </Paper>
  );

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={styles.root}
        style={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary
        }}
      >
        {/* Hero Section */}
        <Box className={styles.hero}>
          <Container maxWidth="lg">
            <motion.div variants={itemVariants}>
              {user && (
                <Typography variant="h4" className={styles.welcome}>
                  Welcome back, {user.username}!
                </Typography>
              )}
              <Typography variant="h2" className={styles.title}>
                Welcome to QuizMaster App
              </Typography>
              <Typography variant="h5" className={styles.subtitle}>
                Test your knowledge and improve your skills with interactive quizzes
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 4 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Quiz />}
                  onClick={() => navigate('/quizzes')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Start Quiz
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Chat />}
                  onClick={() => setIsChatbotOpen(true)}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: 'primary.50',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Ask Anything
                </Button>
              </Stack>
            </motion.div>
          </Container>
        </Box>

        {/* Features Section */}
        <Container maxWidth="lg" className={styles.section}>
          <motion.div variants={itemVariants}>
            <Typography variant="h3" align="center" gutterBottom>
              Features
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card className={styles.featureCard}>
                  <CardContent>
                    <Quiz className={styles.icon} />
                    <Typography variant="h5">Interactive Quizzes</Typography>
                    <Typography>
                      Engage with quizzes tailored to your level and interests
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card className={styles.featureCard}>
                  <CardContent>
                    <Timeline className={styles.icon} />
                    <Typography variant="h5">Progress Tracking</Typography>
                    <Typography>
                      Track your performance and improve over time
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card className={styles.featureCard}>
                  <CardContent>
                    <Psychology className={styles.icon} />
                    <Typography variant="h5">AI-Powered</Typography>
                    <Typography>
                      Quizzes generated using advanced AI technology
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        </Container>

        {/* Dashboard Section */}
        <Container maxWidth="lg" className={styles.section}>
          <motion.div variants={itemVariants}>
            <Typography variant="h3" align="center" gutterBottom>
              Dashboard
            </Typography>
            <Grid 
              container 
              spacing={4} 
              // sx={{
              //   '& .MuiGrid-item': {
              //     height: '500px' // Fixed height for both grid items
              //   }
              // }}
            >
              {/* Weather Widget */}
              <Grid item xs={12} md={6}>
                <WeatherCard />
              </Grid>

              {/* Calendar Widget */}
              <Grid item xs={12} md={6}>
                <Paper 
                  className={styles.calendarCard}
                  elevation={3}
                  sx={{
                    background: theme.palette.mode === 'dark' 
                      ? 'linear-gradient(135deg, rgba(26,26,26,0.9), rgba(45,45,45,0.9))'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(245,245,245,0.9))'
                  }}
                >
                  <Typography variant="h5" className={styles.calendarHeader}>
                    Calendar
                  </Typography>
                  <Box className={styles.calendarWrapper}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateCalendar 
                        value={dayjs()} 
                        readOnly
                        sx={{
                          '& .MuiPickersDay-root': {
                            color: theme.palette.text.primary,
                          },
                          '& .MuiPickersDay-today': {
                            borderColor: theme.palette.primary.main,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        </Container>

        {/* About Us Section */}
        <Box 
          className={styles.aboutSection}
          sx={{
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
              : 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
          }}
        >
          <Container maxWidth="lg">
            <motion.div variants={itemVariants}>
              <Typography 
                variant="h3" 
                align="center" 
                gutterBottom 
                className={styles.sectionTitle}
                sx={{ color: theme.palette.text.primary }}
              >
                About Us
              </Typography>
              
              <Grid container spacing={4} justifyContent="center">
                {developers.map((dev, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                      <Paper 
                        elevation={3} 
                        className={styles.developerCard}
                        sx={{
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(45, 45, 45, 0.9)'
                            : 'rgba(255, 255, 255, 0.9)',
                          color: theme.palette.text.primary
                        }}
                      >
                        <Box className={styles.developerInfo}>
                          <Box className={styles.headerRow}>
                            <Avatar
                              src={dev.avatar}
                              alt={dev.name}
                              className={styles.developerAvatar}
                            />
                            <Box className={styles.nameSection}>
                              <Typography 
                                variant="h6" 
                                className={styles.developerName}
                                sx={{ 
                                  color: theme.palette.mode === 'dark' 
                                    ? theme.palette.primary.light 
                                    : theme.palette.primary.dark
                                }}
                              >
                                {dev.name}
                              </Typography>
                              <Typography 
                                variant="subtitle1" 
                                sx={{ color: theme.palette.primary.main }}
                                className={styles.developerRole}
                              >
                                {dev.role}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography 
                            className={styles.developerBio}
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {dev.description}
                          </Typography>
                          <Box className={styles.socialLinks}>
                            <IconButton 
                              component="a" 
                              href={dev.github} 
                              target="_blank"
                              className={styles.socialIcon}
                              sx={{ 
                                color: theme.palette.mode === 'dark' 
                                  ? theme.palette.primary.light 
                                  : theme.palette.primary.main 
                              }}
                            >
                              <GitHub />
                            </IconButton>
                            <IconButton 
                              component="a" 
                              href={dev.linkedin} 
                              target="_blank"
                              className={styles.socialIcon}
                              sx={{ 
                                color: theme.palette.mode === 'dark' 
                                  ? theme.palette.primary.light 
                                  : theme.palette.primary.main 
                              }}
                            >
                              <LinkedIn />
                            </IconButton>
                            <IconButton 
                              component="a" 
                              href={dev.portfolio} 
                              target="_blank"
                              className={styles.socialIcon}
                              sx={{ 
                                color: theme.palette.mode === 'dark' 
                                  ? theme.palette.primary.light 
                                  : theme.palette.primary.main 
                              }}
                            >
                              <Code />
                            </IconButton>
                          </Box>
                        </Box>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Container>
        </Box>

        {/* Contact Section */}
        <Container maxWidth="md" className={styles.section}>
          <motion.div variants={itemVariants}>
            <Typography variant="h3" align="center" gutterBottom>
              Contact Us
            </Typography>
            <Paper elevation={3} className={styles.contactForm}>
              <form onSubmit={handleSubmit}>
                <Typography 
                  variant="h4" 
                  className={styles.contactTitle}
                  align="center" // This ensures center alignment
                  gutterBottom // Adds bottom margin
                >
                  Feedback Form
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      multiline
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      startIcon={<Mail />}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </motion.div>
        </Container>
      </motion.div>
      <Chatbot open={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </>
  );
};

export default Home;

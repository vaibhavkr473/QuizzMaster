import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./context/AuthContext";
import { ErrorProvider } from "./context/ErrorContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import Box from "@mui/material/Box";
import "./styles/global.css";
import { getTheme } from './theme/theme';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import all page components
import QuizList from './pages/QuizList';
import QuizPage from './pages/QuizPage';
import Results from './pages/Results';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import ResumeBuilder from './pages/ResumeBuilder';
import Payment from './pages/Payment';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import AuthPage from './pages/AuthPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = getTheme(darkMode ? 'dark' : 'light');

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    localStorage.setItem('darkMode', !darkMode);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorProvider>
        <AuthProvider>
          <Router>
            <Box sx={{ 
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <Box sx={{ flex: 1 }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/contact-us" element={<ContactUs />} />

                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    {/* Put the static route before the dynamic route */}
                    <Route path="/quiz/:id" element={<QuizPage />} />
                    <Route path="/quizzes" element={<QuizList />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/resume-builder" element={<ResumeBuilder />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/results/:quizId" element={<Results />} />
                  </Route>

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Box>
              <Chatbot />
              <Footer />
            </Box>
          </Router>
        </AuthProvider>
      </ErrorProvider>
    </ThemeProvider>
  );
};

export default App;

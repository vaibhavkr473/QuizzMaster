import React, { useState, useEffect, useContext } from "react";
import {
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Avatar, Chip, Box,
  CircularProgress, Alert, Grid
} from "@mui/material";
import { EmojiEvents, AccessTime } from '@mui/icons-material';
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import AuthContext from "../context/AuthContext";
import Chatbot from "../components/Chatbot"; // Import Chatbot
import api from '../services/api';
import styles from "../styles/pages/Leaderboard.module.css";

// Dummy data for charts and tables
const quizData = [
  { subject: "Math", score: 85 },
  { subject: "Science", score: 72 },
  { subject: "History", score: 90 },
];

const recentQuizzes = [
  { id: 1, title: "Math Quiz - Grade 8", score: 85, date: "2023-10-01" },
  { id: 2, title: "Science Quiz - Grade 10", score: 72, date: "2023-10-05" },
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/leaderboard');
      setLeaderboard(response.data.leaderboard);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    // Refresh every 5 minutes
    const interval = setInterval(fetchLeaderboard, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Add default values for user data
  const defaultUserStats = {
    coins: 0,
    quizStreaks: 0,
    badges: []
  };

  // Combine user data with defaults
  const userStats = {
    ...defaultUserStats,
    ...user
  };

  if (loading) {
    return (
      <Container className={styles.loadingContainer}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.username || "User"}!
      </Typography>

      {/* Badges and Coins Section */}
      <Paper elevation={3} className={styles.section}>
        <Typography variant="h6" gutterBottom>
          Your Achievements
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              <strong>Coins:</strong> {userStats.coins}
            </Typography>
            <Typography variant="body1">
              <strong>Quiz Streak:</strong> {userStats.quizStreaks} days
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" gutterBottom>
              <strong>Badges:</strong>
            </Typography>
            <div>
              {userStats.badges && userStats.badges.length > 0 ? (
                userStats.badges.map((badge, index) => (
                  <Chip
                    key={index}
                    avatar={<Avatar>{badge[0] || 'B'}</Avatar>}
                    label={badge}
                    variant="outlined"
                    style={{ margin: "4px" }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No badges earned yet
                </Typography>
              )}
            </div>
          </Grid>
        </Grid>
      </Paper>

      {/* Quiz Performance Chart */}
      <Paper elevation={3} className={styles.chartContainer}>
        <Typography variant="h6" gutterBottom>
          Quiz Performance
        </Typography>
        <BarChart width={500} height={300} data={quizData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="score" fill="#1976d2" />
        </BarChart>
      </Paper>

      {/* Recent Quiz Results */}
      <Grid container spacing={3} className={styles.gridContainer}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className={styles.paper}>
            <Typography variant="h6" gutterBottom>
              Recent Quiz Results
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Quiz Title</TableCell>
                    <TableCell align="right">Score</TableCell>
                    <TableCell align="right">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentQuizzes.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell>{quiz.title}</TableCell>
                      <TableCell align="right">{quiz.score}</TableCell>
                      <TableCell align="right">{quiz.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Leaderboard */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={3} className={styles.paper}>
              <Box className={styles.header}>
                <Typography variant="h6" gutterBottom>
                  Daily Leaderboard
                </Typography>
                <Box className={styles.updateInfo}>
                  <AccessTime fontSize="small" />
                  <Typography variant="caption">
                    Last updated: {lastUpdate?.toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rank</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell align="center">Quizzes</TableCell>
                      <TableCell align="center">Avg. Score</TableCell>
                      <TableCell align="right">Points</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaderboard.map((entry) => (
                      <TableRow 
                        key={entry._id}
                        className={entry._id === user?._id ? styles.currentUser : ''}
                      >
                        <TableCell>
                          {entry.rank <= 3 ? (
                            <EmojiEvents 
                              className={`${styles.trophy} ${styles[`rank${entry.rank}`]}`}
                            />
                          ) : entry.rank}
                        </TableCell>
                        <TableCell className={styles.userCell}>
                            <Avatar 
                                src={entry.avatar} 
                                alt={entry.username}
                                className={styles.avatar}
                            >
                                {entry.username ? entry.username[0].toUpperCase() : 'A'}
                            </Avatar>
                            <Typography>
                                {entry.username || 'Anonymous User'}
                                {entry._id === user?._id && ' (You)'}
                            </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={entry.quizCount}
                            size="small"
                            className={styles.quizCount}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {Math.round(entry.averageScore)}%
                        </TableCell>
                        <TableCell align="right">
                          {entry.totalScore}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
      {/* Chatbot */}
      <Paper elevation={3} className={styles.section}>
        <Chatbot />
      </Paper>
    </Container>
  );
};

export default Dashboard;

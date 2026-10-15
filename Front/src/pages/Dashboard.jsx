import React, { useState, useEffect } from "react";
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Button, Grid,
  Box, Card, CardContent, Divider, Chip, CircularProgress,
  Tab, Tabs
} from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { motion } from "framer-motion";
import api from "../services/api";
import styles from "../styles/pages/Dashboard.module.css";
import QuizIcon from "@mui/icons-material/Quiz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const Leaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userResults, leaderboard] = await Promise.all([
          api.get("/results/summary"),
          api.get("/results/leaderboard")
        ]);

        setUserData(userResults.data);
        setLeaderboardData(leaderboard.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} className={styles.paper}>
          {/* Personal Stats Section */}
          <Box className={styles.statsSection}>
            <Typography variant="h4" gutterBottom>
              Your Performance Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card className={styles.statsCard}>
                  <CardContent>
                    <Typography variant="h6">Overall Score</Typography>
                    <Box className={styles.scoreCircle}>
                      <CircularProgress
                        variant="determinate"
                        value={userData?.averageScore || 0}
                        size={100}
                        thickness={4}
                        color="primary"
                      />
                      <Typography variant="h5" className={styles.scoreText}>
                        {userData?.averageScore || 0}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <Card className={styles.statsCard}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Quick Stats</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Chip
                          label={`${userData?.totalQuizzes || 0} Attempts`}
                          color="primary"
                          className={styles.statChip}
                          icon={<QuizIcon />}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Chip
                          label={`${userData?.correctAnswers || 0} Correct`}
                          color="success"
                          className={styles.statChip}
                          icon={<CheckCircleIcon />}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Chip
                          label={`${userData?.incorrectAnswers || 0} Incorrect`}
                          color="error"
                          className={styles.statChip}
                          icon={<CancelIcon />}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Chip
                          label={`Rank #${userData?.rank || 'N/A'}`}
                          color="secondary"
                          className={styles.statChip}
                          icon={<EmojiEventsIcon />}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Divider className={styles.divider} />

          {/* Performance Analysis */}
          <Box className={styles.analysisSection}>
            <Typography variant="h5" gutterBottom>
              Detailed Analysis
            </Typography>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              centered
              className={styles.tabs}
            >
              <Tab label="Category Performance" />
              <Tab label="Progress Over Time" />
              <Tab label="Ranking" />
            </Tabs>

            <Box className={styles.chartContainer}>
              {activeTab === 0 && (
                <>
                  <Box className={styles.chartHeader}>
                    <Typography variant="h6">Category Performance</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Your performance across different quiz categories
                    </Typography>
                  </Box>
                  <Box className={styles.chartWrapper}>
                    <RadarChart 
                      width={windowWidth < 480 ? 300 : 500} 
                      height={windowWidth < 480 ? 300 : 400} 
                      data={userData?.categoryScores || []}
                    >
                      <PolarGrid strokeDasharray="3 3" />
                      <PolarAngleAxis 
                        dataKey="category"
                        tick={{ fontSize: windowWidth < 480 ? 10 : 12 }}
                      />
                      <PolarRadiusAxis 
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fontSize: windowWidth < 480 ? 10 : 12 }}
                      />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: windowWidth < 480 ? 10 : 12 }} />
                    </RadarChart>
                  </Box>
                </>
              )}

              {activeTab === 1 && (
                <>
                  <Box className={styles.chartHeader}>
                    <Typography variant="h6">Progress Over Time</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Your quiz scores over time
                    </Typography>
                  </Box>
                  <Box className={styles.chartWrapper}>
                    <BarChart 
                      width={windowWidth < 480 ? 300 : 500} 
                      height={windowWidth < 480 ? 300 : 400} 
                      data={userData?.progressData || []}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: windowWidth < 480 ? 10 : 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        tick={{ fontSize: windowWidth < 480 ? 10 : 12 }}
                        domain={[0, 100]}
                      />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: windowWidth < 480 ? 10 : 12 }} />
                      <Bar 
                        dataKey="score" 
                        fill="#82ca9d"
                        name="Score (%)"
                        label={{ 
                          position: 'top',
                          fontSize: windowWidth < 480 ? 10 : 12
                        }}
                      />
                    </BarChart>
                  </Box>
                </>
              )}

              {activeTab === 2 && (
                <>
                  <Box className={styles.chartHeader}>
                    <Typography variant="h6">Top Performers</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Score distribution among top performers
                    </Typography>
                  </Box>
                  <Box className={styles.chartWrapper}>
                    <PieChart 
                      width={windowWidth < 480 ? 300 : 400} 
                      height={windowWidth < 480 ? 300 : 400}
                    >
                      <Pie
                        data={leaderboardData.slice(0, 4)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={windowWidth < 480 ? 100 : 140}
                        fill="#8884d8"
                        dataKey="score"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {leaderboardData.slice(0, 4).map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend 
                        wrapperStyle={{ 
                          fontSize: windowWidth < 480 ? 10 : 12,
                          paddingTop: '20px'
                        }} 
                      />
                    </PieChart>
                  </Box>
                </>
              )}
            </Box>
          </Box>

          {/* Recommendations Section */}
          <Box className={styles.recommendationsSection}>
            <Typography variant="h6" gutterBottom>
              Recommendations
            </Typography>
            <Grid container spacing={2}>
              {userData?.recommendations?.map((rec, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card className={styles.recCard}>
                    <CardContent>
                      <Typography variant="subtitle1">{rec.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {rec.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Leaderboard;
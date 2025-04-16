import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Paper, Button, Tabs, Tab,
  Card, CardContent, CardActions, CircularProgress, Chip, Box, Tooltip, IconButton
} from '@mui/material';
import { PlayArrow, Refresh, Assessment, AccessTime, QuestionAnswer } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import styles from '../styles/pages/QuizList.module.css';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [userResults, setUserResults] = useState({});

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await api.get('/quizzes');
                setQuizzes(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching quizzes:', err);
                setError('Failed to load quizzes');
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const filteredQuizzes = quizzes.filter(quiz => {
        if (activeTab === 'all') return true;
        return quiz.category === activeTab;
    });

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container maxWidth="lg" className={styles.container}>
            <Typography variant="h4" gutterBottom>
                Available Quizzes
            </Typography>

            <Paper className={styles.tabsContainer}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="All Quizzes" value="all" />
                    <Tab label="Junior (Class 1-8)" value="Junior" />
                    <Tab label="Senior (Class 9-12)" value="Senior" />
                    <Tab label="Computer" value="Computer" />
                    <Tab label="General" value="General" />
                </Tabs>
            </Paper>

            <Grid container spacing={3} className={styles.gridContainer}>
                {filteredQuizzes.map((quiz) => (
                    <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className={styles.quizCard}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {quiz.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {quiz.questions?.length || 0} Questions
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Category: {quiz.category}
                                    </Typography>
                                    <Box className={styles.quizMeta}>
                                        <Chip
                                            icon={<AccessTime />}
                                            label={`${quiz.duration || '25'} min`}  // Add fallback and correct unit
                                            size="small"
                                            className={styles.metaChip}
                                        />
                                        <Chip
                                            icon={<QuestionAnswer />}
                                            label={`${quiz.questions?.length || 0} Questions`}
                                            size="small"
                                            className={styles.metaChip}
                                        />
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    {!userResults[quiz.id] ? (
                                        // User hasn't attempted the quiz
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            component={Link}
                                            to={`/quiz/${quiz.id}`} // Ensure `quiz.id` is valid
                                            startIcon={<PlayArrow />}
                                            fullWidth
                                            className={styles.startButton}
                                        >
                                            Start Quiz
                                        </Button>
                                    ) : (
                                        // User has attempted the quiz
                                        <Box className={styles.attemptedActions}>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                component={Link}
                                                to={`/quiz/${quiz.id}`}
                                                startIcon={<Refresh />}
                                                className={styles.reAttemptButton}
                                            >
                                                Re-attempt
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                component={Link}
                                                to={`/results/${quiz.id}`}
                                                startIcon={<Assessment />}
                                                className={styles.resultsButton}
                                            >
                                                Show Results
                                            </Button>
                                        </Box>
                                    )}
                                </CardActions>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default QuizList;
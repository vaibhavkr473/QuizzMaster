import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, Box, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Grid, Button, Chip
} from '@mui/material';
import {
  CheckCircle, Cancel, ArrowBack, Share, Download
} from '@mui/icons-material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import api from '../services/api';
import styles from '../styles/pages/Results.module.css';
import ChartErrorBoundary from '../components/ChartErrorBoundary';

const Results = () => {
  const { quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!quizId) {
        setError("Invalid quiz ID");
        setLoading(false);
        return;
      }

      try {
        // First try to use results from location state
        if (location.state?.results) {
          setResults(location.state.results);
          setLoading(false);
          return;
        }

        // If no results in state, fetch from API
        const response = await api.get(`/results/${quizId}`);
        setResults(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Failed to load results");
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId, location.state]);

  // Update the prepareChartData function
  const prepareChartData = (categoryPerformance) => {
    if (!categoryPerformance || !Array.isArray(categoryPerformance) || categoryPerformance.length === 0) {
      return [{
        name: 'No Data',
        value: 0,
        fill: '#e0e0e0'
      }];
    }

    return categoryPerformance.map(category => ({
      name: category.category || 'Unknown',
      value: Number.isFinite(category.score) ? category.score : 0,
      fill: category.score >= 70 ? '#4caf50' : '#1976d2'
    }));
  };

  if (loading) {
    return (
      <Container className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading results...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className={styles.errorContainer}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/quizzes")}
        >
          Back to Quizzes
        </Button>
      </Container>
    );
  }

  const percentage = Math.round((results.score / results.totalQuestions) * 100);
  const quizTitle = location.state?.quizTitle || `Quiz ${quizId}`;

  const downloadResults = () => {
    const document = new jsPDF({ unit: 'mm', format: 'a4' });
    const margin = 16;
    const pageWidth = document.internal.pageSize.getWidth();
    const pageHeight = document.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margin * 2;
    const footerSpace = 16;
    let cursorY = 20;

    const writeText = (text, { size = 10, bold = false, gap = 3 } = {}) => {
      document.setFont('helvetica', bold ? 'bold' : 'normal');
      document.setFontSize(size);
      const lines = document.splitTextToSize(String(text ?? '—'), contentWidth);
      const lineHeight = size * 0.45;

      if (cursorY + lines.length * lineHeight > pageHeight - footerSpace) {
        document.addPage();
        cursorY = margin;
      }

      document.text(lines, margin, cursorY);
      cursorY += lines.length * lineHeight + gap;
    };

    writeText('Quiz Results', { size: 20, bold: true, gap: 2 });
    writeText(quizTitle, { size: 14, bold: true, gap: 5 });
    writeText(`Score: ${results.score} out of ${results.totalQuestions} (${percentage}%)`, {
      size: 12,
      bold: true
    });
    writeText(`Downloaded: ${new Date().toLocaleString()}`, { size: 9, gap: 7 });
    writeText('Question-by-question review', { size: 13, bold: true, gap: 5 });

    (results.feedback || []).forEach((item, index) => {
      writeText(`${index + 1}. ${item.questionText || `Question ${index + 1}`}`, {
        size: 11,
        bold: true,
        gap: 2
      });
      writeText(`Your answer: ${item.selectedAnswer || 'Not answered'}`, { gap: 1 });
      writeText(`Correct answer: ${item.correctAnswer || 'Unavailable'}`, { gap: 1 });
      writeText(`Result: ${item.isCorrect ? 'Correct' : 'Incorrect'}`, { gap: 2 });
      if (item.explanation) {
        writeText(`Explanation: ${item.explanation}`, { size: 9, gap: 4 });
      }
    });

    const pageCount = document.internal.getNumberOfPages();
    for (let page = 1; page <= pageCount; page++) {
      document.setPage(page);
      document.setFont('helvetica', 'normal');
      document.setFontSize(8);
      document.text(
        `Page ${page} of ${pageCount}`,
        pageWidth - margin,
        pageHeight - 8,
        { align: 'right' }
      );
    }

    const safeTitle = quizTitle.replace(/[<>:"/\\|?*]+/g, '-').trim();
    document.save(`${safeTitle || 'quiz'}-results.pdf`);
  };

  return (
    <Container maxWidth="lg" className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} className={styles.paper}>
          <Box className={styles.header}>
            <Typography variant="h4" gutterBottom>
              {quizTitle} Results
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Score: {results.score} out of {results.totalQuestions}
            </Typography>
          </Box>

          <Box className={styles.scoreSection}>
            <Box className={styles.scoreCircle}>
              <CircularProgress
                variant="determinate"
                value={percentage}
                size={120}
                thickness={4}
                color={percentage >= 70 ? "success" : "primary"}
                aria-label={`Score: ${percentage}%`}
              />
              <Typography variant="h4" className={styles.scorePercentage}>
                {percentage}%
              </Typography>
            </Box>
          </Box>

          <Box className={styles.chartsContainer}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper className={styles.chartPaper}>
                  <Typography variant="h6" gutterBottom>
                    Performance Analysis
                  </Typography>
                  <ChartErrorBoundary>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart 
                        data={results?.categoryPerformance ? prepareChartData(results.categoryPerformance) : []}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name"
                          height={60}
                          tick={{ fontSize: 12 }}
                          interval={0}
                        />
                        <YAxis 
                          domain={[0, 100]}
                          tickCount={6}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Score']}
                          contentStyle={{ fontSize: 12 }}
                        />
                        <Bar 
                          dataKey="value"
                          fill="#1976d2"
                          radius={[4, 4, 0, 0]}
                          minPointSize={5}
                          isAnimationActive={false}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartErrorBoundary>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <TableContainer className={styles.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell>Your Answer</TableCell>
                  <TableCell>Correct Answer</TableCell>
                  <TableCell align="center">Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.feedback && results.feedback.length > 0 ? (
                  results.feedback.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.questionText}</TableCell>
                      <TableCell>{item.selectedAnswer || "Not answered"}</TableCell>
                      <TableCell>{item.correctAnswer}</TableCell>
                      <TableCell align="center">
                        {item.isCorrect ? (
                          <CheckCircle color="success" />
                        ) : (
                          <Cancel color="error" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No feedback available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box className={styles.actionButtons}>
            <Button
              startIcon={<ArrowBack />}
              variant="outlined"
              onClick={() => navigate("/quizzes")}
            >
              Back to Quizzes
            </Button>
            <Button
              startIcon={<ArrowBack />}
              variant="contained"
              color="primary"
              onClick={() => navigate(`/quiz/${quizId}`, {
                state: { quizTitle }
              })}
            >
              Retry Quiz
            </Button>
            <Button
              startIcon={<Share />}
              variant="contained"
              color="primary"
              onClick={() => navigator.share({ title: "Quiz Results", text: `I scored ${percentage}%!` })}
            >
              Share Results
            </Button>
            <Button
              startIcon={<Download />}
              variant="contained"
              color="secondary"
              onClick={downloadResults}
            >
              Download PDF
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Results;
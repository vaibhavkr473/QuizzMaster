import React, { useState, useEffect } from "react";
import {
  Container, Typography, Paper, Button, Radio, RadioGroup, FormControlLabel,
  FormControl
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "../styles/pages/QuizPage.module.css";

const QuizPage = () => {
  const { id } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizTimeLeft, setQuizTimeLeft] = useState(20 * 60); // 20 mins
  const [questionTimeLeft, setQuestionTimeLeft] = useState(60); // 1 min per question
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [darkMode, setDarkMode] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
        if (!id) {
            setError("Invalid quiz ID");
            return;
        }

        try {
            const response = await api.get(`/quizzes/${id}`);
            if (!response.data) {
                throw new Error('Quiz not found');
            }
            setQuizData(response.data);
        } catch (err) {
            console.error("Error fetching quiz:", err);
            setError(err.response?.data?.message || "Failed to load quiz");
        }
    };

    fetchQuiz();
}, [id]);

  // Quiz Timer
  useEffect(() => {
    if (quizTimeLeft > 0 && !quizCompleted) {
      const quizTimer = setInterval(() => {
        setQuizTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(quizTimer);
    } else if (quizTimeLeft === 0) {
      setQuizCompleted(true);
    }
  }, [quizTimeLeft, quizCompleted]);

  // Per Question Timer
  useEffect(() => {
    if (questionTimeLeft > 0 && !quizCompleted) {
      const qTimer = setInterval(() => {
        setQuestionTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(qTimer);
    } else if (questionTimeLeft === 0) {
      handleNextQuestion(); // auto move to next
    }
  }, [questionTimeLeft, quizCompleted]);

  if (error) {
    return (
      <div>
        <h2>{error}</h2>
        <button onClick={() => navigate("/quizzes")}>Back to Quizzes</button>
      </div>
    );
  }

  if (!quizData) return <Typography>Loading...</Typography>;

  const currentQuestion = quizData.questions[currentQuestionIndex];

  const handleAnswerChange = (e) => {
    const selected = e.target.value;
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = selected;
    setAnswers(updatedAnswers);

    if (selected === currentQuestion.answer) {
      setFeedback("Correct! 🎉");
    } else {
      setFeedback(
        `Incorrect! 😢 The correct answer is: ${currentQuestion.answer}`
      );
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setFeedback(null);
      setQuestionTimeLeft(60); // Reset 1 min for next question
    } else {
      setQuizCompleted(true);
    }
  };

  const handleSubmit = async () => {
    try {
        setSubmitting(true);

        // Format answers to match the expected structure
        const formattedAnswers = quizData.questions.map((question, index) => ({
            questionId: index,
            selectedAnswer: answers[index] || null
        }));

        const response = await api.post(`/quizzes/${id}/submit`, {
            answers: formattedAnswers,
            timeSpent: 20 * 60 - quizTimeLeft
        });

        if (response.data && response.data.success) {
            navigate(`/results/${id}`, {
                state: {
                    results: response.data,
                    quizTitle: quizData?.title
                },
                replace: true
            });
        } else {
            throw new Error(response.data?.message || 'Failed to submit quiz');
        }
    } catch (error) {
        console.error("Quiz submission error:", error);
        setError("Failed to submit quiz. Please try again.");
    } finally {
        setSubmitting(false);
    }
};

  const formatTime = (seconds) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;

  return (
    <Container
      maxWidth="md"
      className={`${styles.container} ${darkMode ? styles.dark : styles.light}`}
    >
      <Paper elevation={3} className={styles.paper}>
        {/* Header Section */}
        <div className={styles.quizHeader}>
          <Typography variant="h4" gutterBottom>
            {quizData.title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {quizData.description}
          </Typography>
        </div>

        {/* Timer Section */}
        <div className={styles.timerContainer}>
          <div className={`${styles.timer} ${quizTimeLeft < 300 ? styles.danger : ''}`}>
            <Typography variant="h6">
              Quiz Time: {formatTime(quizTimeLeft)}
            </Typography>
          </div>
          <div className={`${styles.timer} ${questionTimeLeft < 10 ? styles.warning : ''}`}>
            <Typography variant="h6">
              Question Time: {formatTime(questionTimeLeft)}
            </Typography>
          </div>
        </div>

        {!quizCompleted ? (
          <>
            {/* Progress Section */}
            <div className={styles.progressContainer}>
              <Typography className={styles.progressText}>
                Question {currentQuestionIndex + 1}/{quizData.questions.length}
              </Typography>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Section */}
            <div className={styles.questionContent}>
              <Typography variant="h5" gutterBottom>
                {currentQuestion.question}
              </Typography>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={answers[currentQuestionIndex] || ""}
                  onChange={handleAnswerChange}
                >
                  {currentQuestion.options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                      className={styles.optionLabel}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>

            {/* Feedback Section */}
            {feedback && (
              <div className={`${styles.feedbackContainer} ${
                feedback.includes("Correct") ? styles.feedbackCorrect : styles.feedbackIncorrect
              }`}>
                <Typography variant="h6">
                  {feedback}
                </Typography>
              </div>
            )}

            {/* Navigation Section */}
            <div className={styles.navigationContainer}>
              <Typography variant="body2" color="textSecondary">
                {answers[currentQuestionIndex] ? 'Answer selected' : 'Select an answer to continue'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={
                  currentQuestionIndex < quizData.questions.length - 1
                    ? handleNextQuestion
                    : handleSubmit
                }
                disabled={!answers[currentQuestionIndex] || submitting}
                className={styles.button}
              >
                {currentQuestionIndex < quizData.questions.length - 1
                  ? "Next Question"
                  : "Submit Quiz"}
              </Button>
            </div>
          </>
        ) : (
          <div className={styles.completionMessage}>
            <Typography variant="h5" align="center">
              Quiz Completed! Thank you for participating.
            </Typography>
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default QuizPage;

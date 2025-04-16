import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import QuizList from "./pages/QuizList";
import Leaderboard from "./pages/Leaderboard";
import ErrorBoundary from "./components/ErrorBoundary";
import VerifyEmail from "./pages/VerifyEmail";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Payment from "./pages/Payment";
import ResumeBuilder from "./pages/ResumeBuilder";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/contact-us" element={<ContactUs />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/quizzes" element={<QuizList />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/quiz/:id/results" element={
          <ErrorBoundary>
            <ResultsPage />
          </ErrorBoundary>
        } />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

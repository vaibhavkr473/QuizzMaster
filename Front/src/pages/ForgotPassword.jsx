import React, { useState, useContext } from "react";
import { Container, Typography, TextField, Button, Paper, Snackbar, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import AuthContext from "../context/AuthContext";
import styles from "../styles/pages/ForgotPassword.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter OTP, Step 3: Reset password
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { sendOtp, verifyOtp, resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await sendOtp(email);
      setStep(2); // Move to OTP verification step
    } catch (err) {
      setError(err.message);
      setOpenSnackbar(true);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtp(email, otp);
      setStep(3); // Move to password reset step
    } catch (err) {
      setError(err.message);
      setOpenSnackbar(true);
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(email, otp, newPassword, confirmPassword);
      setOpenSnackbar(true);
      setTimeout(() => navigate("/auth"), 3000); // Redirect to login page after 3 seconds
    } catch (err) {
      setError(err.message);
      setOpenSnackbar(true);
    }
  };

  return (
    <div>
      <Container maxWidth="sm" className={styles.container}>
        <Paper elevation={3} className={styles.paper}>
          {step === 1 && (
            <>
              <Typography variant="h4" gutterBottom>
                Forgot Password
              </Typography>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button variant="contained" color="primary" fullWidth onClick={handleSendOtp}>
                Send OTP
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <Typography variant="h4" gutterBottom>
                Verify OTP
              </Typography>
              <TextField
                label="OTP"
                type="text"
                fullWidth
                margin="normal"
                variant="outlined"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <Button variant="contained" color="primary" fullWidth onClick={handleVerifyOtp}>
                Verify OTP
              </Button>
            </>
          )}
          {step === 3 && (
            <>
              <Typography variant="h4" gutterBottom>
                Reset Password
              </Typography>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button variant="contained" color="primary" fullWidth onClick={handleResetPassword}>
                Reset Password
              </Button>
            </>
          )}
          <Typography variant="body2" align="center" mt={2}>
            Remember your password?{" "}
            <Link to="/auth">Login</Link>
          </Typography>
        </Paper>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={error ? "error" : "success"}>
          {error || "Operation successful!"}
        </Alert>
      </Snackbar>
      <Footer />
    </div>
  );
};

export default ForgotPassword;

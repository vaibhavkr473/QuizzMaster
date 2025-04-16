import React, { useState, useContext } from "react";
import { 
  Container, Typography, TextField, Paper, Tabs, Tab, Box, Snackbar, 
  Alert, CircularProgress, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ErrorContext from "../context/ErrorContext";
import styles from "../styles/pages/AuthPage.module.css";
import { Visibility, VisibilityOff, Email, LockOpen, Google, GitHub } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { styled } from '@mui/material/styles';

// Custom styled buttons
const AuthButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  padding: '12px 24px',
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  letterSpacing: '0.5px',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(37, 99, 235, 0.3)',
    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
  },
  '&:active': {
    transform: 'translateY(1px)',
  },
  '&.Mui-disabled': {
    background: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.12)'
      : 'rgba(0, 0, 0, 0.12)',
  }
}));

const OTPButton = styled(Button)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(37, 99, 235, 0.1)',
  color: theme.palette.mode === 'dark' 
    ? theme.palette.primary.light 
    : theme.palette.primary.main,
  padding: '10px 20px',
  borderRadius: '10px',
  textTransform: 'none',
  fontSize: '0.95rem',
  fontWeight: 500,
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(37, 99, 235, 0.2)'}`,
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(37, 99, 235, 0.15)',
    transform: 'translateY(-1px)',
  },
  '&.Mui-disabled': {
    opacity: 0.6,
    color: theme.palette.text.secondary,
  }
}));

const SocialAuthButton = styled(Button)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)'
    : '#fff',
  color: theme.palette.text.primary,
  padding: '12px',
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '0.95rem',
  fontWeight: 500,
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.12)'}`,
  display: 'flex',
  gap: '8px',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  marginBottom: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : '#f8fafc',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  }
}));

const AuthPage = () => {
  const [mode, setMode] = useState("signup"); // 'login' or 'signup'
  const [username, setUsername] = useState(""); // Username state
  const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState(""); // Password state
  const [phone, setPhone] = useState(""); // Phone number state
  const [otp, setOtp] = useState(""); // OTP state
  const [otpSent, setOtpSent] = useState(false); // Track if OTP has been sent
  const [otpVerified, setOtpVerified] = useState(false); // Track OTP verification status
  const [error, setError] = useState(""); // For error messages
  const [loading, setLoading] = useState(false); // For button loading state
  const [openSnackbar, setOpenSnackbar] = useState(false); // For Snackbar visibility
  const { showError } = useContext(ErrorContext); // Use ErrorContext
  const { login, signup, sendOtp, verifyOtp } = useContext(AuthContext); // Use AuthContext
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Handle OTP sending
  const handleSendOtp = async () => {
    try {
      const response = await sendOtp(email, mode === "signup"); // Pass `true` for signup
      if (response.success) {
        setOtpSent(true);
        setOpenSnackbar(true);
        setError(""); // Clear any previous errors
      } else {
        setError(response.error);
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      setError("Failed to send OTP");
      setOpenSnackbar(true);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    try {
      const response = await verifyOtp(email, otp);
      if (response.success) {
        setOtpVerified(true);
        setOpenSnackbar(true);
        setError(""); // Clear any previous errors
      } else {
        setError(response.error);
        setOpenSnackbar(true);
      }
    } catch (err) {
      setError("Failed to verify OTP");
      setOpenSnackbar(true);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true);

    try {
      if (mode === "signup") {
        const response = await signup(username, email, phone, password);
        if (response.success) {
          setMode("login"); // Switch to login mode after successful signup
        } else {
          setError(response.error);
        }
      } else {
        const response = await login(email, password);
        if (response.success) {
          navigate("/dashboard");
        } else {
          setError(response.error);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm" className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <Tabs
          value={mode}
          onChange={(e, newValue) => setMode(newValue)}
          centered
        >
          <Tab label="Login" value="login" />
          <Tab label="Signup" value="signup" />
        </Tabs>
        <Box mt={3}>
          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <>
                <TextField
                  label="Username"
                  type="text"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  inputProps={{ pattern: "^[a-zA-Z0-9]+$", title: "Username must contain only letters and numbers" }}
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  inputProps={{
                    pattern: "\\S+@\\S+\\.\\S+",
                    title: "Please enter a valid email address",
                  }}
                />
                <TextField
                  label="Phone Number"
                  type="tel"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  inputProps={{
                    pattern: "^[0-9]{10}$",
                    title: "Please enter a valid 10-digit phone number",
                  }}
                />
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
                {otpSent && (
                  <>
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
                    <OTPButton
                      fullWidth
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <LockOpen />}
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </OTPButton>
                  </>
                )}
                <OTPButton
                  fullWidth
                  onClick={handleSendOtp}
                  disabled={otpSent || loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Email />}
                  sx={{ mt: 2 }}
                >
                  {otpSent ? "OTP Sent" : loading ? "Sending..." : "Send OTP"}
                </OTPButton>
              </>
            )}
            {mode === "login" && (
              <>
                <TextField
                  label="Email or Username"
                  type="text"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={email || username}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              </>
            )}
            <AuthButton
              type="submit"
              fullWidth
              disabled={loading || (mode === "signup" && !otpVerified)}
              sx={{ mt: 3, mb: 2 }}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
            </AuthButton>
          </form>
          {mode === "login" && (
            <Typography variant="body2" align="center" mt={2}>
              Forgot your password?{" "}
              <Link to="/forgot-password">Reset it here</Link>
            </Typography>
          )}
          <Typography variant="body2" align="center" mt={2}>
            {mode === "login" ? (
              <>
                Don’t have an account?{" "}
                <Link to="/auth" onClick={() => setMode("signup")}>
                  Signup
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link to="/auth" onClick={() => setMode("login")}>
                  Login
                </Link>
              </>
            )}
          </Typography>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Or continue with
            </Typography>
            <SocialAuthButton startIcon={<Google />}>
              Continue with Google
            </SocialAuthButton>
            <SocialAuthButton startIcon={<GitHub />}>
              Continue with GitHub
            </SocialAuthButton>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar for error/success messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : otpVerified ? "success" : "info"}
        >
          {error ||
            (mode === "signup"
              ? otpVerified
                ? "OTP verified successfully! You can now complete registration."
                : otpSent
                ? "OTP sent to your email. Please check your inbox."
                : "Signup successful! Please login."
              : "Login successful!")}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AuthPage;

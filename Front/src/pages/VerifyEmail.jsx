import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Typography, CircularProgress, Alert } from "@mui/material";
import api from "../services/api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setMessage("Invalid verification link.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/auth/verify-email?token=${token}`);
        setMessage(response.data.message);
        setTimeout(() => navigate("/auth"), 3000); // Redirect to login after 3 seconds
      } catch (error) {
        setMessage(error.response?.data?.error || "Verification failed.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Alert severity={message.includes("successfully") ? "success" : "error"}>
          {message}
        </Alert>
      )}
    </Container>
  );
};

export default VerifyEmail;
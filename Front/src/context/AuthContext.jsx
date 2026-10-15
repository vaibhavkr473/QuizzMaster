import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial auth check
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await api.get("/auth/me");
          setUser(response.data);
        } catch {
          localStorage.removeItem("token");
          delete api.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Auth functions
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { 
        email,
        password
      });

      localStorage.setItem("token", response.data.token);
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
      setUser(response.data.user);

      return { success: true };
    } catch (err) {
      console.error("Login request failed:", err.response?.status || err.code || "request error");
      setError(err.response?.data?.error || "Login failed");
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    }
  };

  const signup = async (username, email, phone, password) => {
    try {
      setError(null);
      const response = await api.post("/auth/signup", {
        username,
        email,
        phone,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
        setUser(response.data.user);
      }

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Signup request failed:", err.response?.status || err.code || "request error");
      setError(err.response?.data?.error || "Signup failed");
      return {
        success: false,
        error: err.response?.data?.error || "Signup failed",
      };
    }
  };

  const sendOtp = async (email, isRegistration = false) => {
    try {
      const response = await api.post("/auth/send-otp", { email, isRegistration });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("OTP send request failed:", error.response?.status || error.code || "request error");
      return {
        success: false,
        error: error.response?.data?.error || "Failed to send OTP",
      };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await api.post("/auth/verify-otp", { email, otp });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("OTP verification request failed:", error.response?.status || error.code || "request error");
      return {
        success: false,
        error: error.response?.data?.error || "OTP verification failed",
      };
    }
  };

  const resetPassword = async (email, otp, newPassword, confirmPassword) => {
    try {
      const response = await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword,
        confirmPassword
      });
      return response.data;
    } catch (error) {
      console.error('Reset password request failed:', error.response?.status || error.code || "request error");
      throw new Error(error.response?.data?.error || 'Failed to reset password');
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, signup, sendOtp, verifyOtp, resetPassword, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

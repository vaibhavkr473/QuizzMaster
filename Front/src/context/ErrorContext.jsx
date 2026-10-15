import React, { createContext, useState } from "react";
import {Snackbar, Alert} from "@mui/material";
const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Show an error message
  const showError = (message) => {
    setError(message);
    setOpenSnackbar(true);
  };

  // Close the Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </ErrorContext.Provider>
  );
};

export default ErrorContext;

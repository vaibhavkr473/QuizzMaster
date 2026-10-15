import { createTheme } from "@mui/material/styles";

const highContrasttheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Blue
    },
    secondary: {
      main: "#dc004e", // Pink
    },
    background: {
      default: "#f5f5f5", // Light gray
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
  },
});

export default highContrasttheme;


/*
const highContrastTheme = createTheme({
  palette: {
    primary: {
      main: "#000000", // Black
    },
    secondary: {
      main: "#FFFFFF", // White
    },
    background: {
      default: "#FFFFFF", // White
      paper: "#000000", // Black
    },
    text: {
      primary: "#000000", // Black
      secondary: "#FFFFFF", // White
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});
*/
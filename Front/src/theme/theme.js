import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#1a237e' : '#90caf9',
      light: mode === 'light' ? '#534bae' : '#a6d4fa',
      dark: mode === 'light' ? '#000051' : '#648dae',
      contrastText: mode === 'light' ? '#ffffff' : '#000000',
    },
    secondary: {
      main: mode === 'light' ? '#0d47a1' : '#82b1ff',
      light: mode === 'light' ? '#5472d3' : '#b6e3ff',
      dark: mode === 'light' ? '#002171' : '#4d82cb',
      contrastText: mode === 'light' ? '#ffffff' : '#000000',
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      card: mode === 'light' ? '#ffffff' : '#252525',
    },
    text: {
      primary: mode === 'light' ? '#1a237e' : '#ffffff',
      secondary: mode === 'light' ? '#424242' : '#b3b3b3',
      disabled: mode === 'light' ? '#757575' : '#666666',
    },
    divider: mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
    gradient: {
      primary: mode === 'light' 
        ? 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)'
        : 'linear-gradient(45deg, #303f9f 30%, #1a237e 90%)',
      card: mode === 'light'
        ? 'linear-gradient(to right bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.7))'
        : 'linear-gradient(to right bottom, rgba(30,30,30,0.9), rgba(30,30,30,0.7))',
    },
  },
  shape: {
    borderRadius: 12,
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: mode === 'light' 
            ? 'rgba(255, 255, 255, 0.9)'
            : 'rgba(30, 30, 30, 0.9)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
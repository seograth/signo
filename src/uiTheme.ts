import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00B4D8', // Electric Cyan
      light: '#48CAE4',
      dark: '#0077B6',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6B6B', // Vibrant Coral
      light: '#FF8787',
      dark: '#FA5252',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#06D6A0', // Success Mint
      light: '#38EF7D',
      dark: '#05B383',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFB703', // Warm Amber
      light: '#FFC83B',
      dark: '#E09F00',
      contrastText: '#1A1D28',
    },
    background: {
      default: '#1A1D28', // Deep Slate Navy
      paper: '#222634',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#94A3B8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
      letterSpacing: '-0.025em',
      lineHeight: 1.15,
      color: '#FFFFFF',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: '#FFFFFF',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
      color: '#FFFFFF',
    },
    h4: {
      fontSize: '1.4rem',
      fontWeight: 700,
      color: '#FFFFFF',
    },
    h5: {
      fontSize: '1.15rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#CBD5E1',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#94A3B8',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          padding: '10px 24px',
          fontWeight: 700,
          textTransform: 'none',
          fontSize: '0.95rem',
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
          boxShadow: '0 4px 14px 0 rgba(0, 180, 216, 0.35)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(135deg, #0077B6 0%, #023E8A 100%)',
            boxShadow: '0 6px 20px rgba(0, 180, 216, 0.5)',
            transform: 'translateY(-1px)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%)',
          color: '#FFFFFF',
          boxShadow: '0 4px 14px 0 rgba(255, 107, 107, 0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #EE5253 0%, #C82333 100%)',
            boxShadow: '0 6px 20px rgba(255, 107, 107, 0.45)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.15)',
          color: '#FFFFFF',
          backdropFilter: 'blur(8px)',
          '&:hover': {
            borderColor: '#00B4D8',
            backgroundColor: 'rgba(0, 180, 216, 0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 29, 40, 0.90)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(34, 38, 52, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
  },
})

export default theme

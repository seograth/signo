import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366F1', // Electric Indigo
      light: '#818CF8',
      dark: '#4338CA',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FBBF24', // Sunny Butter Gold
      light: '#FDE68A',
      dark: '#D97706',
      contrastText: '#0F172A',
    },
    success: {
      main: '#10B981', // Emerald
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0B0F19',
      paper: '#111827',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
      color: '#F8FAFC',
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
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
            transform: 'translateY(-1px)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
          color: '#0F172A',
          boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            boxShadow: '0 6px 20px rgba(245, 158, 11, 0.45)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.15)',
          color: '#FFFFFF',
          backdropFilter: 'blur(8px)',
          '&:hover': {
            borderColor: '#818CF8',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(11, 15, 25, 0.85)',
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
          backgroundColor: 'rgba(17, 24, 39, 0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
  },
})

export default theme

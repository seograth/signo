import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1440,
    },
  },
  palette: {
    primary: {
      main: '#6b8f71',
      dark: '#00396A',
      light: '#0263b891',
    },
    secondary: {
      main: '#B5272E',
      dark: '#871D22',
    },
    grey: {
      100: '#dde1e4',
      200: '#e0e0e0',
      300: '#00000080',
      400: '#616161',
      500: '#9B9B9B',
      600: '#4a4d57',
    },
    error: {
      main: '#B5272E',
      light: '#F5EBFF',
      dark: '#871D22',
    },
    text: {
      primary: '#ffffff',
    },
  },
  typography: {
    htmlFontSize: 17,
    allVariants: {
      color: '#ffffff',
    },
    // allVariants: {
    //   fontFamily: 'Open Sans,Arial,Helvetica,sans-serif',
    // },
    // body1: {
    //   fontWeight: 500,
    //   fontFamily: 'Open Sans,Arial,Helvetica,sans-serif',
    // },
    // body2: {
    //   fontWeight: 400,
    //   fontFamily: 'Open Sans,Arial,Helvetica,sans-serif',
    // },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          // backgroundColor: '#fff',
          // color: 'primary',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          background: '#fff',
          color: '#00539B',
          fontSize: '20px',
          fontWeight: 500,
          letterSpacing: '0.15px',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          display: 'flex',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '70px',
          width: '100%',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontFamily: 'Open Sans,Arial,Helvetica,sans-serif',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: 'Open Sans,Arial,Helvetica,sans-serif',
          fontWeight: '500',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          padding: '6px 22px',
          fontSize: '1rem',
          fontWeight: 700,
          letterSpacing: '0.15px',
          textTransform: 'none',
        },
        outlinedPrimary: {
          color: '#f4b183',
          borderColor: '#f4b183',
          '&:hover': {
            backgroundColor: '#f4b183',
            color: '#fff',
          },
        },
        outlinedSecondary: {
          color: 'secondary',
          borderColor: 'secondary',
          '&:hover': {
            backgroundColor: '#B5272E',
            color: '#fff',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          // marginBottom: '24px',
          // height: '36px',
        },
      },
    },
  },
})

export default theme

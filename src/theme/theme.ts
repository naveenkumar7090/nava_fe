import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6', // Light Blue for primary
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#2563eb', // Blue for secondary
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    },
    text: {
      primary: '#212121',
      secondary: '#666666'
    },
    error: {
      main: '#d32f2f'
    },
    warning: {
      main: '#f57c00'
    },
    info: {
      main: '#1976d2'
    },
    success: {
      main: '#388e3c'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 15,
    h1: {
      fontSize: '2.2rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.6rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.4rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.2rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.95rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.9rem',
    },
    caption: {
      fontSize: '0.75rem',
    },
    subtitle1: {
      fontSize: '0.95rem',
    },
    subtitle2: {
      fontSize: '0.875rem',
    }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'none',
          lineHeight: 1.4,
          minHeight: 40,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid transparent',
          '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
          },
        },
        contained: {
          backgroundColor: '#1f2937',
          color: '#ffffff',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            backgroundColor: '#111827',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          },
        },
        outlined: {
          backgroundColor: 'transparent',
          borderColor: '#d1d5db',
          color: '#374151',
          '&:hover': {
            backgroundColor: '#f9fafb',
            borderColor: '#9ca3af',
          },
        },
        text: {
          color: '#6b7280',
          '&:hover': {
            backgroundColor: '#f3f4f6',
            color: '#374151',
          },
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '0.9rem',
          minHeight: 48,
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.8rem',
          minHeight: 32,
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            backgroundColor: '#2563eb', // Blue 600
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#1d4ed8', // Blue 700
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              backgroundColor: '#1e40af', // Blue 800
              transform: 'translateY(0)',
            },
          },
        },
        {
          props: { variant: 'contained', color: 'secondary' },
          style: {
            backgroundColor: '#f3f4f6', // Gray 100
            color: '#1f2937', // Gray 800 (dark text)
            border: '1px solid #e5e7eb', // Gray 200
            '&:hover': {
              backgroundColor: '#e5e7eb', // Gray 200
              color: '#111827', // Gray 900
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            },
            '&:active': {
              backgroundColor: '#d1d5db', // Gray 300
            },
          },
        },
        {
          props: { variant: 'destructive' as any },
          style: {
            backgroundColor: '#dc2626', // Red 600
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#b91c1c', // Red 700
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              backgroundColor: '#991b1b', // Red 800
              transform: 'translateY(0)',
            },
          },
        },
        {
          props: { variant: 'success' as any },
          style: {
            backgroundColor: '#059669', // Green 600
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#047857', // Green 700
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              backgroundColor: '#065f46', // Green 800
              transform: 'translateY(0)',
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#212121',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #e0e0e0',
        }
      }
    }
  }
});

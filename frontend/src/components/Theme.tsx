import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { palette, primaryBackgroundGradient, typography } from '../configs/theme';

const baseTheme = createTheme({
  palette: {
    primary: { main: palette.primary.main },
    secondary: { main: palette.secondary.main },
    error: { main: palette.error.main },
    warning: { main: palette.warning.main },
    success: { main: palette.success.main },
    info: { main: palette.info.main },
    background: { default: palette.background.default },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: primaryBackgroundGradient,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '0.85rem',
          [theme.breakpoints.up('sm')]: {
            fontSize: '0.95rem',
          },
          [theme.breakpoints.up('md')]: {
            fontSize: '1rem',
          },
          [theme.breakpoints.up('lg')]: {
            fontSize: '1.05rem',
          },
        }),
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
  },
  typography: {
      h1: {
        fontFamily: typography.h1.fontFamily,
        fontSize: typography.h1.fontSize.xs,
        fontWeight: typography.h1.fontWeight,
        lineHeight: typography.h1.lineHeight,
      },
      h2: {
        fontFamily: typography.h2.fontFamily,
        fontSize: typography.h2.fontSize.xs,
        fontWeight: typography.h2.fontWeight,
        lineHeight: typography.h2.lineHeight,
      },
      h3: {
        fontFamily: typography.h3.fontFamily,
        fontSize: typography.h3.fontSize.xs,
        fontWeight: typography.h3.fontWeight,
        lineHeight: typography.h3.lineHeight,
      },
      body1: {
        fontFamily: typography.body1.fontFamily,
        fontSize: typography.body1.fontSize.xs,
        fontWeight: typography.body1.fontWeight,
        lineHeight: typography.body1.lineHeight,
      },
      body2: {
        fontFamily: typography.body2.fontFamily,
        fontSize: typography.body2.fontSize.xs,
        fontWeight: typography.body2.fontWeight,
        lineHeight: typography.body2.lineHeight,
      },
      caption: {
        fontFamily: typography.caption.fontFamily,
        fontSize: typography.caption.fontSize.xs,
        fontWeight: typography.caption.fontWeight,
        lineHeight: typography.caption.lineHeight,
      },
      button: {
        fontFamily: typography.button.fontFamily,
        fontSize: typography.button.fontSize.xs,
        fontWeight: typography.button.fontWeight,
        lineHeight: typography.button.lineHeight,
      },
    },
});

export const theme = responsiveFontSizes(baseTheme);
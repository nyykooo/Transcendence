import { createTheme } from '@mui/material/styles';
import { palette, backgroundGradient } from '../configs/theme';

export const theme = createTheme({
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
          background: backgroundGradient,
        },
      },
    },
  },
});
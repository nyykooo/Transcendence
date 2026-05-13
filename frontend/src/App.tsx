import { Box, ThemeProvider } from '@mui/material';
import Router from './routes/Router';
import { primaryBackgroundGradient } from './configs/theme';
import { theme } from './components/components';

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    width: '100%',
                    overflowX: 'hidden',
                    background: primaryBackgroundGradient,
                }}
            >
                <Router />
            </Box>
        </ThemeProvider>
    );
}
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import Router from './routes/Router';
import { theme } from './components/components';

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                width: '100%',
                overflowX: 'hidden'
            }}>
                <Router />
            </Box>
        </ThemeProvider>
    );
}

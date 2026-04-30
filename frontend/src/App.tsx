import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import Router from './routes/Router';
import { theme } from './components/components';

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{display: 'flex', flexDirection: 'column', height: '100vh', width: '100%'}}>
                <Router />
            </Box>
        </ThemeProvider>
    );
}
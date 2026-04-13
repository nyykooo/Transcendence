// import { BrowserRouter } from 'react-router-dom'
import { Box } from '@mui/material';
import { Header, Footer } from './components/components';
import Router from './routes/Router';

export default function App() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100dvh',
                width: '100%',
            }}
        >
            <Header />
            <Box
                component="main"
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    pb: { xs: 10, md: 9 },
                }}
            >
                <Router />
            </Box>
            <Footer />
        </Box>
    );
}
// import { BrowserRouter } from 'react-router-dom'
import { Box, Stack } from '@mui/material';
import { Header, Footer } from './components/components';
import Router from './routes/Router';

export default function App() {
    return (
            <Box sx={{display: 'flex', flexDirection: 'column', height: '100vh', width: '100%'}}>
                <Header/>
                <Router />
                <Footer />
            </Box>
    );
}
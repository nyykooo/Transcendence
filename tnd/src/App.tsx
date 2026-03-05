// import { BrowserRouter } from 'react-router-dom'
import { Box, Stack } from '@mui/material';
import Header from './components/Header';
import Router from './routes/Router';
import Footer from './components/Footer';

export default function App() {
    return (
            <Box sx={{display: 'flex', flexDirection: 'column', height: '100vh', width: '100%'}}>
                <Header/>
                <Router />
                <Footer />
            </Box>
    );
}
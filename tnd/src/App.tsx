// import { BrowserRouter } from 'react-router-dom'
import { Box, Stack } from '@mui/material';
import Page from './components/Page';
import Header from './components/Header';
import Router from './routes/Router';

export default function App() {
    return (
            <Box sx={{display: 'flex', flexDirection: 'column', height: '100vh', width: '100%'}}>
                <Header/>
                <Router />
                <Page route='home' label="home"/>
            </Box>
    );
}
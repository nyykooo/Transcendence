import { Box, Stack } from '@mui/material';
import Page from './components/Page';
import Header from './components/Header';

export default function App() {
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100vh', width: '100%'}}>
            <Header/>
            <Page/>
        </Box>
    );
}
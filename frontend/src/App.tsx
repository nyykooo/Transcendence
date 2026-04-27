import { Box } from '@mui/material';
import Router from './routes/Router';

export default function App() {
    return (
            <Box sx={{display: 'flex', flexDirection: 'column', height: '100vh', width: '100%'}}>
                <Router />
            </Box>
    );
}
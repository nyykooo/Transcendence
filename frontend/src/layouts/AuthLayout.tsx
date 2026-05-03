import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Footer } from '../components/components';

export default function AuthLayout() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
            <Outlet />
            <Footer />
        </Box>
    );
}
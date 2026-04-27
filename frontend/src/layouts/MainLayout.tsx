import { Box } from '@mui/material';
import { Header, Footer } from '../components/components';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
            <Header />
            <Outlet />
            <Footer />
        </Box>
    );
}
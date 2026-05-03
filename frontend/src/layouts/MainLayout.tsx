import { Box } from '@mui/material';
import { Header, Footer } from '../components/components';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    return (
<<<<<<< Updated upstream
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100vh', 
            width: '100%',
            paddingBottom: { xs: 7, md: 0 }  // Espaço para footer em mobile
        }}>
=======
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
>>>>>>> Stashed changes
            <Header />
            <Outlet />
            <Footer />
        </Box>
    );
}
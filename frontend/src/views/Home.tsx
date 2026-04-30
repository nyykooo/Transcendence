import { Box, Typography } from '@mui/material';
import { Logo } from '../components/components';
import { images } from '../configs/images';
import { palette, typography } from '../configs/theme';

export default function Home() {
    return (
        <Box 
            sx={{
                height: '100%', 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 2
            }}>
                <Typography 
                    variant="h1" 
                    sx={{
                        color: palette.text.primary,
                        marginTop: 4,
                        ...typography.h1
                    }}
                >
                        Welcome to Brunch.io
                </Typography>
                <Logo 
                    path={images.icons.logo} 
                    size={200}
                />
        </Box>
    );
}
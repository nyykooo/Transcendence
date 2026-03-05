import { useState } from 'react';

import DomeGallery from '../components/DomeGallery';
import { Box } from '@mui/material';

export default function Home() {
    return (
        <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
            <DomeGallery fit={1} grayscale={false} />
        </Box>
    );
}
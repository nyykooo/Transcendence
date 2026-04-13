import DomeGallery from '../components/DomeGallery';
import { Box } from '@mui/material';
import { images } from '../configs/images';

export default function Home() {

    const carouselImages = images.carousel.map(img => ({
    src: img.src,   // ou src_heavy dependendo da qualidade que queres
    alt: img.alt
    }));

    return (
        <Box sx={{
            position: 'relative',
            height: 'calc(100dvh - 140px)',
            width: '100%',
            backgroundColor: 'black',
            overflow: 'hidden',
        }}>
            <Box sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <DomeGallery images={carouselImages} maxRadius={800} fit={1} grayscale={false} segments={20} />
            </Box>
        </Box>
    );
}
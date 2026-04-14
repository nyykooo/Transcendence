import DomeGallery from '../components/DomeGallery';
import { Box } from '@mui/material';
import { images } from '../configs/images';

export default function Home() {

    const carouselImages = images.carousel.map(img => ({
    src: img.src,   // ou src_heavy dependendo da qualidade que queres
    alt: img.alt
    }));

    return (
        <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, backgroundColor: 'black'}}>
            <DomeGallery images={carouselImages} maxRadius={800} fit={1} grayscale={false} segments={20} />
        </Box>
    );
}
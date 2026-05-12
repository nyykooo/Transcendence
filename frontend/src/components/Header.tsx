
import { useNavigate, useLocation } from 'react-router-dom';

import { Button, Stack, Typography } from '@mui/material';

import Settings from './Settings';
import Logo from './Logo';

import { paths } from '../configs/routes';
import { images } from '../configs/images';
import NavigationMenu from './NavigationMenu';

export default function Header() {

    const navigate = useNavigate();
    
    const location = useLocation();

    function updatePage(path: string) {
        navigate(path);
        console.log('navigate to', path);
    }

    function getLocationName() {
        const path = location.pathname;
        return Object.values(paths).find((p) => p.path === path)?.name;
    }

    return (
        <Stack 
            direction="row" 
            useFlexGap 
            flexWrap="wrap"
            justifyContent="space-between"
            sx={{ paddingX: { xs: 1, md: 5 } }}
        >
            <Button onClick={() => updatePage(paths.home.path)}>
                <Logo size={{ xs: 60, md: 120, lg: 150 }} path={images.icons.logo}/>
            </Button>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                paddingX: { xs: 1, md: 5 },
                marginTop: { xs: 1, md: 0 }
            }}>
                <Typography 
                    variant="h1" 
                    sx={{ 
                    alignSelf: 'center',
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    flex: 1
                    }}
                >
                    {getLocationName()}
                </Typography>
                <NavigationMenu/>
            </Stack>
            <Settings/>
        </Stack>
    );
}
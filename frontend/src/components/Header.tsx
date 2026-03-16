
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
        <Stack direction="row" useFlexGap justifyContent="space-between">
            <Button onClick={() => updatePage(paths.home.path)}>
                <Logo size={100} path={images.icons.logo}/>
            </Button>
            <Stack sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingX: 5
                }}>
                <Typography variant="h4" sx={{alignSelf: 'end'}}>
                    {getLocationName()}
                </Typography>
                <NavigationMenu/>
            </Stack>
            <Settings/>
        </Stack>
    );
}
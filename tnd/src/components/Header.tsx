
import { useNavigate, useLocation } from 'react-router-dom';

import { Button, Stack, Typography } from '@mui/material';

import Settings from './Settings';
import Logo from './Logo';

import { paths } from '../configs/routes';
import type { PageProps } from '../props/PageProps';
import NavigationMenu from './NavigationMenu';

export default function Header() {

    const navigate = useNavigate();
    
    const location = useLocation();

    function updatePage(item: PageProps) {
        navigate(paths[item.route]);
        console.log('navigate to', paths[item.route]);
    }

    function getLocationName() {
        const path = location.pathname;

        const mapLocationToName: Record<string, string> = {
            [paths.home]: 'Brunchio',
            [paths.recipesList]: 'Recipes List',
            [paths.recipe]: 'Recipe',
        }

        return mapLocationToName[path];
    }

    return (
        <Stack direction="row" useFlexGap justifyContent="space-between">
            <Button onClick={() => updatePage({route: 'home', label: 'Home'})}>
                <Logo size={100} path="/assets/image/brunchio_logo.png"/>
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
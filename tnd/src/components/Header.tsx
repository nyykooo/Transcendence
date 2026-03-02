
import { useNavigate } from 'react-router-dom';

import { Button, Stack } from '@mui/material';

import Settings from './Settings';
import Logo from './Logo';

import { paths } from '../configs/routes';
import type { PageProps } from '../props/PageProps';

export default function Header() {

    const navigate = useNavigate();
    
    function updatePage(item: PageProps) {
        navigate(paths[item.route]);
        console.log('navigate to', paths[item.route]);
    }

    return (
        <Stack direction="row" useFlexGap justifyContent="space-between">
            <Button onClick={() => updatePage({route: 'home', label: 'Home'})}>
                <Logo size={164} path="/assets/image/brunchio_logo.png"/>
            </Button>
            <Settings/>
        </Stack>
    );
}
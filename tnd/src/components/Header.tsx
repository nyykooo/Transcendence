
import SideMenu  from './SideMenu';
import Settings from './Settings';
import { Stack } from '@mui/material';

export default function Header() {
    return (
        <Stack direction="row" useFlexGap justifyContent="space-between">
            <SideMenu/>
            <Settings/>
        </Stack>
    );
}
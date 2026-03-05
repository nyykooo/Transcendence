import { useNavigate } from 'react-router-dom'
import { Box, Button } from '@mui/material';
import { paths } from '../configs/routes';
import { pages } from '../configs/pages';

import { type PageProps } from '../props/PageProps';

export default function NavigationMenu() 
{
    const navigate = useNavigate();

    function updatePage(item: PageProps) {
        navigate(paths[item.route].path);
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'end'}}>
            {pages.map((item, ) => (
                <Button key={item.label} onClick={() => updatePage(item)}>
                    {item.label}
                </Button>
            ))}
        </Box>
    );
}
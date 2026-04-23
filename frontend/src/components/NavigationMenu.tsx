import { useNavigate } from 'react-router-dom'
import { Box, Button } from '@mui/material';
import { paths } from '../configs/routes';
import { pages } from '../configs/pages';

import { type PageProps } from '../props/PageProps';
import RoleBaseGuard from './RoleBaseGuard';
import { useAuth } from './AuthProvider';

export default function NavigationMenu() 
{
    const { user } = useAuth();
    const navigate = useNavigate();

    function updatePage(item: PageProps) {
        navigate(paths[item.route].path);
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'end'}}>
            {pages.map((item) => (
                <Box key={item.label}>
                    {item.label === "Admin Panel" ? (
                        <RoleBaseGuard
                            role={user?.role}
                            children={
                                <Button onClick={() => updatePage(item)}>
                                    {item.label}
                                </Button>
                            }
                            protection={null}
                        />
                    ) : (
                        <Button onClick={() => updatePage(item)}>
                            {item.label}
                        </Button>
                    )}
                </Box>
            ))}
        </Box>
    );
}
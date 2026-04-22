import { Box } from '@mui/material';
import { useAuth } from '../../components/AuthProvider';
import { RoleBaseGuard, ErrorPage } from '../../components/components';

export default function AdminView()
{
    const { user } = useAuth();

    return (
        <RoleBaseGuard role={user?.role} 
            children={
                <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
                    <h1>Admin View</h1>
                    <p>Only admin users can access this view.</p>
                    <h2>Pending Recipes</h2>
                    <p>Here you can review and approve or reject pending recipes submitted by users.</p>
                </Box>
            }
            protection={
                <ErrorPage message="You do not have permission to access this page." />
            }
        />
    );
}
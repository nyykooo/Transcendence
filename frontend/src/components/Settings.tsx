import { useState } from 'react';
import { Box, List, Divider, ListItem, ListItemButton, ListItemText, Button, Drawer } from '@mui/material';

import { images } from '../configs/images';

import Logo from './Logo';
import { useNavigate } from 'react-router';

import { useAuth } from '../components/AuthProvider';
import { logout } from '../api/settings';

export default function Settings() 
{
  const { signOut } = useAuth();

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
      setOpen(open);
  }

  const execLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout from backend:', error);
    } finally {
      signOut();
      navigate('/login');
    }
  }

  const pages = [{name: 'Profile', function: () => navigate('/profile')}, {name: 'Settings', function: () => navigate('/settings')}, {name: 'Logout', function: execLogout}];
    
  const DrawerList = (
    <Box sx={{ width: '25%', minWidth: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {pages.map((page) => (
          <ListItem key={page.name} disablePadding>
            <ListItemButton onClick={page.function}>
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
      <>
        <Button onClick={toggleDrawer(true)}>
          <Logo size={100} path={images.icons.settings}/>
        </Button>
        <Drawer open={open} onClose={toggleDrawer(false)} anchor='right'>
            {DrawerList}
        </Drawer>
      </>
  );
}
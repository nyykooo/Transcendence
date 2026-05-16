import { useState } from 'react';
import { Box, List, Divider, ListItem, ListItemButton, ListItemText, Button, Drawer, useTheme, useMediaQuery } from '@mui/material';
import { images } from '../configs/images';
import Logo from './Logo';
import { useNavigate } from 'react-router';
import { useAuth } from '../components/AuthProvider';
import { logout } from '../api/settings';
import { pages as navPages } from '../configs/pages'; // ajuste o path conforme necessário

export default function Settings() {
  const { signOut, user } = useAuth(); // assumindo que user tem uma prop role ou similar
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const isSmallOrMedium = useMediaQuery(theme.breakpoints.down('lg'));

  const toggleDrawer = (open: boolean) => () => {
    setOpen(open);
  };

  const execLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout from backend:', error);
    } finally {
      signOut();
      navigate('/login');
    }
  };

  const isAdmin = user?.role === 'admin';

  const navButtons = isSmallOrMedium
    ? navPages
        .filter((page) => page.route.path !== '/admin' || isAdmin)
        .map((page) => ({
          name: page.label,
          function: () => navigate(page.route.path),
        }))
    : [];

  const pages = [
    ...navButtons,
    {
      name: 'Logout',
      function: execLogout,
    },
  ];

  const DrawerList = (
    <Box sx={{ width: '25%', minWidth: 250 }} role="presentation">
      <List>
        {pages.map((page) => (
          <ListItem key={page.name} disablePadding>
            <ListItemButton
              onClick={() => {
                toggleDrawer(false)();
                page.function();
              }}
            >
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
        <Logo size={{ xs: 60, md: 120, lg: 150 }} path={images.icons.settings} />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
        {DrawerList}
      </Drawer>
    </>
  );
}
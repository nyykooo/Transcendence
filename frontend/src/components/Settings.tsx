import { useState } from 'react';
import { Box, List, Divider, ListItem, ListItemButton, ListItemText, Button, Drawer } from '@mui/material';

import { images } from '../configs/images';

import Logo from './Logo';

export default function Settings() 
{
    const [open, setOpen] = useState(false);

    const toggleDrawer = (open: boolean) => () => {
        setOpen(open);
    }

    
  const DrawerList = (
    <Box sx={{ width: '25%', minWidth: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Home', 'Recipes List', 'Recipe'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
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
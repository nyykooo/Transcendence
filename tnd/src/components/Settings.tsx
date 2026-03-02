import { useState } from 'react';
import { Box, List, Divider, ListItem, ListItemButton, ListItemText, Button, Drawer } from '@mui/material';

export default function Settings() 
{
    const [open, setOpen] = useState(false);

    const toggleDrawer = (open: boolean) => () => {
        setOpen(open);
    }

    
  const DrawerList = (
    <Box sx={{ width: '25%', minWidth: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Home', 'Recipes List', 'Recipe'].map((text, index) => (
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
      <div>
          <Button onClick={toggleDrawer(true)}>Settings</Button>
          <Drawer open={open} onClose={toggleDrawer(false)} anchor='right'>
              {DrawerList}
          </Drawer>
      </div>
  );
}
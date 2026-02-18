import { useState } from 'react';
import { Box, List, Divider, ListItem, ListItemButton, ListItemText, Button, Drawer } from '@mui/material';

export default function SideMenu() 
{
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
      setOpen(open);
  }
    
  const DrawerList = (
    <Box sx={{ width: '25%', minWidth: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );


    return (
        <div>
            <Button onClick={toggleDrawer(true)}>Menu</Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}
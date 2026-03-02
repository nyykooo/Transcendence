import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Box, List, Divider, ListItem, ListItemButton, ListItemText, Button, Drawer } from '@mui/material';
import { paths } from '../configs/routes';

type PageProps = {
    route: keyof typeof paths;
    label: string;
}

export default function SideMenu() 
{
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
      setOpen(open);
  }

  function updatePage(item: PageProps) {
    navigate(paths[item.route]);
    setOpen(false);
  }

  const pages: PageProps[] = [
    {
      route: 'home',
      label: 'Home' 
    },
    {
      route: 'recipesList',
      label: 'Recipes List' 
    },
    {
      route: 'recipe',
      label: 'Recipe' 
    },
  ]

  const DrawerList = (
    <Box sx={{ width: '25%', minWidth: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {pages.map((item, index) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton onClick={() => updatePage(item)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
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
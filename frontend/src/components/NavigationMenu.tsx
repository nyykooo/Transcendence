import { useNavigate } from 'react-router-dom'
import { Box, useTheme, useMediaQuery } from '@mui/material';
import UIButton from './UIButton';
import { pages } from '../configs/pages';
import { type PageProps } from '../props/PageProps';
import RoleBaseGuard from './RoleBaseGuard';
import { useAuth } from './AuthProvider';

export default function NavigationMenu() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallOrMedium = useMediaQuery(theme.breakpoints.down('lg'));

  function updatePage(item: PageProps) {
    navigate(item.route.path);
  }

  if (isSmallOrMedium) return null;

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'end',
      gap: 1
    }}>
      {pages.map((item) => (
        <Box key={item.label}>
          {item.label === "Admin Panel" ? (
            <RoleBaseGuard
              role={user?.role}
              children={
                <UIButton onClick={() => updatePage(item)}>
                  {item.label}
                </UIButton>
              }
              protection={null}
            />
          ) : (
            <UIButton onClick={() => updatePage(item)}>
              {item.label}
            </UIButton>
          )}
        </Box>
      ))}
    </Box>
  );
}
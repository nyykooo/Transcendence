import {
    Avatar,
    Box,
    Paper,
    Typography,
} from '@mui/material';

import type {
    ProfilePageShellProps,
    ProfileSectionCardProps,
    PublicProfileAvatarPanelProps,
} from '../../props/profile/componentProps';

export function ProfilePageShell({ children }: ProfilePageShellProps) {
    return (
        <Box
            sx={{
                minHeight: '100%',
                width: '100%',
                p: { xs: 2, md: 4 },
            }}
        >
            <Box sx={{ maxWidth: 1100, mx: 'auto' }}>{children}</Box>
        </Box>
    );
}

export function ProfileSectionCard({ title, description, children }: ProfileSectionCardProps) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                borderColor: 'rgba(15, 23, 42, 0.08)',
                background: 'linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)',
            }}
        >
            <Typography variant="h6" sx={{ mb: description ? 1 : 2, fontWeight: 700 }}>
                {title}
            </Typography>

            {description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {description}
                </Typography>
            )}

            {children}
        </Paper>
    );
}

export function PublicProfileAvatarPanel({
    user,
}: PublicProfileAvatarPanelProps) {
    return (
        <ProfileSectionCard title="Avatar">
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
                <Avatar
                    src={user.avatar || undefined}
                    sx={{
                        width: 120,
                        height: 120,
                        border: '4px solid #fff',
                        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.16)',
                    }}
                >
                    {user.name.charAt(0)}
                </Avatar>
            </Box>
        </ProfileSectionCard>
    );
}

import {
    Avatar,
    Box,
    Paper,
    Alert,
    Stack,
    Typography,
} from '@mui/material';

import type {
    ProfilePageShellProps,
    ProfileSectionCardProps,
    ProfileStatusBannerProps,
    PublicProfileInfoPanelProps,
} from '../../props/profile/componentProps';
import type { Recipe } from '../../props/recipe-list';

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

export function ProfileStatusBanner({ profileError, message }: ProfileStatusBannerProps) {
    return (
        <Stack spacing={1.5} sx={{ mb: 2 }}>
            {profileError && (
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                    {profileError}
                </Alert>
            )}

            {message && (
                <Alert severity={message.type} sx={{ borderRadius: 2 }}>
                    {message.text}
                </Alert>
            )}
        </Stack>
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

export function PublicProfileInfoPanel({
    user,
}: PublicProfileInfoPanelProps) {
    if (!user) return null;

    return (
        <ProfileSectionCard title="Avatar">
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
                <Stack sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
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
                </Stack>
                <Stack sx={{ mt: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {user.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            component="span"
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: user.is_active ? 'success.main' : 'text.disabled',
                            }}
                        />
                        <Typography variant="caption" color={user.is_active ? 'success.main' : 'text.secondary'}>
                            {user.is_active ? 'Online' : 'Offline'}
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        </ProfileSectionCard>
    );
}

type PublicProfileLikedTableProps = {
    likedRecipes: Recipe[] | null;
    onClickRecipe: (recipeName: string) => void;
};

export function PublicProfileLikedTable({ likedRecipes, onClickRecipe }: PublicProfileLikedTableProps) {
    return (
        <ProfileSectionCard title="Liked Recipes">
            {likedRecipes && likedRecipes.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        {likedRecipes.length} {likedRecipes.length === 1 ? 'recipe' : 'recipes'} liked
                    </Typography>
                    {likedRecipes.map((recipe) => (
                        <Box
                            key={recipe.recipe_name}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                border: '1px solid rgba(15, 23, 42, 0.08)',
                                backgroundColor: '#fff',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 1,
                                color: 'primary.main',
                            }}
                            onClick={() => onClickRecipe(recipe.recipe_name)}
                        >
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {recipe.recipe_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {recipe.diet}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography variant="body2" color="text.secondary">
                    No liked recipes yet.
                </Typography>
            )}
        </ProfileSectionCard>
    );
}

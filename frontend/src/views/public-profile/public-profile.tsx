import { Card, CardContent, Stack } from '@mui/material';

import { 
    ProfilePageShell,
    PublicProfileLikedTable
} from './public-profile-components';
import {
    PublicProfileAvatarSection
} from './public-profile-sections';
import { usePublicProfile } from './usePublicProfile';
import { useNavigate } from 'react-router-dom';

export default function PublicProfile() {

    const navigate = useNavigate();

        const {
            user,
            // profileError,
            // message,
            // friendEmail,
            // handleAddFriend,
            // handleRemoveFriend,
        } = usePublicProfile();

    return (
        <ProfilePageShell>
            <Card sx={{ width: '100%', borderRadius: 4, boxShadow: '0 18px 55px rgba(15, 23, 42, 0.08)' }}>
                <CardContent sx={{ p: { xs: 2, md: 4 } }}>

                    <Stack spacing={3}>
                        <PublicProfileAvatarSection
                            user={user}
                        />
                        <PublicProfileLikedTable
                            likedRecipes={user.likedRecipes}
                            onClickRecipe={(recipeName) => {
                                navigate(`/recipe/${recipeName}`);
                            }}
                        />
                    </Stack>
                </CardContent>
            </Card>
        </ProfilePageShell>
    );
}
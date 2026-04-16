import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';

import { ProfileHeroCard, ProfilePageShell, ProfileStatusBanner } from './ProfileComponents';
import {
    ProfileAvatarSection,
    ProfileDetailsSection,
    ProfilePasswordSection,
} from './ProfileSections';
import { useProfile } from './useProfile';

export default function Profile() {
    const {
        user,
        selectedFile,
        preview,
        avatarLoading,
        profileLoading,
        passwordLoading,
        profileError,
        message,
        profileForm,
        passwordForm,
        handleFileSelect,
        handleUpload,
        handleProfileUpdate,
        handlePasswordUpdate,
        handleProfileFieldChange,
        handlePasswordFieldChange,
    } = useProfile();

    return (
        <ProfilePageShell>
            <ProfileHeroCard user={user} previewSrc={preview} />

            <Card sx={{ width: '100%', borderRadius: 4, boxShadow: '0 18px 55px rgba(15, 23, 42, 0.08)' }}>
                <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Keep your profile up to date and secure.
                    </Typography>

                    <ProfileStatusBanner profileError={profileError} message={message} />

                    <Stack spacing={3}>
                        <ProfileAvatarSection
                            user={user}
                            previewSrc={preview}
                            selectedFile={selectedFile}
                            loading={avatarLoading}
                            onFileSelect={handleFileSelect}
                            onUpload={handleUpload}
                        />

                        <Divider />

                        <ProfileDetailsSection
                            profileForm={profileForm}
                            loading={profileLoading}
                            onFieldChange={handleProfileFieldChange}
                            onSave={handleProfileUpdate}
                        />

                        <Divider />

                        <ProfilePasswordSection
                            passwordForm={passwordForm}
                            loading={passwordLoading}
                            onFieldChange={handlePasswordFieldChange}
                            onSave={handlePasswordUpdate}
                        />
                    </Stack>
                </CardContent>
            </Card>
        </ProfilePageShell>
    );
}
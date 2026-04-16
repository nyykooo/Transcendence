import { Box } from '@mui/material';

import { ProfileActionButton, ProfileAvatarPanel, ProfileField, ProfileFormStack, ProfileSectionCard, ProfileSectionNote } from './ProfileComponents';
import type {
    ProfileAvatarSectionProps,
    ProfileDetailsSectionProps,
    ProfilePasswordSectionProps,
} from '../../props/profile/sectionProps';

export function ProfileAvatarSection({
    user,
    previewSrc,
    selectedFile,
    loading,
    onFileSelect,
    onUpload,
}: ProfileAvatarSectionProps) {
    return (
        <ProfileAvatarPanel
            user={user}
            previewSrc={previewSrc}
            selectedFile={selectedFile}
            loading={loading}
            onFileSelect={onFileSelect}
            onUpload={onUpload}
        />
    );
}

export function ProfileDetailsSection({ profileForm, loading, onFieldChange, onSave }: ProfileDetailsSectionProps) {
    return (
        <ProfileSectionCard title="Profile Information" description="Keep your display name and email up to date.">
            <ProfileFormStack>
                <ProfileField label="Display Name" value={profileForm.name} onChange={onFieldChange('name')} />
                <ProfileField label="Email" type="email" value={profileForm.email} onChange={onFieldChange('email')} />
                <Box>
                    <ProfileActionButton loading={loading} onClick={onSave} minWidth={160}>
                        Save Profile
                    </ProfileActionButton>
                </Box>
            </ProfileFormStack>
        </ProfileSectionCard>
    );
}

export function ProfilePasswordSection({
    passwordForm,
    loading,
    onFieldChange,
    onSave,
}: ProfilePasswordSectionProps) {
    return (
        <ProfileSectionCard title="Change Password" description="Use a long, unique password for better security.">
            <ProfileFormStack>
                <ProfileField
                    label="Current Password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={onFieldChange('currentPassword')}
                />
                <ProfileField
                    label="New Password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={onFieldChange('newPassword')}
                />
                <ProfileField
                    label="Confirm New Password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={onFieldChange('confirmPassword')}
                />
                <ProfileSectionNote>
                    Your new password must be at least 8 characters long.
                </ProfileSectionNote>
                <Box>
                    <ProfileActionButton loading={loading} onClick={onSave} color="secondary" minWidth={180}>
                        Update Password
                    </ProfileActionButton>
                </Box>
            </ProfileFormStack>
        </ProfileSectionCard>
    );
}
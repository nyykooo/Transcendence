import type { ChangeEvent } from 'react';

import type { PasswordForm, ProfileForm, ProfileUser } from './sharedProps';

export type ProfileAvatarSectionProps = {
    user: ProfileUser;
    previewSrc: string | null;
    selectedFile: File | null;
    hasCustomAvatar: boolean;
    loading: boolean;
    onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
    onUpload: () => void;
    onDeleteAvatar: () => void;
};

export type ProfileDetailsSectionProps = {
    profileForm: ProfileForm;
    loading: boolean;
    onFieldChange: (field: keyof ProfileForm) => (event: ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
};

export type ProfilePasswordSectionProps = {
    passwordForm: PasswordForm;
    loading: boolean;
    onFieldChange: (field: keyof PasswordForm) => (event: ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
};
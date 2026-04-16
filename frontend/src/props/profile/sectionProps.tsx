import type { ChangeEvent } from 'react';

import type { PasswordForm, ProfileForm, ProfileUser } from './sharedProps';

export type ProfileAvatarSectionProps = {
    user: ProfileUser;
    previewSrc: string | null;
    selectedFile: File | null;
    loading: boolean;
    onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
    onUpload: () => void;
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
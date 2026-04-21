import type { ChangeEvent, PropsWithChildren } from 'react';

import type { ApiMessage, ProfileUser } from './sharedProps';

export type ProfilePageShellProps = PropsWithChildren;

export type ProfileHeroCardProps = {
    user: ProfileUser;
    previewSrc: string | null;
};

export type ProfileSummaryCardProps = ProfileHeroCardProps;

export type ProfileStatusBannerProps = {
    profileError: string | null;
    message: ApiMessage | null;
};

export type ProfileSectionCardProps = PropsWithChildren<{
    title: string;
    description?: string;
}>;

export type ProfileAvatarPanelProps = {
    user: ProfileUser;
    previewSrc: string | null;
    selectedFile: File | null;
    hasCustomAvatar: boolean;
    loading: boolean;
    onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
    onUpload: () => void;
    onDeleteAvatar: () => void;
};

export type ProfileFieldProps = {
    label: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
};

export type ProfileActionButtonProps = PropsWithChildren<{
    loading: boolean;
    onClick: () => void;
    color?: 'primary' | 'secondary' | 'error';
    variant?: 'contained' | 'outlined';
    minWidth?: number;
}>;

export type ProfileFormStackProps = PropsWithChildren;

export type ProfileSectionNoteProps = PropsWithChildren;
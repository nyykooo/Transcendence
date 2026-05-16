import type { ChangeEvent } from 'react';

import type { FriendUser, PasswordForm, ProfileForm, ProfileUser, PublicProfileUser, TwoFactorSetupPayload } from './sharedProps';

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

export type PublicProfileInfoSectionProps = {
    user: PublicProfileUser;
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

export type ProfileTwoFactorSectionProps = {
    enabled: boolean;
    loading: boolean;
    code: string;
    setupPayload: TwoFactorSetupPayload | null;
    onCodeChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onSetup: () => void;
    onVerify: () => void;
    onDisable: () => void;
};

export type ProfileFriendsSectionProps = {
    friends: FriendUser[];
    friendRequests: FriendUser[];
    friendEmail: string;
    loading: boolean;
    onClickPublicProfile: (friendName: string) => void;
    onFriendEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onAddFriend: () => void;
    onRemoveFriend: (email: string) => void;
    onAcceptFriendRequest: (email: string) => void;
    onRejectFriendRequest: (email: string) => void;
};
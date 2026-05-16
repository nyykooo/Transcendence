import type { Recipe } from '../recipe-list';
import type { ProfileUser, PublicProfileUser } from './sharedProps';

export type ProfilePayload = Partial<ProfileUser>;
export type PublicProfilePayload = Partial<PublicProfileUser>;

export type ProfileEnvelope = {
    user?: ProfilePayload;
    friends?: ProfilePayload['friends'];
    requests?: ProfilePayload['friendRequests'];
    avatar?: string | null;
    qrCodeDataUrl?: string;
    manualEntryKey?: string;
    error?: string;
    message?: string;
};

export type PublicProfileEnvelope = {
    user?: ProfilePayload;
    likedRecipes?: Recipe[];
    avatar?: string | null;
    error?: string;
    message?: string;
};

export type ProfileUpdateInput = {
    name: string;
    email: string;
};

export type PasswordUpdateInput = {
    currentPassword: string;
    newPassword: string;
};

export type TwoFactorVerifyInput = {
    token: string;
};

export type FriendRequestCreateInput = {
    name: string;
};

export type FriendUpdateInput = {
    email: string;
};
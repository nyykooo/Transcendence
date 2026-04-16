import type { ProfileUser } from './sharedProps';

export type ProfilePayload = Partial<ProfileUser>;

export type ProfileEnvelope = {
    user?: ProfilePayload;
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
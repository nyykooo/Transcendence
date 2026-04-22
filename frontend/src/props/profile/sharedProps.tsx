export type FriendUser = {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    is_active?: boolean;
};

export type ProfileUser = {
    name: string;
    email: string;
    avatar: string | null;
    twoFactorEnabled?: boolean;
    friends?: FriendUser[];
    friendRequests?: FriendUser[];
};

export type TwoFactorSetupPayload = {
    qrCodeDataUrl: string;
    manualEntryKey: string;
};

export type ApiMessage = {
    type: 'success' | 'error';
    text: string;
};

export type ProfileForm = {
    name: string;
    email: string;
};

export type PasswordForm = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};
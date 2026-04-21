export type ProfileUser = {
    name: string;
    email: string;
    avatar: string | null;
    twoFactorEnabled?: boolean;
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
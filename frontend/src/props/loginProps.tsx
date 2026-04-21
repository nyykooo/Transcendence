export type LoginProps = {
    email: string;
    password: string;
};

export type TwoFactorLoginProps = {
    twoFactorToken: string;
    otp: string;
};

export type LoginResponse = {
    message: string;
    id?: number;
    token?: string;
    role?: string;
    requires2fa?: boolean;
    twoFactorToken?: string;
};
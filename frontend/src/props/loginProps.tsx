export type LoginProps = {
    email: string;
    password: string;
};

export type LoginResponse = {
    message: string;
    id: number;
    token: string;
    role: string;
}
export type RegisterProps = {
    email: string;
    password: string;
};

export type RegisterResponse = {
    message: string;
    user: {
        id: number;
        email: string;
        password: string;
    };
    token: string;
}
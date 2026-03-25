export type LoginProps = {
    email: string;
    password: string;
};

export type LoginResponse = {
    message: string;
    user: {
        id: number;
        email: string;
        password: string;
    };
    token: string;
}

export type RegisterResponse = {
    message: string;
    user: {
        id: number;
        email: string;
        password: string;
    };
    token: string;
}
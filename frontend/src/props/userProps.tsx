export type User = {
    id: number;
    token: string;
    avatar?: string | null;
    role: string;
}

export type UserRows = {
    id: number;
    token: string;
    avatar?: string | null;
    role: string;
    name: string;
    email: string;
    is_active: boolean;
}

export type AllUsersResponse = {
    users: UserRows[];
}
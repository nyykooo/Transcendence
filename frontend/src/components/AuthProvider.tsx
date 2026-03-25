import { createContext, useContext, useState } from 'react';

import { type User } from '../props/userProps'
import { type AuthProviderProps } from '../props/authProviderProps';
import { type AuthContextType } from '../props/authContextProps';
import type { LoginProps } from '../props/loginProps';

import { submitLogin } from '../api/login';

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider ({ children, isSignedIn } : AuthProviderProps) {
    const [user, setUser] = useState<User | null>(isSignedIn ? {id: 1, token: 'abc'} : null)

    const signIn = async (login: LoginProps) => {
        const response = await submitLogin(login);

        if (response.user.email && response.user.password) {
            setUser({ id: response.user.id, token: response.token });
        } else {
            throw new Error('Invalid credentials');
        }
    };

    return <AuthContext.Provider value={{ user, signIn }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === null || context === undefined)
        throw new Error('useAuth must be used within an AuthProvider');
    
    return context;
}
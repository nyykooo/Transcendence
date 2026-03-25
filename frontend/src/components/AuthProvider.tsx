import { createContext, useContext, useState } from 'react';

import { type User } from '../props/userProps'
import { type AuthProviderProps } from '../props/authProviderProps';
import { type AuthContextType } from '../props/authContextProps';
import type { LoginProps } from '../props/loginProps';

import { submitLogin, submitGithubLogin } from '../api/login';

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider ({ children, isSignedIn } : AuthProviderProps) {
    const [user, setUser] = useState<User | null>(isSignedIn ? {id: 1, token: 'abc'} : null)

    const signIn = async (login: LoginProps = { email: '', password: '' }, option: string = 'default') => {
        var res;
        switch (option) {
            case 'github':
                res = await submitGithubLogin();

                if (res.id && res.token) {
                    setUser({ id: res.id, token: res.token });
                }
                else {
                    throw new Error('Github login failed');
                }
                break;
            default:
                if (login.email === '' || login.password === '') {
                    throw new Error('Email and password are required');
                }
                res = await submitLogin(login);

                if (res.id && res.token) {
                    setUser({ id: res.id, token: res.token });
                } else {
                    throw new Error('Invalid credentials');
                }
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
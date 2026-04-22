import { createContext, useContext, useState } from 'react';

import { type User } from '../props/userProps'
import { type AuthProviderProps } from '../props/authProviderProps';
import { type AuthContextType } from '../props/authContextProps';
import type { LoginProps, LoginResponse } from '../props/loginProps';

import { submitLogin, submitTwoFactorLogin, startGithubLogin } from '../api/login';

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = 'auth';

function readStoredUser(): User | null {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw)
            return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object')
            return null;
        // TODO: think in a better way to check valid roles in authProvider
        if (typeof parsed.token !== 'string'/*  || typeof parsed.role !== 'string' */)
            return null;

        const id = typeof parsed.id === 'number' ? parsed.id : Number(parsed.id);
        if (!Number.isFinite(id))
            return null;

        return { id, token: parsed.token, role: parsed.role};
    } catch {
        console.log('AuthProvider: error reading stored user');
        return null;
    }
}

function storeUser(user: User | null) {
    try {
        if (user === null) {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            return;
        }
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch {
        // ignore storage errors
    }
}

export default function AuthProvider ({ children } : AuthProviderProps) {
    const [user, setUser] = useState<User | null>(() => readStoredUser());

    const getAuthToken = (): string | null => {
        if (user?.token) {
            return user.token;
        }

        return readStoredUser()?.token ?? null;
    };

    const getAuthRole = (): string | null => {
        if (user?.role) {
            return user.role;
        }

        return readStoredUser()?.role ?? null;
    };

    const signIn = async (login: LoginProps = { email: '', password: '' }, option: string = 'default'): Promise<LoginResponse | void> => {
        let res: LoginResponse;
        switch (option) {
            case 'github':
                // Starts OAuth by redirecting away from the SPA.
                // The OAuth callback route will store the token and reload the app.
                startGithubLogin();
                return;
            default:
                if (login.email === '' || login.password === '') {
                    throw new Error('Email and password are required');
                }
                res = await submitLogin(login);

                if (res.requires2fa) {
                    return res;
                }

                if (res.id && res.token) {
                    const nextUser = { 
                        id: res.id, 
                        token: res.token, 
                        role: res.role
                         || 'user' };
                    storeUser(nextUser);
                    setUser(nextUser);
                    return res;
                } else {
                    throw new Error('Invalid credentials');
                }
        }
    };

    const completeTwoFactorSignIn = async (twoFactorToken: string, otp: string): Promise<LoginResponse> => {
        if (!twoFactorToken || !otp) {
            throw new Error('twoFactorToken and otp are required');
        }

        const res = await submitTwoFactorLogin({ twoFactorToken, otp });
        if (!res.id || !res.token) {
            throw new Error('Invalid 2FA login response');
        }

        const nextUser = { id: res.id, token: res.token, role: res.role || 'user' };
        storeUser(nextUser);
        setUser(nextUser);
        return res;
    };

    const signOut = () => {
        localStorage.removeItem('auth');
        storeUser(null);
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, signIn, completeTwoFactorSignIn, signOut, getAuthToken, getAuthRole }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === null || context === undefined)
        throw new Error('useAuth must be used within an AuthProvider');
    
    return context;
}
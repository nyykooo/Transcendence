import { api } from '../configs/api';
import { type LoginProps, type LoginResponse, type TwoFactorLoginProps } from '../props/loginProps';
import type { User } from '../props/userProps';

async function parseJsonSafe(response: Response): Promise<any> {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

export async function submitLogin(login: LoginProps): Promise<LoginResponse>
{
    const response = await fetch(api.login, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(login)
    });

    const data = await parseJsonSafe(response);
    if (!response.ok) {
        throw new Error(data?.error || data?.message || 'Login failed');
    }

    return data as LoginResponse;
}

export async function submitTwoFactorLogin(input: TwoFactorLoginProps): Promise<LoginResponse> {
    const response = await fetch(api.login2fa, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(input),
    });

    const data = await parseJsonSafe(response);
    if (!response.ok) {
        throw new Error(data?.error || data?.message || '2FA login failed');
    }

    return data as LoginResponse;
}

export async function submitGithubLogin(): Promise<LoginResponse>
{
    // IMPORTANT:
    // GitHub OAuth authorize endpoint does not support CORS.
    // If we use fetch() against an endpoint that redirects to GitHub,
    // the browser will follow the redirect as XHR and trigger a CORS preflight.
    // Therefore, GitHub login must be initiated via a top-level navigation.
    window.location.assign(api.githubAuth);
    // This promise never resolves because we leave the page.
    return new Promise(() => {});
}

export function startGithubLogin(): void {
    window.location.assign(api.githubAuth);
}

export async function checkToken(): Promise<boolean> {
    const auth: User | null = JSON.parse(localStorage.getItem('auth') || 'null');
    if (!auth) {
        return false;
    }
    return await fetch(api.checkToken, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('invalid token...');
        }
        return response.json();
    })
    .then(data => {
        return data.isValid;
    });
}
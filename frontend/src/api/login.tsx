import { type LoginProps, type LoginResponse } from '../props/loginProps';

export async function submitLogin(login: LoginProps): Promise<LoginResponse>
{
    return await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(login)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    });
}

export async function submitGithubLogin(): Promise<LoginResponse>
{
    // IMPORTANT:
    // GitHub OAuth authorize endpoint does not support CORS.
    // If we use fetch() against an endpoint that redirects to GitHub,
    // the browser will follow the redirect as XHR and trigger a CORS preflight.
    // Therefore, GitHub login must be initiated via a top-level navigation.
    window.location.assign('http://localhost:3000/auth/github');
    // This promise never resolves because we leave the page.
    return new Promise(() => {});
}

export function startGithubLogin(): void {
    window.location.assign('http://localhost:3000/auth/github');
}
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
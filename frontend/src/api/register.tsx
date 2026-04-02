import { api } from '../configs/api';
import { type RegisterProps, type RegisterResponse } from '../props/registerProps';

export async function register(login: RegisterProps): Promise<RegisterResponse>
{
    return await fetch(api.register, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(login)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Registration failed');
        }
        return response.json();
    });
}
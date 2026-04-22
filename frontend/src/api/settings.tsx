import { api } from '../configs/api';

export async function logout(): Promise<void> {
    const auth = JSON.parse(localStorage.getItem('auth') || 'null');
    const token = auth?.token;

    if (!token) {
        throw new Error('Missing auth token');
    }

    const response = await fetch(api.logout, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || data?.message || 'Logout failed');
    }
}
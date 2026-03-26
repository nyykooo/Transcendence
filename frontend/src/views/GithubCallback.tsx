import { useEffect } from 'react';

export default function GithubCallback() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const idParam = params.get('id');
        const token = params.get('token');

        const id = idParam ? Number(idParam) : NaN;

        if (Number.isFinite(id) && typeof token === 'string' && token.length > 0) {
            try {
                localStorage.setItem('auth', JSON.stringify({ id, token }));
            } catch {
                // ignore storage errors
            }
            // Reload so AuthProvider reads localStorage on initial mount.
            window.location.replace('/');
            return;
        }

        window.location.replace('/login');
    }, []);

    return null;
}

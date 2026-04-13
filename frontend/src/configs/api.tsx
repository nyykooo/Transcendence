const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = {
    checkToken: `${API_BASE_URL}/auth`,
    login: `${API_BASE_URL}/login`,
    githubAuth: `${API_BASE_URL}/auth/github`,
    register: `${API_BASE_URL}/register`,
    recipe: `${API_BASE_URL}/recipes/`
};
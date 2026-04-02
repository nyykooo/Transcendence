const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export const api = {
    login: `${API_BASE_URL}/login`,
    githubAuth: `${API_BASE_URL}/auth/github`,
    register: `${API_BASE_URL}/register`,
};
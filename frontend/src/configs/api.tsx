const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = {
    checkToken: `${API_BASE_URL}/auth`,
    login: `${API_BASE_URL}/login`,
    login2fa: `${API_BASE_URL}/login/2fa`,
    githubAuth: `${API_BASE_URL}/auth/github`,
    register: `${API_BASE_URL}/register`,
    recipe: `${API_BASE_URL}/recipes/`,
    profile: `${API_BASE_URL}/profile`,
    profileAvatar: `${API_BASE_URL}/profile/avatar`,
    profileAvatarDelete: `${API_BASE_URL}/profile/avatar`,
    profilePassword: `${API_BASE_URL}/profile/password`,
    profile2faSetup: `${API_BASE_URL}/profile/2fa/setup`,
    profile2faVerify: `${API_BASE_URL}/profile/2fa/verify`,
    profile2faDisable: `${API_BASE_URL}/profile/2fa/disable`
};
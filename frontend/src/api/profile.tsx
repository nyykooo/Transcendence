import type { ProfileUser } from '../props/profile/sharedProps';
import { api } from '../configs/api';
import type {
    PasswordUpdateInput,
    ProfileEnvelope,
    ProfilePayload,
    ProfileUpdateInput,
} from '../props/profile/apiProps';

const PROFILE_ENDPOINT = api.profile;
const PROFILE_AVATAR_ENDPOINT = api.profileAvatar;
const PROFILE_PASSWORD_ENDPOINT = api.profilePassword;

function normalizeUser(payload?: ProfilePayload | null, fallback?: ProfileUser): ProfileUser {
    return {
        name: payload?.name || fallback?.name || 'Test User',
        email: payload?.email || fallback?.email || '',
        avatar: payload?.avatar ?? fallback?.avatar ?? null,
    };
}

function getResponseError(data: ProfileEnvelope | null, fallback: string): string {
    return data?.error || data?.message || fallback;
}

async function parseProfileEnvelope(response: Response): Promise<ProfileEnvelope | null> {
    try {
        return (await response.json()) as ProfileEnvelope;
    } catch {
        return null;
    }
}

export async function fetchProfile(token: string): Promise<ProfileUser> {
    const response = await fetch(PROFILE_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await parseProfileEnvelope(response);
    if (!response.ok) {
        throw new Error(getResponseError(data, 'Could not load your profile right now.'));
    }

    return normalizeUser(data?.user);
}

export async function updateProfile(token: string, input: ProfileUpdateInput, fallback?: ProfileUser): Promise<ProfileUser> {
    const response = await fetch(PROFILE_ENDPOINT, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    const data = await parseProfileEnvelope(response);
    if (!response.ok) {
        throw new Error(getResponseError(data, 'Profile update failed.'));
    }

    return normalizeUser(data?.user, fallback);
}

export async function uploadProfileAvatar(token: string, avatar: File, fallback?: ProfileUser): Promise<ProfileUser> {
    const formData = new FormData();
    formData.append('avatar', avatar);

    const response = await fetch(PROFILE_AVATAR_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await parseProfileEnvelope(response);
    if (!response.ok) {
        throw new Error(getResponseError(data, 'Upload failed.'));
    }

    return normalizeUser(
        data?.user ?? { avatar: data?.avatar ?? fallback?.avatar ?? null },
        fallback,
    );
}

export async function updatePassword(token: string, input: PasswordUpdateInput): Promise<void> {
    const response = await fetch(PROFILE_PASSWORD_ENDPOINT, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    const data = await parseProfileEnvelope(response);
    if (!response.ok) {
        throw new Error(getResponseError(data, 'Password update failed.'));
    }
}
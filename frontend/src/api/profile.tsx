import type { ProfileUser } from '../props/profile/sharedProps';
import { api } from '../configs/api';
import type {
    FriendRequestCreateInput,
    FriendUpdateInput,
    PasswordUpdateInput,
    ProfileEnvelope,
    ProfilePayload,
    ProfileUpdateInput,
    TwoFactorVerifyInput,
} from '../props/profile/apiProps';
import type { TwoFactorSetupPayload } from '../props/profile/sharedProps';

const PROFILE_ENDPOINT = api.profile;
const PROFILE_AVATAR_ENDPOINT = api.profileAvatar;
const PROFILE_AVATAR_DELETE_ENDPOINT = api.profileAvatarDelete;
const PROFILE_PASSWORD_ENDPOINT = api.profilePassword;
const PROFILE_2FA_SETUP_ENDPOINT = api.profile2faSetup;
const PROFILE_2FA_VERIFY_ENDPOINT = api.profile2faVerify;
const PROFILE_2FA_DISABLE_ENDPOINT = api.profile2faDisable;
const PROFILE_FRIENDS_ENDPOINT = api.profileFriends;
const PROFILE_FRIEND_REQUESTS_ENDPOINT = api.profileFriendRequests;
const PROFILE_FRIEND_REQUESTS_ACCEPT_ENDPOINT = api.profileFriendRequestsAccept;

function normalizeMediaUrl(value?: string | null): string | null {
    if (!value) {
        return null;
    }

    if (value.startsWith('/uploads/')) {
        return value;
    }

    const uploadsIndex = value.indexOf('/uploads/');
    if (uploadsIndex >= 0) {
        return value.slice(uploadsIndex);
    }

    return value;
}

function normalizeFriend(friend: any) {
    if (!friend || typeof friend !== 'object') {
        return friend;
    }

    return {
        ...friend,
        avatar: normalizeMediaUrl(friend.avatar ?? null),
    };
}

function normalizeUser(payload?: ProfilePayload | null, fallback?: ProfileUser): ProfileUser {
    const payloadWithAliases = payload as (ProfilePayload & { two_factor_enabled?: boolean }) | undefined;
    return {
        name: payload?.name || fallback?.name || 'Test User',
        email: payload?.email || fallback?.email || '',
        avatar: normalizeMediaUrl(payload?.avatar ?? fallback?.avatar ?? null),
        twoFactorEnabled: payload?.twoFactorEnabled ?? payloadWithAliases?.two_factor_enabled ?? fallback?.twoFactorEnabled ?? false,
        friends: (payload?.friends ?? fallback?.friends ?? []).map(normalizeFriend),
        friendRequests: (payload?.friendRequests ?? fallback?.friendRequests ?? []).map(normalizeFriend),
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

export async function deleteProfileAvatar(token: string, fallback?: ProfileUser): Promise<ProfileUser> {
    const response = await fetch(PROFILE_AVATAR_DELETE_ENDPOINT, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await parseProfileEnvelope(response);
    if (!response.ok) {
        throw new Error(getResponseError(data, 'Failed to delete avatar.'));
    }

    return normalizeUser(data?.user, fallback);
}

export async function setupProfileTwoFactor(token: string): Promise<TwoFactorSetupPayload> {
    const response = await fetch(PROFILE_2FA_SETUP_ENDPOINT, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await parseProfileEnvelope(response);
    if (!response.ok) {
        throw new Error(getResponseError(data, 'Failed to initialize 2FA setup.'));
    }

    if (!data?.qrCodeDataUrl || !data?.manualEntryKey) {
        throw new Error('2FA setup response was incomplete.');
    }

    return {
        qrCodeDataUrl: data.qrCodeDataUrl,
        manualEntryKey: data.manualEntryKey,
    };
}

export async function verifyProfileTwoFactor(token: string, input: TwoFactorVerifyInput): Promise<void> {
    const response = await fetch(PROFILE_2FA_VERIFY_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    const data = await parseProfileEnvelope(response);
    if (!response.ok) {
        throw new Error(getResponseError(data, 'Failed to verify 2FA setup.'));
    }
}

export async function disableProfileTwoFactor(token: string, input: TwoFactorVerifyInput): Promise<void> {
    const response = await fetch(PROFILE_2FA_DISABLE_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    const data = await parseProfileEnvelope(response);
    if (!response.ok) {
        throw new Error(getResponseError(data, 'Failed to disable 2FA.'));
    }
}

export async function addProfileFriend(token: string, input: FriendRequestCreateInput, fallback?: ProfileUser): Promise<ProfileUser> {
    const response = await fetch(PROFILE_FRIENDS_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    const data = await parseProfileEnvelope(response);
    if (!response.ok) {
        throw new Error(getResponseError(data, 'Failed to send friend request.'));
    }

    return normalizeUser(data?.user, fallback);
}

export async function removeProfileFriend(token: string, input: FriendUpdateInput, fallback?: ProfileUser): Promise<ProfileUser> {
    const response = await fetch(PROFILE_FRIENDS_ENDPOINT, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    const data = await parseProfileEnvelope(response);
    if (!response.ok) {
        throw new Error(getResponseError(data, 'Failed to remove friend.'));
    }

    return normalizeUser(data?.user, fallback);
}

export async function acceptProfileFriendRequest(token: string, input: FriendUpdateInput, fallback?: ProfileUser): Promise<ProfileUser> {
    const response = await fetch(PROFILE_FRIEND_REQUESTS_ACCEPT_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    const data = await parseProfileEnvelope(response);
    if (!response.ok) {
        throw new Error(getResponseError(data, 'Failed to accept friend request.'));
    }

    return normalizeUser(data?.user, fallback);
}

export async function rejectProfileFriendRequest(token: string, input: FriendUpdateInput, fallback?: ProfileUser): Promise<ProfileUser> {
    const response = await fetch(PROFILE_FRIEND_REQUESTS_ENDPOINT, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    const data = await parseProfileEnvelope(response);
    if (!response.ok) {
        throw new Error(getResponseError(data, 'Failed to reject friend request.'));
    }

    return normalizeUser(data?.user, fallback);
}
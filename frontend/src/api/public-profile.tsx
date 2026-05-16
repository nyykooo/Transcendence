import type { ProfileUser, PublicProfileUser } from '../props/profile/sharedProps';
import { api } from '../configs/api';
import type {
    FriendRequestCreateInput,
    FriendUpdateInput,
    ProfileEnvelope,
    ProfilePayload,
    PublicProfileEnvelope,
    PublicProfilePayload,
} from '../props/profile/apiProps';

const PROFILE_ENDPOINT = api.profile;
const PROFILE_FRIENDS_ENDPOINT = api.profileFriends;

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
        name: payload?.name || fallback?.name || '',
        email: payload?.email || fallback?.email || '',
        avatar: normalizeMediaUrl(payload?.avatar ?? fallback?.avatar ?? null),
        twoFactorEnabled: payload?.twoFactorEnabled ?? payloadWithAliases?.two_factor_enabled ?? fallback?.twoFactorEnabled ?? false,
        friends: (payload?.friends ?? fallback?.friends ?? []).map(normalizeFriend),
        friendRequests: (payload?.friendRequests ?? fallback?.friendRequests ?? []).map(normalizeFriend),
        is_active: payload?.is_active ?? fallback?.is_active ?? true,
    };
}

function normalizePublicUser(payload?: PublicProfilePayload | null, fallback?: PublicProfileUser): PublicProfileUser {
    return {
        name: payload?.name || fallback?.name || '',
        avatar: normalizeMediaUrl(payload?.avatar ?? fallback?.avatar ?? null),
        likedRecipes: (payload?.likedRecipes || fallback?.likedRecipes || []).map(recipe => ({
            ...recipe,
            recipe_name: (recipe as any).name ?? recipe.recipe_name,
        })),
        is_active: payload?.is_active ?? fallback?.is_active ?? true,
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

async function parsePublicProfileEnvelope(response: Response): Promise<PublicProfileEnvelope | null> {
    try {
        return (await response.json()) as PublicProfileEnvelope;
    } catch {
        return null;
    }
}

export async function fetchPublicProfile(token: string, name: string | undefined): Promise<PublicProfileUser> {
    const response = await fetch(`${PROFILE_ENDPOINT}/${name}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await parsePublicProfileEnvelope(response);

    if (!response.ok) {
        throw new Error(getResponseError(data, 'Could not load your profile right now.'));
    }

    return normalizePublicUser(data?.user);
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

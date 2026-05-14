import { useEffect, useState } from 'react';

import { useAuth } from '../../components/AuthProvider';
import {
    addProfileFriend,
    fetchProfile,
    removeProfileFriend,
} from '../../api/profile';
import type { ApiMessage, ProfileUser } from '../../props/profile/sharedProps';

export function usePublicProfile() {
    const { user: authUser, getAuthToken } = useAuth();

    const [profileError, setProfileError] = useState<string | null>(null);
    const [message, setMessage] = useState<ApiMessage | null>(null);

    const [user, setUser] = useState<ProfileUser>({
        name: 'Test User',
        email: '',
        avatar: null,
        friends: [],
        friendRequests: [],
    });
    const [friendName, setFriendName] = useState('');

    useEffect(() => {
        let cancelled = false;

        const loadProfile = async () => {
            const token = getAuthToken();
            if (!token) {
                return;
            }

            setProfileError(null);

            try {
                const hydratedUser = await fetchPublicProfile(token);
                if (cancelled) {
                    return;
                }

                setUser(hydratedUser);
            } catch (error) {
                if (cancelled) {
                    return;
                }

                setProfileError(error instanceof Error ? error.message : 'Could not load your profile right now.');
            }
        };

        loadProfile();

        return () => {
            cancelled = true;
        };
    }, [authUser?.token]);

    const handleAddFriend = async () => {
        const token = getAuthToken();
        if (!token) {
            setMessage({ type: 'error', text: 'You need to be logged in to send friend requests.' });
            return;
        }

        const normalizedName = friendName.trim().toLowerCase();
        if (!normalizedName) {
            setMessage({ type: 'error', text: 'Friend name is required.' });
            return;
        }

        setMessage(null);

        try {
            const nextUser = await addProfileFriend(token, { name: normalizedName }, user);
            setUser(nextUser);
            setFriendName('');
            setMessage({ type: 'success', text: 'Friend request sent.' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Could not send friend request.',
            });
        }
    };

    const handleRemoveFriend = async (email: string) => {
        const token = getAuthToken();
        if (!token) {
            setMessage({ type: 'error', text: 'You need to be logged in to remove friends.' });
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail) {
            setMessage({ type: 'error', text: 'Friend email is required.' });
            return;
        }

        setMessage(null);

        try {
            const nextUser = await removeProfileFriend(token, { email: normalizedEmail }, user);
            setUser(nextUser);
            setMessage({ type: 'success', text: 'Friend removed successfully.' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Could not remove friend.',
            });
        }
    };

    return {
        user,
        profileError,
        message,
        friendEmail: friendName,
        handleAddFriend,
        handleRemoveFriend,
    };
}
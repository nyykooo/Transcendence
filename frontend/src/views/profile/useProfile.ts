import { useEffect, useState, type ChangeEvent } from 'react';

import { useAuth } from '../../components/AuthProvider';
import {
    addProfileFriend,
    acceptProfileFriendRequest,
    deleteProfileAvatar,
    disableProfileTwoFactor,
    fetchProfile,
    rejectProfileFriendRequest,
    removeProfileFriend,
    setupProfileTwoFactor,
    updatePassword,
    updateProfile,
    uploadProfileAvatar,
    verifyProfileTwoFactor,
} from '../../api/profile';
import type { ApiMessage, PasswordForm, ProfileForm, ProfileUser, TwoFactorSetupPayload } from '../../props/profile/sharedProps';

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const;
const DEFAULT_AVATAR_SUFFIX = '/uploads/avatars/test.webp';

function isCustomAvatar(avatar: string | null): boolean {
    if (!avatar) {
        return false;
    }

    return !avatar.endsWith(DEFAULT_AVATAR_SUFFIX);
}

export function useProfile() {
    const { user: authUser, getAuthToken } = useAuth();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [twoFactorLoading, setTwoFactorLoading] = useState(false);
    const [friendsLoading, setFriendsLoading] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [message, setMessage] = useState<ApiMessage | null>(null);

    const [user, setUser] = useState<ProfileUser>({
        name: 'Test User',
        email: '',
        avatar: null,
        friends: [],
        friendRequests: [],
    });
    const [profileForm, setProfileForm] = useState<ProfileForm>({ name: '', email: '' });
    const [passwordForm, setPasswordForm] = useState<PasswordForm>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [twoFactorSetup, setTwoFactorSetup] = useState<TwoFactorSetupPayload | null>(null);
    const [friendName, setFriendName] = useState('');

    const handleProfileFieldChange =
        (field: keyof ProfileForm) => (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setProfileForm((prev: ProfileForm) => ({ ...prev, [field]: value }));
        };

    const handlePasswordFieldChange =
        (field: keyof PasswordForm) => (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setPasswordForm((prev: PasswordForm) => ({ ...prev, [field]: value }));
        };

    const handleTwoFactorCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTwoFactorCode(event.target.value);
    };

    const handleFriendEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFriendName(event.target.value);
    };

    useEffect(() => {
        if (!preview) {
            return;
        }

        return () => URL.revokeObjectURL(preview);
    }, [preview]);

    useEffect(() => {
        let cancelled = false;

        const loadProfile = async () => {
            const token = getAuthToken();
            if (!token) {
                return;
            }

            setProfileError(null);

            try {
                const hydratedUser = await fetchProfile(token);
                if (cancelled) {
                    return;
                }

                setUser(hydratedUser);
                setProfileForm({
                    name: hydratedUser.name,
                    email: hydratedUser.email,
                });
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

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        if (file.size > MAX_AVATAR_SIZE_BYTES) {
            setMessage({ type: 'error', text: 'File size must be less than 5MB.' });
            return;
        }

        const isAllowedType = ALLOWED_AVATAR_TYPES.includes(file.type as (typeof ALLOWED_AVATAR_TYPES)[number]);
        if (!isAllowedType) {
            setMessage({ type: 'error', text: 'Only JPEG, PNG, GIF, or WEBP images are allowed.' });
            return;
        }

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        setMessage(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage({ type: 'error', text: 'Please select a file first.' });
            return;
        }

        const token = getAuthToken();
        if (!token) {
            setMessage({ type: 'error', text: 'You need to be logged in to upload an avatar.' });
            return;
        }

        setAvatarLoading(true);
        setMessage(null);

        try {
            const nextUser = await uploadProfileAvatar(token, selectedFile, user);
            setUser(nextUser);
            setSelectedFile(null);

            if (preview) {
                URL.revokeObjectURL(preview);
            }

            setPreview(null);
            setMessage({ type: 'success', text: 'Image uploaded successfully!' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Error uploading image. Please try again.',
            });
        } finally {
            setAvatarLoading(false);
        }
    };

    const handleAvatarDelete = async () => {
        const token = getAuthToken();
        if (!token) {
            setMessage({ type: 'error', text: 'You need to be logged in to delete an avatar.' });
            return;
        }

        if (!isCustomAvatar(user.avatar)) {
            setMessage({ type: 'error', text: 'No custom avatar to delete.' });
            return;
        }

        setAvatarLoading(true);
        setMessage(null);

        try {
            const nextUser = await deleteProfileAvatar(token, user);
            setUser(nextUser);
            setSelectedFile(null);

            if (preview) {
                URL.revokeObjectURL(preview);
            }

            setPreview(null);
            setMessage({ type: 'success', text: 'Avatar deleted successfully.' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Error deleting avatar. Please try again.',
            });
        } finally {
            setAvatarLoading(false);
        }
    };

    const handleProfileUpdate = async () => {
        const token = getAuthToken();
        if (!token) {
            setMessage({ type: 'error', text: 'You need to be logged in to update your profile.' });
            return;
        }

        const trimmedName = profileForm.name.trim();
        const trimmedEmail = profileForm.email.trim().toLowerCase();

        if (!trimmedName || !trimmedEmail) {
            setMessage({ type: 'error', text: 'Name and email are required.' });
            return;
        }

        setProfileLoading(true);
        setMessage(null);

        try {
            const nextUser = await updateProfile(token, { name: trimmedName, email: trimmedEmail }, user);
            setUser(nextUser);
            setProfileForm({ name: nextUser.name, email: nextUser.email });
            setMessage({ type: 'success', text: 'Profile updated successfully.' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Error updating profile. Please try again.',
            });
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        const token = getAuthToken();
        if (!token) {
            setMessage({ type: 'error', text: 'You need to be logged in to change password.' });
            return;
        }

        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'Please fill all password fields.' });
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setMessage({ type: 'error', text: 'New password must be at least 8 characters.' });
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'New password and confirmation do not match.' });
            return;
        }

        setPasswordLoading(true);
        setMessage(null);

        try {
            await updatePassword(token, {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });

            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setMessage({ type: 'success', text: 'Password changed successfully.' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Error changing password. Please try again.',
            });
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleTwoFactorSetup = async () => {
        const token = getAuthToken();
        if (!token) {
            setMessage({ type: 'error', text: 'You need to be logged in to configure 2FA.' });
            return;
        }

        setTwoFactorLoading(true);
        setMessage(null);

        try {
            const payload = await setupProfileTwoFactor(token);
            setTwoFactorSetup(payload);
            setMessage({ type: 'success', text: '2FA setup started. Scan the QR code and verify below.' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Could not start 2FA setup.',
            });
        } finally {
            setTwoFactorLoading(false);
        }
    };

    const handleTwoFactorVerify = async () => {
        const token = getAuthToken();
        if (!token) {
            setMessage({ type: 'error', text: 'You need to be logged in to verify 2FA.' });
            return;
        }

        const normalizedCode = twoFactorCode.trim();
        if (!normalizedCode) {
            setMessage({ type: 'error', text: 'Enter your authenticator code first.' });
            return;
        }

        setTwoFactorLoading(true);
        setMessage(null);

        try {
            await verifyProfileTwoFactor(token, { token: normalizedCode });
            setUser((prev) => ({ ...prev, twoFactorEnabled: true }));
            setTwoFactorCode('');
            setTwoFactorSetup(null);
            setMessage({ type: 'success', text: '2FA enabled successfully.' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Could not verify 2FA code.',
            });
        } finally {
            setTwoFactorLoading(false);
        }
    };

    const handleTwoFactorDisable = async () => {
        const token = getAuthToken();
        if (!token) {
            setMessage({ type: 'error', text: 'You need to be logged in to disable 2FA.' });
            return;
        }

        const normalizedCode = twoFactorCode.trim();
        if (!normalizedCode) {
            setMessage({ type: 'error', text: 'Enter your authenticator code to disable 2FA.' });
            return;
        }

        setTwoFactorLoading(true);
        setMessage(null);

        try {
            await disableProfileTwoFactor(token, { token: normalizedCode });
            setUser((prev) => ({ ...prev, twoFactorEnabled: false }));
            setTwoFactorCode('');
            setTwoFactorSetup(null);
            setMessage({ type: 'success', text: '2FA disabled successfully.' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Could not disable 2FA.',
            });
        } finally {
            setTwoFactorLoading(false);
        }
    };

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

        setFriendsLoading(true);
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
        } finally {
            setFriendsLoading(false);
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

        setFriendsLoading(true);
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
        } finally {
            setFriendsLoading(false);
        }
    };

    const handleAcceptFriendRequest = async (email: string) => {
        const token = getAuthToken();
        if (!token) {
            setMessage({ type: 'error', text: 'You need to be logged in to accept friend requests.' });
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail) {
            setMessage({ type: 'error', text: 'Requester email is required.' });
            return;
        }

        setFriendsLoading(true);
        setMessage(null);

        try {
            const nextUser = await acceptProfileFriendRequest(token, { email: normalizedEmail }, user);
            setUser(nextUser);
            setMessage({ type: 'success', text: 'Friend request accepted.' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Could not accept friend request.',
            });
        } finally {
            setFriendsLoading(false);
        }
    };

    const handleRejectFriendRequest = async (email: string) => {
        const token = getAuthToken();
        if (!token) {
            setMessage({ type: 'error', text: 'You need to be logged in to reject friend requests.' });
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail) {
            setMessage({ type: 'error', text: 'Requester email is required.' });
            return;
        }

        setFriendsLoading(true);
        setMessage(null);

        try {
            const nextUser = await rejectProfileFriendRequest(token, { email: normalizedEmail }, user);
            setUser(nextUser);
            setMessage({ type: 'success', text: 'Friend request rejected.' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Could not reject friend request.',
            });
        } finally {
            setFriendsLoading(false);
        }
    };

    return {
        user,
        selectedFile,
        preview,
        avatarLoading,
        profileLoading,
        passwordLoading,
        twoFactorLoading,
        friendsLoading,
        profileError,
        message,
        hasCustomAvatar: isCustomAvatar(user.avatar),
        profileForm,
        passwordForm,
        twoFactorCode,
        twoFactorSetup,
        friendEmail: friendName,
        handleFileSelect,
        handleUpload,
        handleAvatarDelete,
        handleProfileUpdate,
        handlePasswordUpdate,
        handleTwoFactorSetup,
        handleTwoFactorVerify,
        handleTwoFactorDisable,
        handleAddFriend,
        handleRemoveFriend,
        handleAcceptFriendRequest,
        handleRejectFriendRequest,
        handleProfileFieldChange,
        handlePasswordFieldChange,
        handleTwoFactorCodeChange,
        handleFriendEmailChange,
    };
}
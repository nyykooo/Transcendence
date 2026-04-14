import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState, type ChangeEvent } from 'react';
import { useAuth } from '../../components/AuthProvider';

type ProfileUser = {
    name: string;
    email: string;
    avatar: string | null;
};

type ApiMessage = { type: 'success' | 'error'; text: string };
type ProfileForm = { name: string; email: string };
type PasswordForm = { currentPassword: string; newPassword: string; confirmPassword: string };

export default function Profile() {
    const { user: authUser } = useAuth();

    const getAuthToken = (): string | null => {
        if (authUser?.token) {
            return authUser.token;
        }
        try {
            const raw = localStorage.getItem('auth');
            if (!raw) {
                return null;
            }
            const parsed = JSON.parse(raw);
            return typeof parsed?.token === 'string' && parsed.token.length > 0 ? parsed.token : null;
        } catch {
            return null;
        }
    };

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [message, setMessage] = useState<ApiMessage | null>(null);

    const [user, setUser] = useState<ProfileUser>({
        name: 'Test User',
        email: '',
        avatar: null,
    });
    const [profileForm, setProfileForm] = useState<ProfileForm>({ name: '', email: '' });
    const [passwordForm, setPasswordForm] = useState<PasswordForm>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

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

    useEffect(() => {
        if (!preview) {
            return;
        }
        return () => URL.revokeObjectURL(preview);
    }, [preview]);

    useEffect(() => {
        const loadProfile = async () => {
            const token = getAuthToken();
            if (!token) {
                return;
            }

            setProfileError(null);

            try {
                const response = await fetch('/api/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    setProfileError('Could not load your profile right now.');
                    return;
                }

                const data = await response.json();
                if (data?.user) {
                    const hydratedUser = {
                        name: data.user.name || 'Test User',
                        email: data.user.email || '',
                        avatar: data.user.avatar || null,
                    };
                    setUser(hydratedUser);
                    setProfileForm({
                        name: hydratedUser.name,
                        email: hydratedUser.email,
                    });
                }
            } catch {
                setProfileError('Could not load your profile right now.');
            }
        };

        loadProfile();
    }, [authUser?.token]);

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file size (5MB limit from your backend)
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'File size must be less than 5MB' });
                return;
            }
            
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setMessage({ type: 'error', text: 'Only JPEG, PNG, GIF, or WEBP images are allowed' });
                return;
            }

            if (preview) {
                URL.revokeObjectURL(preview);
            }
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setMessage(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage({ type: 'error', text: 'Please select a file first' });
            return;
        }

        const formData = new FormData();
        formData.append('avatar', selectedFile);

        setAvatarLoading(true);
        setMessage(null);
        
        try {
            const token = getAuthToken();
            if (!token) {
                setMessage({ type: 'error', text: 'You need to be logged in to upload an avatar' });
                return;
            }

            const response = await fetch('/api/profile/avatar', {
                method: 'POST',
                body: formData,
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            
            if (response.ok) {
                setMessage({ type: 'success', text: 'Image uploaded successfully!' });
                const nextAvatar = data.avatar || data.user?.avatar || user.avatar;
                setUser((prev: ProfileUser) => ({ ...prev, avatar: nextAvatar }));
                setSelectedFile(null);
                if (preview) {
                    URL.revokeObjectURL(preview);
                }
                setPreview(null);
            } else {
                setMessage({ type: 'error', text: data.error || data.message || 'Upload failed' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Error uploading image. Please try again.' });
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
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: trimmedName, email: trimmedEmail }),
            });

            const data = await response.json();
            if (!response.ok) {
                setMessage({ type: 'error', text: data.error || data.message || 'Profile update failed.' });
                return;
            }

            const updated = data.user || {};
            const nextUser = {
                name: updated.name || trimmedName,
                email: updated.email || trimmedEmail,
                avatar: updated.avatar ?? user.avatar,
            };
            setUser(nextUser);
            setProfileForm({ name: nextUser.name, email: nextUser.email });
            setMessage({ type: 'success', text: 'Profile updated successfully.' });
        } catch {
            setMessage({ type: 'error', text: 'Error updating profile. Please try again.' });
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
            const response = await fetch('/api/profile/password', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                setMessage({ type: 'error', text: data.error || data.message || 'Password update failed.' });
                return;
            }

            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setMessage({ type: 'success', text: 'Password changed successfully.' });
        } catch {
            setMessage({ type: 'error', text: 'Error changing password. Please try again.' });
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100%',
            width: '100%',
            p: { xs: 2, md: 4 },
            background: 'radial-gradient(circle at top left, rgba(25, 118, 210, 0.12), transparent 28%), linear-gradient(180deg, #f6f9fc 0%, #ffffff 55%, #f8fafc 100%)',
        }}>
            <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
                <Paper
                    elevation={0}
                    sx={{
                        mb: 3,
                        p: { xs: 2.5, md: 4 },
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, rgba(25,118,210,0.96) 0%, rgba(63,81,181,0.96) 100%)',
                        color: 'white',
                        boxShadow: '0 18px 50px rgba(25, 118, 210, 0.22)',
                    }}
                >
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
                        <Box sx={{ maxWidth: 640 }}>
                            <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.85 }}>
                                PROFILE
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 700, mt: 0.5, mb: 1 }}>
                                Account Settings
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.92, maxWidth: 560 }}>
                                Update your avatar, name, email, and password in one polished place.
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, bgcolor: 'rgba(255,255,255,0.12)', px: 2.5, py: 2, borderRadius: 3, backdropFilter: 'blur(10px)' }}>
                            <Avatar
                                src={preview || user.avatar || undefined}
                                sx={{ width: 72, height: 72, border: '3px solid rgba(255,255,255,0.75)' }}
                            >
                                {user.name.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    {user.name}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    {user.email || 'No email loaded yet'}
                                </Typography>
                            </Box>
                        </Box>
                    </Stack>
                </Paper>

                <Card sx={{ width: '100%', borderRadius: 4, boxShadow: '0 18px 55px rgba(15, 23, 42, 0.08)' }}>
                    <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Keep your profile up to date and secure.
                        </Typography>

                        {profileError && (
                            <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                                {profileError}
                            </Alert>
                        )}

                        {message && (
                            <Alert severity={message.type} sx={{ mb: 2, borderRadius: 2 }}>
                                {message.text}
                            </Alert>
                        )}

                        <Stack spacing={3}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: { xs: 2, md: 3 },
                                    borderRadius: 3,
                                    borderColor: 'rgba(15, 23, 42, 0.08)',
                                    background: 'linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)',
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Avatar</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
                                    <Avatar
                                        src={preview || user.avatar || undefined}
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            border: '4px solid #fff',
                                            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.16)',
                                        }}
                                    >
                                        {user.name.charAt(0)}
                                    </Avatar>
                                    <Box sx={{ flex: 1, minWidth: 240 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Use a clear, square image for the best result.
                                        </Typography>
                                        {selectedFile && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                                            </Typography>
                                        )}
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                                            <Button variant="outlined" component="label" disabled={avatarLoading} sx={{ borderRadius: 999 }}>
                                                Choose Image
                                                <input
                                                    type="file"
                                                    hidden
                                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                                    onChange={handleFileSelect}
                                                />
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={handleUpload}
                                                disabled={!selectedFile || avatarLoading}
                                                sx={{ borderRadius: 999, px: 3 }}
                                            >
                                                {avatarLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Save Avatar'}
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Box>
                            </Paper>

                            <Divider />

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: { xs: 2, md: 3 },
                                    borderRadius: 3,
                                    borderColor: 'rgba(15, 23, 42, 0.08)',
                                    background: 'linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)',
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Profile Information</Typography>
                                <Stack spacing={2.25}>
                                    <TextField
                                        label="Display Name"
                                        value={profileForm.name}
                                        onChange={handleProfileFieldChange('name')}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Email"
                                        type="email"
                                        value={profileForm.email}
                                        onChange={handleProfileFieldChange('email')}
                                        fullWidth
                                    />
                                    <Box>
                                        <Button
                                            variant="contained"
                                            onClick={handleProfileUpdate}
                                            disabled={profileLoading}
                                            sx={{ borderRadius: 999, px: 3, minWidth: 160 }}
                                        >
                                            {profileLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Save Profile'}
                                        </Button>
                                    </Box>
                                </Stack>
                            </Paper>

                            <Divider />

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: { xs: 2, md: 3 },
                                    borderRadius: 3,
                                    borderColor: 'rgba(15, 23, 42, 0.08)',
                                    background: 'linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)',
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Change Password</Typography>
                                <Stack spacing={2.25}>
                                    <TextField
                                        label="Current Password"
                                        type="password"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordFieldChange('currentPassword')}
                                        fullWidth
                                    />
                                    <TextField
                                        label="New Password"
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordFieldChange('newPassword')}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Confirm New Password"
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordFieldChange('confirmPassword')}
                                        fullWidth
                                    />
                                    <Box>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handlePasswordUpdate}
                                            disabled={passwordLoading}
                                            sx={{ borderRadius: 999, px: 3, minWidth: 180 }}
                                        >
                                            {passwordLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Update Password'}
                                        </Button>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
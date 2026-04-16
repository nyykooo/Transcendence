import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import type {
    ProfileActionButtonProps,
    ProfileAvatarPanelProps,
    ProfileFieldProps,
    ProfileFormStackProps,
    ProfileHeroCardProps,
    ProfilePageShellProps,
    ProfileSectionCardProps,
    ProfileSectionNoteProps,
    ProfileStatusBannerProps,
    ProfileSummaryCardProps,
} from '../../props/profile/componentProps';

export function ProfilePageShell({ children }: ProfilePageShellProps) {
    return (
        <Box
            sx={{
                minHeight: '100%',
                width: '100%',
                p: { xs: 2, md: 4 },
                background:
                    'radial-gradient(circle at top left, rgba(25, 118, 210, 0.12), transparent 28%), linear-gradient(180deg, #f6f9fc 0%, #ffffff 55%, #f8fafc 100%)',
            }}
        >
            <Box sx={{ maxWidth: 1100, mx: 'auto' }}>{children}</Box>
        </Box>
    );
}

export function ProfileHeroCard({ user, previewSrc }: ProfileHeroCardProps) {
    return (
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
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={3}
                alignItems={{ xs: 'flex-start', md: 'center' }}
                justifyContent="space-between"
            >
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

                <ProfileSummaryCard user={user} previewSrc={previewSrc} />
            </Stack>
        </Paper>
    );
}

export function ProfileSummaryCard({ user, previewSrc }: ProfileSummaryCardProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2.5,
                bgcolor: 'rgba(255,255,255,0.12)',
                px: 2.5,
                py: 2,
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
            }}
        >
            <Avatar
                src={previewSrc || user.avatar || undefined}
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
    );
}

export function ProfileStatusBanner({ profileError, message }: ProfileStatusBannerProps) {
    return (
        <Stack spacing={1.5} sx={{ mb: 2 }}>
            {profileError && (
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                    {profileError}
                </Alert>
            )}

            {message && (
                <Alert severity={message.type} sx={{ borderRadius: 2 }}>
                    {message.text}
                </Alert>
            )}
        </Stack>
    );
}

export function ProfileSectionCard({ title, description, children }: ProfileSectionCardProps) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                borderColor: 'rgba(15, 23, 42, 0.08)',
                background: 'linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)',
            }}
        >
            <Typography variant="h6" sx={{ mb: description ? 1 : 2, fontWeight: 700 }}>
                {title}
            </Typography>

            {description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {description}
                </Typography>
            )}

            {children}
        </Paper>
    );
}

export function ProfileAvatarPanel({
    user,
    previewSrc,
    selectedFile,
    loading,
    onFileSelect,
    onUpload,
}: ProfileAvatarPanelProps) {
    return (
        <ProfileSectionCard title="Avatar" description="Use a clear, square image for the best result.">
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
                <Avatar
                    src={previewSrc || user.avatar || undefined}
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
                    <ProfileSectionNote>
                        Keep the image square and easy to read at a small size.
                    </ProfileSectionNote>

                    {selectedFile && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                        </Typography>
                    )}

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                        <Button variant="outlined" component="label" disabled={loading} sx={{ borderRadius: 999 }}>
                            Choose Image
                            <input
                                type="file"
                                hidden
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                onChange={onFileSelect}
                            />
                        </Button>

                        <ProfileActionButton loading={loading} onClick={onUpload} minWidth={160}>
                            Save Avatar
                        </ProfileActionButton>
                    </Stack>
                </Box>
            </Box>
        </ProfileSectionCard>
    );
}

export function ProfileField({ label, value, onChange, type = 'text' }: ProfileFieldProps) {
    return <TextField label={label} type={type} value={value} onChange={onChange} fullWidth />;
}

export function ProfileActionButton({
    children,
    loading,
    onClick,
    color = 'primary',
    variant = 'contained',
    minWidth,
}: ProfileActionButtonProps) {
    return (
        <Button
            variant={variant}
            color={color}
            onClick={onClick}
            disabled={loading}
            sx={{ borderRadius: 999, px: 3, minWidth }}
        >
            {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : children}
        </Button>
    );
}

export function ProfileFormStack({ children }: ProfileFormStackProps) {
    return <Stack spacing={2.25}>{children}</Stack>;
}

export function ProfileSectionNote({ children }: ProfileSectionNoteProps) {
    return (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {children}
        </Typography>
    );
}
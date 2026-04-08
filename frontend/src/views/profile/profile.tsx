import { Box, Avatar, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { useEffect, useState, type ChangeEvent } from 'react';
import { useAuth } from '../../components/AuthProvider';

type ProfileUser = {
    name: string;
    avatar: string | null;
};

export default function Profile() {
    const { user: authUser } = useAuth();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    
    // Current user data - replace with actual user data from your auth
    const [user, setUser] = useState<ProfileUser>({
        name: 'Test User',
        avatar: null as string | null
    });

    useEffect(() => {
        const loadProfile = async () => {
            const token = authUser?.token;
            if (!token) {
                return;
            }

            try {
                const response = await fetch('/api/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    return;
                }

                const data = await response.json();
                if (data?.user) {
                    setUser({
                        name: data.user.name || 'Test User',
                        avatar: data.user.avatar || null,
                    });
                }
            } catch {
                // ignore profile hydration errors
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
        // Add user ID if your backend expects it
        // formData.append('userId', userId);

        setLoading(true);
        
        try {
            const token = authUser?.token;
            if (!token) {
                setMessage({ type: 'error', text: 'You need to be logged in to upload an avatar' });
                setLoading(false);
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
                setUser((prev: ProfileUser) => ({ ...prev, avatar: data.avatar || data.user?.avatar || prev.avatar }));
                setSelectedFile(null);
                // Don't revoke the preview immediately as it's still being used
                // setTimeout(() => URL.revokeObjectURL(preview!), 1000);
            } else {
                setMessage({ type: 'error', text: data.error || data.message || 'Upload failed' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error uploading image. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ 
            height: '100%', 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 3,
            p: 3
        }}>
            <Typography variant="h4">Profile - Test Image Upload</Typography>
            
            {/* Current Avatar */}
            <Avatar 
                src={user.avatar || preview || undefined} 
                sx={{ width: 150, height: 150 }}
            >
                {user.name.charAt(0)}
            </Avatar>

            {/* Upload Controls */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    component="label"
                    disabled={loading}
                >
                    Select Image
                    <input
                        type="file"
                        hidden
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleFileSelect}
                    />
                </Button>
                
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={!selectedFile || loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Upload'}
                </Button>
            </Box>

            {/* Status Message */}
            {message && (
                <Alert severity={message.type} sx={{ width: '100%', maxWidth: 400 }}>
                    {message.text}
                </Alert>
            )}

            {/* Debug Info */}
            {selectedFile && (
                <Typography variant="body2" color="textSecondary">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </Typography>
            )}
        </Box>
    );
}
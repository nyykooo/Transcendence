import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    Typography,
    Alert,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAdminFiles, deleteAdminFile, getFilePreview } from '../api/fileManagement';
import type { AdminFileInfo } from '../props/fileManagement/fileProps';

export default function AdminFileManagement() {
    const [files, setFiles] = useState<AdminFileInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalSize, setTotalSize] = useState(0);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState<AdminFileInfo | null>(null);
    const [previewData, setPreviewData] = useState<string | Blob | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const loadFiles = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await getAdminFiles();
            setFiles(response.files);
            setTotalSize(response.storageUsed);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load files');
            setFiles([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFiles();
    }, []);

    const handlePreview = async (file: AdminFileInfo) => {
        try {
            setPreviewLoading(true);
            setPreviewFile(file);

            if (file.type === 'image' && file.previewUrl) {
                setPreviewData(file.previewUrl);
            } else {
                const blob = await getFilePreview(file.filename);
                setPreviewData(blob);
            }

            setPreviewOpen(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load preview');
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;

        try {
            setDeleting(true);
            setError(null);
            await deleteAdminFile(deleteConfirm);
            setFiles(files.filter(f => f.filename !== deleteConfirm));
            setDeleteConfirm(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete file');
        } finally {
            setDeleting(false);
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        // <Box sx={{ p: 3, width: '90vw' }}>
        <Box sx={{p: 3, width: '90vw', display: 'flex', flexDirection: 'column', gap: 2}}>

            <Typography variant="h5" color='secondary' sx={{ mb: 3, fontWeight: 'bold', alignSelf: 'center' }}>
                File Management
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Storage Info */}
            <Card sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="body2" color="textSecondary">
                            Total Files
                        </Typography>
                        <Typography variant="h6">{files.length}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="textSecondary">
                            Storage Used
                        </Typography>
                        <Typography variant="h6">{formatBytes(totalSize)}</Typography>
                    </Box>
                </Box>
            </Card>

            {/* Files Table */}
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : files.length === 0 ? (
                <Alert severity="info">No files found</Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Filename</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                    Size
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Uploaded</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {files.map((file) => (
                                <TableRow key={file.filename} hover>
                                    <TableCell>{file.filename}</TableCell>
                                    <TableCell align="right">{formatBytes(file.size)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={file.type}
                                            size="small"
                                            color={
                                                file.type === 'image'
                                                    ? 'primary'
                                                    : file.type === 'data'
                                                      ? 'secondary'
                                                      : 'default'
                                            }
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>{formatDate(file.uploadedAt)}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Preview">
                                            <IconButton
                                                size="small"
                                                onClick={() => handlePreview(file)}
                                                color="primary"
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {file.canDelete && (
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setDeleteConfirm(file.filename)}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Preview Dialog */}
            <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>File Preview</DialogTitle>
                <DialogContent>
                    {previewLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : previewFile?.type === 'image' ? (
                        <Box
                            sx={{
                                mt: 2,
                                textAlign: 'center',
                                maxHeight: '500px',
                                overflow: 'auto',
                            }}
                        >
                            <img
                                src={previewFile.previewUrl || ''}
                                alt="preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '500px',
                                    borderRadius: '8px',
                                }}
                            />
                        </Box>
                    ) : (
                        <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                            <pre
                                style={{
                                    maxHeight: '500px',
                                    overflow: 'auto',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    fontSize: '12px',
                                }}
                            >
                                {typeof previewData === 'string'
                                    ? previewData
                                    : previewData instanceof Blob
                                      ? '(Binary data)'
                                      : 'Loading...'}
                            </pre>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPreviewOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)}>
                <DialogTitle>Delete File</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete <strong>{deleteConfirm}</strong>? This action cannot be
                        undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        disabled={deleting}
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

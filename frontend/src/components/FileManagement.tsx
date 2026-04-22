import { useState, useCallback } from 'react';
import React from 'react';
import {
    Box,
    Button,
    Card,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

import { uploadFile, deleteFile, importRecipes, listFiles } from '../api/fileManagement';
import type { FileUploadProgress, RecipeImportResponse, FileInfo, RecipeImportResult } from '../props/fileManagement/fileProps';

export default function FileManagement() {
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState<FileUploadProgress | null>(null);
    const [previewData, setPreviewData] = useState<RecipeImportResult[] | null>(null);
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [importResult, setImportResult] = useState<RecipeImportResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Load files on mount
    React.useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        try {
            setLoading(true);
            const response = await listFiles();
            setFiles(response.files);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load files');
        } finally {
            setLoading(false);
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            await handleFileUpload(files[0]);
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    };

    const handleFileUpload = async (file: File) => {
        const validTypes = ['text/csv', 'application/json', 'application/vnd.ms-excel', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        if (!validTypes.includes(file.type)) {
            setError('Invalid file type. Supported: CSV, JSON, images (JPEG, PNG, GIF, WebP)');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('File too large. Maximum size: 5MB');
            return;
        }

        try {
            setUploading(true);
            setError(null);
            setProgress(null);

            // If it's a recipe document, preview first
            if (file.type === 'text/csv' || file.type === 'application/json') {
                await previewRecipeFile(file);
            } else {
                // For images, just upload directly
                await uploadFile(file, (prog) => setProgress(prog));
                await loadFiles();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
            setProgress(null);
        }
    };

    const previewRecipeFile = async (file: File) => {
        try {
            const content = await file.text();
            let recipes: RecipeImportResult[] = [];

            if (file.type === 'text/csv') {
                // Simple CSV parsing
                const lines = content.split('\n').filter(line => line.trim());
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                recipes = lines.slice(1).map(line => {
                    const values = line.split(',').map(v => v.trim());
                    const recipe: any = {};
                    headers.forEach((h, i) => {
                        recipe[h] = values[i];
                    });
                    return recipe;
                });
            } else {
                // JSON parsing
                recipes = JSON.parse(content);
                if (!Array.isArray(recipes)) {
                    recipes = [recipes];
                }
            }

            setPreviewData(recipes);
            setPreviewFile(file);
            setShowPreview(true);
        } catch (err) {
            setError('Failed to parse file: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const confirmImport = async () => {
        if (!previewFile) return;
        try {
            setUploading(true);
            setError(null);
            const result = await importRecipes(previewFile, (prog) => setProgress(prog));
            setImportResult(result);
            await loadFiles();
            setShowPreview(false);
            setPreviewData(null);
            setPreviewFile(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Import failed');
        } finally {
            setUploading(false);
            setProgress(null);
        }
    };

    const handleDelete = async (filename: string) => {
        try {
            await deleteFile(filename);
            await loadFiles();
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete file');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                📁 File Management
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {importResult && (
                <Alert severity={importResult.stats.failed === 0 ? 'success' : 'warning'} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {importResult.message}
                    </Typography>
                    <Typography variant="body2">
                        Imported: {importResult.stats.imported} | Failed: {importResult.stats.failed} | Total: {importResult.stats.total}
                    </Typography>
                    {importResult.failures.invalid.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="caption">Failed entries:</Typography>
                            {importResult.failures.invalid.map((fail, i) => (
                                <Typography key={i} variant="caption" display="block" sx={{ ml: 2 }}>
                                    • {fail.recipe}: {fail.errors.join(', ')}
                                </Typography>
                            ))}
                        </Box>
                    )}
                </Alert>
            )}

            {/* Upload Area */}
            <Card
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                sx={{
                    p: 3,
                    textAlign: 'center',
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                        borderColor: '#1976d2',
                        backgroundColor: '#f5f5f5',
                    },
                    mb: 3,
                }}
            >
                <input
                    type="file"
                    id="file-input"
                    hidden
                    onChange={handleFileInput}
                    accept=".csv,.json,.jpg,.jpeg,.png,.gif,.webp"
                    disabled={uploading}
                />
                <label htmlFor="file-input" style={{ cursor: 'pointer', width: '100%' }}>
                    <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                    <Typography variant="h6">
                        Drag & drop files here or click to select
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        Supported: CSV, JSON (for recipes), JPEG, PNG, GIF, WebP (max 5MB)
                    </Typography>
                </label>
            </Card>

            {/* Upload Progress */}
            {progress && (
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        <Typography variant="body2">
                            Uploading: {Math.round(progress.percentage)}%
                        </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={progress.percentage} />
                </Box>
            )}

            {/* Preview Dialog */}
            <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    Preview Recipe Data
                </DialogTitle>
                <DialogContent>
                    {previewData && previewData.length > 0 && (
                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Ingredients</TableCell>
                                        <TableCell>Diet</TableCell>
                                        <TableCell>Cost</TableCell>
                                        <TableCell>Portions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {previewData.slice(0, 5).map((recipe, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{recipe.name}</TableCell>
                                            <TableCell>
                                                {Array.isArray(recipe.ingredients)
                                                    ? recipe.ingredients.map((ing: any) => ing.name || ing).join(', ')
                                                    : String(recipe.ingredients)}
                                            </TableCell>
                                            <TableCell>{recipe.diet}</TableCell>
                                            <TableCell>{recipe.cost || '-'}</TableCell>
                                            <TableCell>{recipe.portions || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                    {previewData && previewData.length > 5 && (
                        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                            ... and {previewData.length - 5} more recipes
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowPreview(false)}>Cancel</Button>
                    <Button
                        onClick={confirmImport}
                        variant="contained"
                        disabled={uploading}
                    >
                        {uploading ? <CircularProgress size={20} /> : 'Import'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Files List */}
            <Typography variant="h6" sx={{ mb: 2 }}>
                📂 Recent Files
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : files.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                    No files uploaded yet
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell>Filename</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Size</TableCell>
                                <TableCell>Uploaded</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {files.map((file) => (
                                <TableRow key={file.filename}>
                                    <TableCell>{file.filename}</TableCell>
                                    <TableCell>
                                        {file.type === 'csv' ? '📄 CSV' : file.type === 'json' ? '📋 JSON' : '🖼️ Image'}
                                    </TableCell>
                                    <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
                                    <TableCell>
                                        {new Date(file.uploadedAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDelete(file.filename)}
                                            color="error"
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

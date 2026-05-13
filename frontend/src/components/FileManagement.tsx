import { useState, useCallback } from 'react';
import {
    Box,
    Card,
    LinearProgress,
    Typography,
    Alert,
    CircularProgress,
    Button,
    List,
    ListItem,
    ListItemText,
    Chip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

import { uploadFile, importRecipes, uploadRecipeImage, deleteRecipeImage } from '../api/fileManagement';
import type { FileUploadProgress, RecipeImportResponse, RecipeImportResult } from '../props/fileManagement/fileProps';
import CSVRecipePreview from './CSVRecipePreview';

const MIN_PROGRESS_VISIBLE_MS = 1000;

function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function FileManagement() {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState<FileUploadProgress | null>(null);
    const [previewData, setPreviewData] = useState<RecipeImportResult[] | null>(null);
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [importResult, setImportResult] = useState<RecipeImportResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [imageUploadLoading, setImageUploadLoading] = useState(false);
    const [imageDeleteLoading, setImageDeleteLoading] = useState<number | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const files = (e.dataTransfer.files);
        if (files.length > 0) {
            await handleFileUpload(files);
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileUpload(e.target.files);
            
        }
    };

    const handleFileUpload = async (file: FileList) => {
        const uploadStart = Date.now();
        const validTypes = ['text/csv', 'application/json', 'application/vnd.ms-excel', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        for (var i = 0; i < file.length; i++)
        {
            if (!validTypes.includes(file[i].type)) {
                setError('Invalid file type. Supported: CSV, JSON, images (JPEG, PNG, GIF, WebP)');
                return;
            }
            if (file[i].size > 5 * 1024 * 1024) {
                setError('File too large. Maximum size: 5MB');
                return;
            }
            try {
                setUploading(true);
                setError(null);
                setProgress(null);
    
                // If it's a recipe document, preview first
                if (file[i].type === 'text/csv' || file[i].type === 'application/json') {
                    await previewRecipeFile(file[i]);
                } else {
                    // For images, just upload directly
                    await uploadFile(file[i], (prog) => setProgress(prog));
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Upload failed');
            } finally {
                const elapsed = Date.now() - uploadStart;
                if (elapsed < MIN_PROGRESS_VISIBLE_MS) {
                    await wait(MIN_PROGRESS_VISIBLE_MS - elapsed);
                }
                setUploading(false);
                setProgress(null);
            }
        }

    };

    const previewRecipeFile = async (file: File) => {
        try {
            const content = await file.text();
            let recipes: RecipeImportResult[] = [];

            if (file.type === 'text/csv') {
                // Parse CSV with proper handling of quoted fields
                recipes = parseCSV(content);
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

    const parseCSV = (content: string): RecipeImportResult[] => {
        const rows = parseCSVRows(content);
        if (rows.length < 2) return [];

        const headers = rows[0].map(header => header.toLowerCase().trim());
        const recipes: RecipeImportResult[] = [];

        for (let i = 1; i < rows.length; i++) {
            const values = rows[i];
            if (!values.length) continue;

            const recipe: Record<string, string> = {};

            headers.forEach((header, index) => {
                recipe[header] = values[index] || '';
            });

            recipes.push(recipe as unknown as RecipeImportResult);
        }

        return recipes;
    };

    const parseCSVRows = (content: string): string[][] => {
        const rows: string[][] = [];
        let currentRow = '';
        let insideQuotes = false;

        for (let i = 0; i < content.length; i++) {
            const char = content[i];
            const nextChar = content[i + 1];

            if (char === '"') {
                if (insideQuotes && nextChar === '"') {
                    currentRow += '"';
                    i += 1;
                } else {
                    insideQuotes = !insideQuotes;
                    currentRow += char;
                }
                continue;
            }

            if ((char === '\n' || char === '\r') && !insideQuotes) {
                if (char === '\r' && nextChar === '\n') {
                    i += 1;
                }

                if (currentRow.trim()) {
                    rows.push(parseCSVLine(currentRow));
                }
                currentRow = '';
                continue;
            }

            currentRow += char;
        }

        if (currentRow.trim()) {
            rows.push(parseCSVLine(currentRow));
        }

        return rows;
    };

    const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (insideQuotes && nextChar === '"') {
                    current += '"';
                    i++; // Skip next quote
                } else {
                    insideQuotes = !insideQuotes;
                }
            } else if (char === ',' && !insideQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    };

    const confirmImport = async () => {
        if (!previewFile) return;
        const importStart = Date.now();
        let nextImportResult: RecipeImportResponse | null = null;
        try {
            setUploading(true);
            setError(null);
            setImportResult(null);
            nextImportResult = await importRecipes(previewFile, (prog) => setProgress(prog));
            setShowPreview(false);
            setPreviewData(null);
            setPreviewFile(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Import failed');
        } finally {
            const elapsed = Date.now() - importStart;
            if (elapsed < MIN_PROGRESS_VISIBLE_MS) {
                await wait(MIN_PROGRESS_VISIBLE_MS - elapsed);
            }
            if (nextImportResult) {
                setImportResult(nextImportResult);
            }
            setUploading(false);
            setProgress(null);
        }
    };

    const handleRecipeImageUpload = async (recipeId: number, file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        try {
            setImageUploadLoading(true);
            setError(null);
            await uploadRecipeImage(recipeId, file);
            // Success message shown by updating the UI
            if (importResult) {
                const updatedRecipes = importResult.importedRecipes.map((r) =>
                    r.id === recipeId ? { ...r, imageUrl: `/uploads/avatars/${file.name}` } : r
                );
                setImportResult({
                    ...importResult,
                    importedRecipes: updatedRecipes,
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload image');
        } finally {
            setImageUploadLoading(false);
        }
    };

    const handleRecipeImageDelete = async (recipeId: number) => {
        try {
            setImageDeleteLoading(recipeId);
            setError(null);
            await deleteRecipeImage(recipeId);
            if (importResult) {
                const updatedRecipes = importResult.importedRecipes.map((r) =>
                    r.id === recipeId ? { ...r, imageUrl: null } : r
                );
                setImportResult({
                    ...importResult,
                    importedRecipes: updatedRecipes,
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete image');
        } finally {
            setImageDeleteLoading(null);
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
                <>
                    <Alert severity={importResult.stats.failed === 0 ? 'success' : 'warning'} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {importResult.message}
                        </Typography>
                        <Typography variant="body2">
                            Imported: {importResult.stats.imported} | Failed: {importResult.stats.failed} | Total:{' '}
                            {importResult.stats.total}
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

                    {/* Imported Recipes Section */}
                    {importResult.importedRecipes && importResult.importedRecipes.length > 0 && (
                        <Card sx={{ mb: 3, p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                📷 Imported Recipes - Add Images
                            </Typography>
                            <List>
                                {importResult.importedRecipes.map((recipe) => (
                                    <ListItem
                                        key={recipe.id}
                                        secondaryAction={
                                            <>
                                                <input
                                                    type="file"
                                                    id={`image-upload-${recipe.id}`}
                                                    hidden
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            handleRecipeImageUpload(recipe.id, e.target.files[0]);
                                                        }
                                                    }}
                                                    disabled={imageUploadLoading}
                                                />
                                                <label htmlFor={`image-upload-${recipe.id}`}>
                                                    <Button
                                                        component="span"
                                                        size="small"
                                                        variant={recipe.imageUrl ? 'outlined' : 'contained'}
                                                        color={recipe.imageUrl ? 'success' : 'primary'}
                                                        startIcon={<AddPhotoAlternateIcon />}
                                                        disabled={imageUploadLoading}
                                                        sx={{ mr: 1 }}
                                                    >
                                                        {recipe.imageUrl ? 'Change' : 'Add Image'}
                                                    </Button>
                                                </label>
                                                {recipe.imageUrl && (
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        startIcon={<DeleteIcon />}
                                                        onClick={() => handleRecipeImageDelete(recipe.id)}
                                                        disabled={imageDeleteLoading === recipe.id}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </>
                                        }
                                        sx={{ borderBottom: '1px solid #eee', mb: 1 }}
                                    >
                                        <ListItemText
                                            primary={recipe.name}
                                            secondary={
                                                <>
                                                    <Typography variant="caption" display="block">
                                                        Author: {recipe.author}
                                                    </Typography>
                                                    <Typography variant="caption">
                                                        Status:{' '}
                                                        <Chip
                                                            label={recipe.status}
                                                            size="small"
                                                            color={
                                                                recipe.status === 'pending' ? 'warning' : 'success'
                                                            }
                                                            variant="outlined"
                                                        />
                                                    </Typography>
                                                    {recipe.imageUrl && (
                                                        <Typography variant="caption" display="block" color="success">
                                                            ✓ Image added
                                                        </Typography>
                                                    )}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    )}
                </>
            )}

            {/* Upload Area */}
            <Card
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onChange={handleFileInput}
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
                    accept=".csv,.json,.jpg,.jpeg,.png,.gif,.webp"
                />
                <label htmlFor="file-input" style={{ cursor: 'pointer', width: '100%' }}>
                    <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                    <Typography variant="h6">
                        Drag & drop files here or click to select
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        📋 <strong>Recipe CSV:</strong> Upload multiple recipes at once with our template
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        Supported: CSV, JSON (for recipes), JPEG, PNG, GIF, WebP (max 5MB)
                    </Typography>
                </label>
            </Card>

            {/* Upload Progress */}
            {(uploading || progress) && (
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        <Typography variant="body2">
                            {progress
                                ? `Uploading: ${Math.round(progress.percentage)}%`
                                : 'Processing file...'}
                        </Typography>
                    </Box>
                    {progress ? (
                        <LinearProgress variant="determinate" value={progress.percentage} />
                    ) : (
                        <LinearProgress />
                    )}
                </Box>
            )}

            {/* Preview Dialog */}
            <CSVRecipePreview
                open={showPreview}
                recipes={previewData}
                onConfirm={confirmImport}
                onCancel={() => setShowPreview(false)}
                uploading={uploading}
            />

        </Box>
    );
}

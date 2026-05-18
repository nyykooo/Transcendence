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
import DownloadIcon from '@mui/icons-material/Download';

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
    const [recipeImages, setRecipeImages] = useState<Record<number, File>>({});

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            await handleFileUpload([files[0]]);
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileUpload([e.target.files[0]]);
        }
    };

    const handleFileUpload = async (files: File[]) => {
        if (files.length === 0) return;

        const file = files[0];
        const uploadStart = Date.now();
        const validTypes = ['text/csv', 'application/json', 'application/vnd.ms-excel'];

        if (!validTypes.includes(file.type)) {
            setError('Invalid file type. Supported: CSV, JSON files only');
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
            setRecipeImages({});

            await previewRecipeFile(file);
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

            console.log('[Preview] Parsed recipes from file:', recipes);
            console.log('[Preview] Recipe count:', recipes.length);
            recipes.forEach((r, i) => console.log(`[Preview] Recipe ${i}:`, { name: r.name, diet: r.diet, has_ingredients: !!r.ingredients, has_instructions: !!r.instructions }));
            
            setPreviewData(recipes);
            setPreviewFile(file);
            // Don't auto-open preview - let user add images first
        } catch (err) {
            const errMsg = err instanceof Error ? err.message : 'Unknown error';
            console.error('[Preview] Parse error:', errMsg);
            setError('Failed to parse file: ' + errMsg);
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

            const recipe: Record<string, any> = {};

            headers.forEach((header, index) => {
                const value = values[index] || '';
                if (header === 'ingredients') {
                    recipe[header] = value.split(',').map(s => {
                        const parts = s.trim().match(/^(.+?)\s\((\d+(\.\d+)?)\s*([a-zA-Z]+)\)$/);
                        if (parts) {
                            return {
                                name: parts[1],
                                quantity: parseFloat(parts[2]),
                                unit: parts[4]
                            };
                        }
                        return { name: s.trim(), quantity: 0, unit: '' };
                    });
                } else if (header === 'instructions') {
                    // Parse instructions into individual steps
                    // Format: "Step Name: Description. Step Name: Description."
                    const instructionText = value.trim();
                    
                    // Split by period followed by spaces to separate steps
                    const steps = instructionText.split(/\.\s+/).map(step => {
                        const trimmed = step.trim();
                        // Add period back if it was removed by split
                        return trimmed ? (trimmed.endsWith('.') ? trimmed : trimmed + '.') : '';
                    }).filter(Boolean);
                    
                    recipe['instructions'] = steps.length > 0 ? steps.join('\n') : instructionText;
                } else {
                    recipe[header] = value;
                }
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
        if (!previewFile || !previewData || previewData.length === 0) {
            setError('No recipes to import');
            return;
        }

        // Check if all recipes have images
        const recipesWithoutImages = previewData.filter(
            (_recipe, index) => !recipeImages[index]
        );

        if (recipesWithoutImages.length > 0) {
            setError(
                `Please add an image for each recipe. Missing images for: ${recipesWithoutImages
                    .map((r) => r.name)
                    .join(', ')}`
            );
            return;
        }

        const importStart = Date.now();
        let nextImportResult: RecipeImportResponse | null = null;
        try {
            setUploading(true);
            setError(null);
            setImportResult(null);

            // Step 1: Upload images if any exist
            const imageFilenames: Record<number, string> = {};
            for (let i = 0; i < previewData.length; i++) {
                const imageFile = recipeImages[i];
                if (imageFile) {
                    try {
                        const uploadResponse = await uploadFile(imageFile, (prog) => setProgress(prog));
                        imageFilenames[i] = uploadResponse.file.url;
                        console.log(`[Image ${i}] Uploaded: ${uploadResponse.file.filename} → ${uploadResponse.file.url}`);
                    } catch (err) {
                        console.warn(`Failed to upload image for ${previewData[i].name}:`, err);
                        // Don't fail the whole import, just skip the image
                    }
                }
            }

            // Step 2: Attach image paths to recipes if available
            const recipesWithImages = previewData.map((recipe, index) => {
                const recipeWithImage = { ...recipe };
                if (imageFilenames[index]) {
                    recipeWithImage.image = imageFilenames[index];
                }
                return recipeWithImage;
            });

            // Step 3: Convert to JSON and send for import
            const jsonContent = JSON.stringify(recipesWithImages, null, 2);
            const jsonFile = new File(
                [jsonContent],
                `recipes_${Date.now()}.json`,
                { type: 'application/json' }
            );

            // Step 4: Import the recipes
            nextImportResult = await importRecipes(jsonFile, (prog) => setProgress(prog));
            
            if (nextImportResult.stats.failed > 0) {
                console.error('[Import] Import result:', nextImportResult);
                
                let errorDetails = '';
                
                // Check for validation errors
                if (nextImportResult.failures?.invalid && nextImportResult.failures.invalid.length > 0) {
                    errorDetails = nextImportResult.failures.invalid
                        .map((fail: any) => `• ${fail.recipe}: ${fail.errors.join('; ')}`)
                        .join('\n');
                    console.error('[Import] Validation errors:', nextImportResult.failures.invalid);
                }
                
                // Check for insert errors
                if (nextImportResult.failures?.insertErrors && nextImportResult.failures.insertErrors.length > 0) {
                    const insertErrs = nextImportResult.failures.insertErrors.join('\n• ');
                    errorDetails += (errorDetails ? '\n\n' : '') + `Insert errors:\n• ${insertErrs}`;
                    console.error('[Import] Insert errors:', nextImportResult.failures.insertErrors);
                }
                
                setError(errorDetails || `❌ Import failed: ${nextImportResult.stats.failed} recipe(s) rejected`);
            } else {
                setShowPreview(false);
                setPreviewData(null);
                setPreviewFile(null);
                setRecipeImages({});
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Import failed';
            console.error('[Import] Error:', errorMsg);
            setError(errorMsg);
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

    const handleDownloadTemplate = () => {
        const headers = ['name', 'ingredients', 'diet', 'cost', 'portions', 'prep_time', 'cooking_time', 'instructions', 'url', 'author'];
        const csvContent = headers.join(',') + '\n';
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'recipe-template.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-wrap' }} onClose={() => setError(null)}>
                    <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.6 }}>
                        {error}
                    </Box>
                </Alert>
            )}

            <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadTemplate}
                sx={{ mb: 2 }}
            >
                Download CSV Template
            </Button>

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

            {/* Recipe Preview Section - Optional Image Upload */}
            {previewData && previewData.length > 0 && (
                <Card sx={{ mb: 3, p: { xs: 2, sm: 3 }, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2, gap: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: { xs: 1, sm: 0 } }}>
                            📋 Recipe Preview - Add Images (Required)
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', sm: 'auto' } }}>
                            <Button
                                variant="outlined"
                                color="info"
                                onClick={() => setShowPreview(true)}
                                sx={{ minWidth: 150 }}
                            >
                                👁️ View Preview
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={confirmImport}
                                disabled={uploading}
                                sx={{ minWidth: 150 }}
                            >
                                {uploading ? 'Importing...' : '✅ Import All'}
                            </Button>
                        </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Each recipe requires an image before importing. Click "Add Image" for each recipe below.
                    </Typography>
                    <List sx={{ '& .MuiListItem-root': { flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' } } }}>
                        {previewData.map((recipe, index) => {
                            const hasImage = Boolean(recipeImages[index]);
                            return (
                                <ListItem
                                    key={index}
                                    secondaryAction={
                                        <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' }, mt: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}>
                                            <input
                                                type="file"
                                                id={`preview-image-${index}`}
                                                hidden
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        setRecipeImages({
                                                            ...recipeImages,
                                                            [index]: e.target.files[0],
                                                        });
                                                    }
                                                }}
                                            />
                                            <label htmlFor={`preview-image-${index}`} style={{ flex: 'auto', minWidth: 0 }}>
                                                <Button
                                                    component="span"
                                                    size="small"
                                                    variant={hasImage ? 'outlined' : 'contained'}
                                                    color={hasImage ? 'success' : 'primary'}
                                                    startIcon={<AddPhotoAlternateIcon />}
                                                    sx={{ 
                                                        whiteSpace: 'nowrap', 
                                                        overflow: 'hidden', 
                                                        textOverflow: 'ellipsis',
                                                        width: { xs: '100%', sm: 'auto' },
                                                        minWidth: { xs: 0, sm: 120 }
                                                    }}
                                                    title={recipeImages[index]?.name || 'Add image for this recipe'}
                                                >
                                                    {hasImage ? recipeImages[index]?.name?.substring(0, 20) : 'Add Image'}
                                                </Button>
                                            </label>
                                            {hasImage && (
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    startIcon={<DeleteIcon />}
                                                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                                                    onClick={() => {
                                                        const updated = { ...recipeImages };
                                                        delete updated[index];
                                                        setRecipeImages(updated);
                                                    }}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </Box>
                                    }
                                    sx={{ borderBottom: '1px solid #eee', mb: 1, flexWrap: 'wrap' }}
                                >
                                    <ListItemText
                                        primary={recipe.name || `Recipe ${index + 1}`}
                                        secondary={hasImage ? '✅ Image ready' : '❌ Missing image'}
                                        secondaryTypographyProps={{
                                            color: hasImage ? 'success.main' : 'error.main',
                                        }}
                                        sx={{ mb: { xs: 1, sm: 0 }, minWidth: { xs: '100%', sm: 'auto' } }}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </Card>
            )}

            {/* Upload Area */}
            <Card
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                sx={{
                    p: { xs: 2, sm: 3 },
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
                    minHeight: { xs: 150, sm: 200 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <input
                    type="file"
                    id="file-input"
                    hidden
                    accept=".csv,.json"
                    onChange={handleFileInput}
                />
                <label htmlFor="file-input" style={{ cursor: 'pointer', width: '100%' }}>
                    <CloudUploadIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: '#1976d2', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        Drag & drop files here or click to select
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                        📋 <strong>Recipe File:</strong> Upload CSV or JSON with recipes, then add images for each
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        Supported: CSV, JSON formats (max 5MB)
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
                onCancel={() => {
                    setShowPreview(false);
                }}
                uploading={uploading}
            />

        </Box>
    );
}

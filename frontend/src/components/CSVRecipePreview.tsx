import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Stack,
    Paper,
    CircularProgress,
    Chip,
    Divider,
    IconButton,
    Alert,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import type { RecipeImportResult } from '../props/fileManagement/fileProps';

interface CSVRecipePreviewProps {
    open: boolean;
    recipes: RecipeImportResult[] | null;
    onConfirm: () => void;
    onCancel: () => void;
    uploading: boolean;
}

const pageShellSx = {
    minHeight: '100%',
    width: '100%',
    background:
        'radial-gradient(circle at 12% 10%, rgba(171, 57, 3, 0.2), transparent 34%), radial-gradient(circle at 88% 20%, rgba(16, 122, 108, 0.15), transparent 32%), linear-gradient(170deg, #fff8f1 0%, #fdfaf7 45%, #f6fbfb 100%)',
};

const sectionPaperSx = {
    p: { xs: 2, md: 2.5 },
    borderRadius: 5,
    border: '1px solid rgba(15, 23, 42, 0.08)',
};

const headingSx = {
    fontFamily: '"Fraunces", "Georgia", serif',
    fontWeight: 650,
};

export default function CSVRecipePreview({
    open,
    recipes,
    onConfirm,
    onCancel,
    uploading,
}: CSVRecipePreviewProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (open) {
            setCurrentIndex(0);
        }
    }, [open, recipes]);

    if (!recipes || recipes.length === 0) {
        return null;
    }

    const safeIndex = Math.min(currentIndex, recipes.length - 1);
    const currentRecipe = recipes[safeIndex];

    const handleNext = () => {
        if (currentIndex < recipes.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Parse ingredients from string format if needed
    const parseIngredients = (ingredients: any): Array<{ name: string; quantity: number; unit: string }> => {
        if (Array.isArray(ingredients)) {
            return ingredients as any;
        }

        if (typeof ingredients === 'string') {
            // Parse "Ingredient (quantity unit)" format
            const matches = ingredients.match(/([^()]+)\s*\(([0-9.]+)\s*([^)]*)\)/g) || [];
            return matches.map(match => {
                const parsed = match.match(/([^()]+)\s*\(([0-9.]+)\s*([^)]*)\)/);
                if (parsed) {
                    return {
                        name: parsed[1].trim(),
                        quantity: parseFloat(parsed[2]),
                        unit: parsed[3].trim(),
                    };
                }
                return { name: match, quantity: 0, unit: '' };
            });
        }

        return [];
    };

    const parseInstructions = (instructions: any): string[] => {
        if (typeof instructions === 'string') {
            return instructions
                .split('\n')
                .map((line: string) => line.trim())
                .filter(Boolean);
        }
        return [];
    };

    const ingredientList = parseIngredients(currentRecipe.ingredients);
    const instructionSteps = parseInstructions(currentRecipe.instructions);
    const parsedCost = typeof currentRecipe.cost === 'number'
        ? currentRecipe.cost
        : Number.parseFloat(String(currentRecipe.cost ?? ''));
    const parsedPortions = typeof currentRecipe.portions === 'number'
        ? currentRecipe.portions
        : Number.parseInt(String(currentRecipe.portions ?? ''), 10);

    return (
        <Dialog 
            open={open} 
            onClose={onCancel} 
            maxWidth="lg" 
            fullWidth 
            PaperProps={{ 
                sx: { 
                    minHeight: { xs: '95vh', sm: '90vh' },
                    maxHeight: { xs: '100vh', sm: '90vh' },
                    m: { xs: 1, sm: 2 },
                    width: { xs: 'calc(100% - 16px)', sm: '100%' }
                } 
            }}
        >
            <DialogTitle sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                    <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>Recipe Preview ({currentIndex + 1} of {recipes.length})</Typography>
                    <Typography variant="caption" color="textSecondary">
                        {uploading ? 'Validating...' : 'Ready to import'}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ ...pageShellSx, pb: 2, px: { xs: 1.5, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
                <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2.5, md: 4 },
                            borderRadius: 6,
                            border: '1px solid rgba(15, 23, 42, 0.08)',
                            background: 'linear-gradient(150deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.8) 100%)',
                        }}
                    >
                        <Stack spacing={3}>
                            {/* Header */}
                            <Stack spacing={1}>
                                <Chip
                                    label="Recipe Preview"
                                    sx={{
                                        width: 'fit-content',
                                        fontWeight: 700,
                                        bgcolor: 'rgba(203, 107, 61, 0.14)',
                                        color: '#8c3e1f',
                                        fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
                                    }}
                                />
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontFamily: '"Fraunces", "Georgia", serif',
                                        fontWeight: 700,
                                        fontSize: { xs: '1.8rem', md: '2.5rem' },
                                    }}
                                >
                                    {currentRecipe.name || 'Untitled Recipe'}
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {currentRecipe.diet && (
                                        <Chip
                                            label={currentRecipe.diet}
                                            variant="outlined"
                                            sx={{ fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}
                                        />
                                    )}
                                    <Chip
                                        label={`${ingredientList.length} Ingredients`}
                                        variant="outlined"
                                        sx={{ fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}
                                    />
                                    <Chip
                                        label={`${instructionSteps.length} Steps`}
                                        variant="outlined"
                                        sx={{ fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}
                                    />
                                    {Number.isFinite(parsedCost) && (
                                        <Chip
                                            label={`€${parsedCost.toFixed(2)}`}
                                            variant="outlined"
                                            sx={{ fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}
                                        />
                                    )}
                                    {Number.isFinite(parsedPortions) && (
                                        <Chip
                                            label={`${parsedPortions} Servings`}
                                            variant="outlined"
                                            sx={{ fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}
                                        />
                                    )}
                                </Stack>
                            </Stack>

                            {/* Ingredients Section */}
                            {ingredientList.length > 0 && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        ...sectionPaperSx,
                                        background: '#ffffff',
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            mb: 1.5,
                                            ...headingSx,
                                        }}
                                    >
                                        Ingredients
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Stack spacing={1.25}>
                                        {ingredientList.map((ingredient, index) => (
                                            <Stack
                                                key={`${ingredient.name}-${index}`}
                                                direction="row"
                                                alignItems="baseline"
                                                spacing={1.5}
                                                sx={{
                                                    p: 1,
                                                    borderRadius: 2,
                                                    backgroundColor:
                                                        index % 2 === 0 ? 'rgba(16, 122, 108, 0.05)' : 'transparent',
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        minWidth: 95,
                                                        fontWeight: 700,
                                                        color: '#0f5f54',
                                                        fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
                                                    }}
                                                >
                                                    {`${ingredient.quantity} ${ingredient.unit}`}
                                                </Typography>
                                                <Typography sx={{ fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}>
                                                    {ingredient.name}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Paper>
                            )}

                            {/* Instructions Section */}
                            {instructionSteps.length > 0 && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        ...sectionPaperSx,
                                        background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            mb: 1.5,
                                            ...headingSx,
                                        }}
                                    >
                                        Instructions
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Stack spacing={1.75}>
                                        {instructionSteps.map((step, index) => (
                                            <Stack
                                                key={index}
                                                direction="row"
                                                spacing={1.5}
                                                alignItems="flex-start"
                                            >
                                                <Box
                                                    sx={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: '50%',
                                                        display: 'grid',
                                                        placeItems: 'center',
                                                        fontWeight: 700,
                                                        fontSize: 13,
                                                        bgcolor: 'rgba(203, 107, 61, 0.18)',
                                                        color: '#8c3e1f',
                                                        fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {index + 1}
                                                </Box>
                                                <Typography
                                                    sx={{
                                                        pt: 0.35,
                                                        fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
                                                    }}
                                                >
                                                    {step}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Paper>
                            )}

                            {/* Optional fields info */}
                            {(currentRecipe.url || currentRecipe.prep_time || currentRecipe.cooking_time) && (
                                <Alert severity="info" sx={{ fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}>
                                    <Stack spacing={0.5}>
                                        {currentRecipe.url && (
                                            <Typography variant="body2">
                                                <strong>Video:</strong> {currentRecipe.url}
                                            </Typography>
                                        )}
                                        {currentRecipe.prep_time && (
                                            <Typography variant="body2">
                                                <strong>Prep time:</strong> {currentRecipe.prep_time} minutes
                                            </Typography>
                                        )}
                                        {currentRecipe.cooking_time && (
                                            <Typography variant="body2">
                                                <strong>Cooking time:</strong> {currentRecipe.cooking_time} minutes
                                            </Typography>
                                        )}
                                    </Stack>
                                </Alert>
                            )}
                        </Stack>
                    </Paper>
                </Box>
            </DialogContent>

            {/* Navigation and Actions */}
            <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, borderTop: '1px solid rgba(15, 23, 42, 0.08)', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ justifyContent: { xs: 'center', sm: 'flex-start' }, width: { xs: '100%', sm: 'auto' } }}>
                    <IconButton
                        onClick={handlePrevious}
                        disabled={currentIndex === 0 || uploading}
                        size="small"
                    >
                        <NavigateBeforeIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{ minWidth: '120px', textAlign: 'center' }}>
                        {currentIndex + 1} / {recipes.length}
                    </Typography>
                    <IconButton
                        onClick={handleNext}
                        disabled={currentIndex === recipes.length - 1 || uploading}
                        size="small"
                    >
                        <NavigateNextIcon />
                    </IconButton>
                </Stack>
                <Box sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }} />
                <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' }, '& button': { width: { xs: '100%', sm: 'auto' } } }}>
                    <Button onClick={onCancel} disabled={uploading} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        variant="contained"
                        disabled={uploading}
                        startIcon={uploading && <CircularProgress size={20} />}
                    >
                        {uploading ? 'Importing...' : 'Import All'}
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
}

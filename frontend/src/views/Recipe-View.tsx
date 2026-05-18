import { useEffect, useState } from 'react';

import { Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { Logo } from '../components/components';

import { useNavigate, useParams } from 'react-router-dom';

import { type Recipe } from '../props/recipeProps';

import { getRecipe } from '../api/recipe';

import '../assets/style.css';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const pageShellSx = {
    minHeight: '100%',
    width: '100%',
    overflowX: 'hidden',
    background:
        'radial-gradient(circle at 12% 10%, rgba(171, 57, 3, 0.2), transparent 34%), radial-gradient(circle at 88% 20%, rgba(16, 122, 108, 0.15), transparent 32%), linear-gradient(170deg, #fff8f1 0%, #fdfaf7 45%, #f6fbfb 100%)',
    pt: { xs: 3, md: 4 },
    px: { xs: 2, md: 4 },
    pb: { xs: 10, md: 12 },
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

export default function RecipeView() {
    const navigate = useNavigate();
    const { name } = useParams<{name: string}>();

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [liking, setLiking] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const fetchRecipe = async () => {
            try{
                setLoading(true);
                const res = await getRecipe(name || '');
    
                if (cancelled) {
                    return;
                }
    
                setRecipe(res);
                setIsLiked(Boolean(res?.likedByUser));
                setLoading(false);
            } catch (error) {
                navigate('/not-found');
            }
        };

        fetchRecipe();

        return () => {
            cancelled = true;
        };
    }, [name]);

    const handleLikeClick = async () => {
        if (!recipe || !name || liking) return;

        setLiking(true);
        try {
            const auth = JSON.parse(localStorage.getItem('auth') || 'null');
            if (!auth?.token) {
                console.error('No auth token found');
                setLiking(false);
                return;
            }

            const endpoint = isLiked ? 'like_remove' : 'like_add';
            const response = await fetch(`/api/recipes/${encodeURIComponent(name)}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to update like');
            }

            const data = await response.json();
            setRecipe({ ...recipe, liked: data.liked, likedByUser: Boolean(data.likedByUser) });
            setIsLiked(Boolean(data.likedByUser));
        } catch (error) {
            console.error('Error updating like:', error);
        } finally {
            setLiking(false);
        }
    };
    const handleExportToCSV = () => {
        if (!recipe) return;

        const headers = ['name', 'ingredients', 'diet', 'cost', 'portions', 'prep_time', 'cooking_time', 'instructions', 'url', 'author', 'image'];
        
        const formatIngredients = (ingredients: Array<{ name: string; quantity: number; unit: string }>) => {
            return ingredients.map(i => `${i.name} (${i.quantity} ${i.unit})`).join(', ');
        };

        const formatInstructions = (instructions: Array<{ title: string; subSteps: string[] }>) => {
            return instructions.map(g => `${g.title}: ${g.subSteps.join(', ')}`).join('\n');
        };

        const escapeCSV = (str: string | number | null | undefined) => {
            if (str === null || str === undefined) return '';
            const s = String(str);
            if (s.includes(',') || s.includes('"') || s.includes('\n')) {
                return `"${s.replace(/"/g, '""')}"`;
            }
            return s;
        };

        const row = [
            escapeCSV(recipe.name),
            escapeCSV(formatIngredients(recipe.ingredients)),
            escapeCSV(recipe.diet),
            escapeCSV(recipe.cost),
            escapeCSV(recipe.portions),
            escapeCSV(recipe.prep_time),
            escapeCSV(recipe.cooking_time),
            escapeCSV(formatInstructions(recipe.instructions)),
            escapeCSV(recipe.url),
            escapeCSV(recipe.author),
            escapeCSV(recipe.image)
        ];

        const csvContent = headers.join(',') + '\n' + row.join(',');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${recipe.name}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <Box sx={{ ...pageShellSx, display: 'grid', placeItems: 'center' }}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid rgba(15, 23, 42, 0.1)' }}>
                    <Typography sx={{ fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif', letterSpacing: 0.4 }}>
                        Plating your recipe view...
                    </Typography>
                </Paper>
            </Box>
        );
    }

    if (!recipe) {
        return (
            <Box sx={{ ...pageShellSx, display: 'grid', placeItems: 'center' }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 4 },
                        borderRadius: 4,
                        border: '1px solid rgba(15, 23, 42, 0.1)',
                        maxWidth: 560,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h4" sx={{ mb: 1, fontFamily: '"Fraunces", "Georgia", serif' }}>
                        Recipe Not Found
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}>
                        We could not plate this recipe right now. Try reopening from the recipe list.
                    </Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box
            sx={{ ...pageShellSx, position: 'relative' }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: -160,
                    right: -110,
                    width: 340,
                    height: 340,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(16, 122, 108, 0.16) 0%, rgba(16, 122, 108, 0) 72%)',
                    pointerEvents: 'none',
                }}
            />

            <Box sx={{ maxWidth: 1240, width: '100%', mx: 'auto', position: 'relative', zIndex: 1 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2.5, md: 4 },
                        borderRadius: 6,
                        border: '1px solid rgba(15, 23, 42, 0.08)',
                        boxShadow: '0 30px 80px rgba(15, 23, 42, 0.08)',
                        background: 'linear-gradient(150deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.8) 100%)',
                        backdropFilter: 'blur(3px)',
                    }}
                >
                    <Stack spacing={3} direction="column">
                        <Stack spacing={1}>
                            <Chip
                                label="Recipe Studio"
                                sx={{
                                    width: 'fit-content',
                                    fontWeight: 700,
                                    bgcolor: 'rgba(203, 107, 61, 0.14)',
                                    color: '#8c3e1f',
                                    fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
                                }}
                            />
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontFamily: '"Fraunces", "Georgia", serif',
                                        fontWeight: 700,
                                        lineHeight: 1.05,
                                        letterSpacing: '-0.02em',
                                        fontSize: { xs: '2rem', md: '3.4rem' },
                                    }}
                                >
                                    {recipe.name || 'Untitled Recipe'}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={handleExportToCSV}
                                >
                                    Export to CSV
                                </Button>
                            </Stack>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                <Chip
                                    label={`${recipe.ingredients?.length || 0} Ingredients`}
                                    variant="outlined"
                                    sx={{ fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}
                                />
                                <Chip
                                    label={`${recipe.instructions.length || 1} Steps`}
                                    variant="outlined"
                                    sx={{ fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}
                                />
                                <Chip
                                    label={`${recipe.viewed ?? 0} Views`}
                                    variant="outlined"
                                    sx={{ fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}
                                />
                                <Box
                                    component="button"
                                    type="button"
                                    onClick={handleLikeClick}
                                    disabled={liking}
                                    aria-pressed={isLiked}
                                    sx={{
                                        appearance: 'none',
                                        border: '1px solid',
                                        borderColor: isLiked ? '#d32f2f' : 'rgba(211, 47, 47, 0.35)',
                                        bgcolor: isLiked ? '#d32f2f' : 'transparent',
                                        color: isLiked ? '#ffffff' : '#d32f2f',
                                        borderRadius: 2,
                                        px: 1.5,
                                        py: 0.75,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.75,
                                        fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        cursor: liking ? 'wait' : 'pointer',
                                        '&:disabled': {
                                            opacity: 0.65,
                                            cursor: 'not-allowed',
                                        },
                                        '&:hover:not(:disabled)': {
                                            bgcolor: isLiked ? '#b71c1c' : 'rgba(211, 47, 47, 0.08)',
                                        },
                                    }}
                                >
                                    {isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                                    {recipe.liked ?? 0} Like{(recipe.liked ?? 0) !== 1 ? 's' : ''}
                                </Box>
                            </Stack>
                        </Stack>

                        <Stack direction={{ xs: 'column', lg: 'row',  }}  spacing={3} alignItems="stretch"  >
                            <Paper
                                elevation={0}
                                sx={{
                                    ...sectionPaperSx,
                                    borderRadius: 5,
                                    flex: { xs: '1 1 auto', lg: '0 0 520px' },
                                    background: 'linear-gradient(180deg, #fff 0%, #fff8f2 100%)',
                                    aspectRatio: '1 / 1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        border: '1px solid rgba(15, 23, 42, 0.06)',
                                        boxShadow: '0 18px 36px rgba(15, 23, 42, 0.12)',
                                    }}
                                >
                                    <Logo size={520} path={recipe.image || ''} />
                                </Box>
                            </Paper>

                            <Stack spacing={3} sx={{ flex: { xs: 1, lg: '0 0 420px' }, minWidth: 0 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        ...sectionPaperSx,
                                        background: '#ffffff',
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            mb: 1.5,
                                            ...headingSx,
                                            fontSize: { xs: '1.5rem', md: '2rem' },
                                        }}
                                    >
                                        Ingredients
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    {recipe.url && (
                                        <Box
                                            component="a"
                                            href={recipe.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            sx={{
                                                display: 'inline-flex',
                                                mb: 2,
                                                fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
                                                fontWeight: 600,
                                                color: 'primary.main',
                                                textDecoration: 'none',
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                },
                                            }}
                                        >
                                            Watch recipe video
                                        </Box>
                                    )}

                                    <Stack spacing={1.25}>
                                        {(recipe.ingredients || []).length === 0 && (
                                            <Typography color="text.secondary" sx={{ fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}>
                                                No ingredients provided for this recipe.
                                            </Typography>
                                        )}

                                        {recipe.ingredients.map((ingredient: { name: string; quantity: number; unit: string }, index: number) => (
                                            <Stack
                                                key={`${ingredient.name}-${index}`}
                                                direction="row"
                                                alignItems="baseline"
                                                spacing={1.5}
                                                sx={{
                                                    p: 1,
                                                    borderRadius: 2,
                                                    backgroundColor: index % 2 === 0 ? 'rgba(16, 122, 108, 0.05)' : 'transparent',
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
                            </Stack>
                        </Stack>
                            <Paper
                                    elevation={0}
                                    sx={{
                                        ...sectionPaperSx,
                                        background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
                                        width: '100%',
                                        maxWidth: '100%',
                                        alignSelf: 'stretch'
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            mb: 1.5,
                                            ...headingSx,
                                            fontSize: { xs: '1.5rem', md: '2rem' },
                                        }}
                                    >
                                        Instructions
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Stack spacing={1.75}>
                                                                            {recipe.instructions.length === 0 && (
                                        <Typography color="text.secondary" sx={{ fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}>
                                          No instructions provided for this recipe.
                                        </Typography>
                                      )}

                                                                            {recipe.instructions.map((group, groupIndex) => (
                                                                                <Box key={`${group.title}-${groupIndex}`} sx={{ mb: 1 }}>
                                                                                    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 1.5 }}>
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
                                                                                            }}
                                                                                        >
                                                                                            {groupIndex + 1}
                                                                                        </Box>
                                                                                        <Typography sx={{ pt: 0.35, fontWeight: 600, fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}>
                                                                                            {group.title}
                                                                                        </Typography>
                                                                                    </Stack>

                                                                                    <Stack spacing={1} sx={{ pl: 4 }}>
                                                                                        {group.subSteps.map((subStep, subIndex) => (
                                                                                            <Stack key={`${group.title}-${subIndex}`} direction="row" spacing={1.5} alignItems="center">
                                                                                                <Box
                                                                                                    sx={{
                                                                                                        flexShrink: 0,
                                                                                                        width: 20,
                                                                                                        height: 20,
                                                                                                        display: 'grid',
                                                                                                        placeItems: 'center',
                                                                                                        color: '#8c3e1f',
                                                                                                        fontSize: 18,
                                                                                                        lineHeight: 1,
                                                                                                    }}
                                                                                                >
                                                                                                    •
                                                                                                </Box>
                                                                                                <Typography sx={{ pt: 0.35, fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}>
                                                                                                    {subStep}
                                                                                                </Typography>
                                                                                            </Stack>
                                                                                        ))}
                                                                                    </Stack>
                                                                                </Box>
                                                                            ))}
                                    </Stack>
                                </Paper>
                    </Stack>
                </Paper>
            </Box>
        </Box>
    );
}
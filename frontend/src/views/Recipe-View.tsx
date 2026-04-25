import { useEffect, useMemo, useState } from 'react';

import { Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';

import { Logo } from '../components/components';

import { useParams } from 'react-router-dom';

import { type Recipe } from '../props/recipeProps';

import { getRecipe } from '../api/recipe';

import '../assets/style.css';

export default function RecipeView() {
    const { name } = useParams<{name: string}>();

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);

    const instructionSteps = useMemo(() => {
        const raw = recipe?.instructions || '';
        return raw
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);
    }, [recipe?.instructions]);

    useEffect(() => {
        let cancelled = false;

        const fetchRecipe = async () => {
            setLoading(true);
            const res = await getRecipe(name || '');

            if (cancelled) {
                return;
            }

            setRecipe(res);
            setLoading(false);
        };

        fetchRecipe();

        return () => {
            cancelled = true;
        };
    }, [name]);

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100%',
                    width: '100%',
                    display: 'grid',
                    placeItems: 'center',
                    background:
                        'radial-gradient(circle at 12% 10%, rgba(203, 107, 61, 0.2), transparent 34%), radial-gradient(circle at 88% 20%, rgba(16, 122, 108, 0.15), transparent 32%), linear-gradient(170deg, #fff8f1 0%, #fdfaf7 45%, #f6fbfb 100%)',
                    p: 3,
                }}
            >
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
            <Box
                sx={{
                    minHeight: '100%',
                    width: '100%',
                    display: 'grid',
                    placeItems: 'center',
                    background:
                        'radial-gradient(circle at 12% 10%, rgba(203, 107, 61, 0.2), transparent 34%), radial-gradient(circle at 88% 20%, rgba(16, 122, 108, 0.15), transparent 32%), linear-gradient(170deg, #fff8f1 0%, #fdfaf7 45%, #f6fbfb 100%)',
                    p: 3,
                }}
            >
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
            sx={{
                minHeight: '100%',
                width: '100%',
                position: 'relative',
                overflow: 'auto',
                background:
                    'radial-gradient(circle at 12% 10%, rgba(203, 107, 61, 0.2), transparent 34%), radial-gradient(circle at 88% 20%, rgba(16, 122, 108, 0.15), transparent 32%), linear-gradient(170deg, #fff8f1 0%, #fdfaf7 45%, #f6fbfb 100%)',
                p: { xs: 2, md: 4 },
            }}
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

            <Box sx={{ maxWidth: 1240, mx: 'auto', position: 'relative', zIndex: 1 }}>
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
                    <Stack spacing={3}>
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
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                <Chip
                                    label={`${recipe.ingredients?.length || 0} Ingredients`}
                                    variant="outlined"
                                    sx={{ fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}
                                />
                                <Chip
                                    label={`${instructionSteps.length || 1} Steps`}
                                    variant="outlined"
                                    sx={{ fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}
                                />
                            </Stack>
                        </Stack>

                        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="stretch">
                            <Paper
                                elevation={0}
                                sx={{
                                    p: { xs: 2, md: 2.5 },
                                    borderRadius: 5,
                                    border: '1px solid rgba(15, 23, 42, 0.08)',
                                    flex: { xs: '1 1 auto', lg: '0 0 420px' },
                                    background: 'linear-gradient(180deg, #fff 0%, #fff8f2 100%)',
                                }}
                            >
                                <Box
                                    sx={{
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        border: '1px solid rgba(15, 23, 42, 0.06)',
                                        boxShadow: '0 18px 36px rgba(15, 23, 42, 0.12)',
                                    }}
                                >
                                    <Logo size={420} path={recipe.image || ''} />
                                </Box>
                            </Paper>

                            <Stack spacing={3} sx={{ flex: 1 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 2, md: 2.5 },
                                        borderRadius: 5,
                                        border: '1px solid rgba(15, 23, 42, 0.08)',
                                        background: '#ffffff',
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            mb: 1.5,
                                            fontFamily: '"Fraunces", "Georgia", serif',
                                            fontWeight: 650,
                                            fontSize: { xs: '1.5rem', md: '2rem' },
                                        }}
                                    >
                                        Ingredients
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Stack spacing={1.25}>
                                        {(recipe.ingredients || []).length === 0 && (
                                            <Typography color="text.secondary" sx={{ fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}>
                                                No ingredients provided for this recipe.
                                            </Typography>
                                        )}

                                        {(recipe.ingredients || []).map((ingredient, index) => (
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

                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 2, md: 2.5 },
                                        borderRadius: 5,
                                        border: '1px solid rgba(15, 23, 42, 0.08)',
                                        background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            mb: 1.5,
                                            fontFamily: '"Fraunces", "Georgia", serif',
                                            fontWeight: 650,
                                            fontSize: { xs: '1.5rem', md: '2rem' },
                                        }}
                                    >
                                        Instructions
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Stack spacing={1.75}>
                                        {instructionSteps.length === 0 && (
                                            <Typography color="text.secondary" sx={{ fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}>
                                                No instructions provided for this recipe.
                                            </Typography>
                                        )}

                                        {instructionSteps.map((step, index) => (
                                            <Stack key={`${step}-${index}`} direction="row" spacing={1.5} alignItems="flex-start">
                                                <Box
                                                    sx={{
                                                        flexShrink: 0,
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
                                                    {index + 1}
                                                </Box>
                                                <Typography sx={{ pt: 0.35, fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif' }}>
                                                    {step}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Paper>
                            </Stack>
                        </Stack>
                    </Stack>
                </Paper>
            </Box>
        </Box>
    );
}
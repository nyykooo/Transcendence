import { useState, useEffect } from 'react';

import { Box, Typography } from '@mui/material';

import { useParams } from 'react-router-dom';

import { type Recipe } from '../props/recipeProps';

import { getRecipe } from '../api/recipe';

export default function RecipeView() {
    const { name } = useParams<{name: string}>();

    const [recipe, setRecipe] = useState<Recipe | null>(null);

    const [title, setTitle] = useState(recipe?.name || '');

    useEffect(() => {
        const fetchRecipe = async () => {
            const res = await getRecipe(name || '');
            setRecipe(res);
            setTitle(res?.name || 'Recipe not found');
        };
        fetchRecipe();
    }, [name]);

    return (
        <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
            <Typography variant="h2">{title}</Typography>
        </Box>
    );
}
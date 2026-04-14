import { useState, useEffect } from 'react';

import { Box, Stack, Typography } from '@mui/material';

import { Logo } from '../components/components';

import { useParams } from 'react-router-dom';

import { type Recipe } from '../props/recipeProps';

import { getRecipe } from '../api/recipe';

export default function RecipeView() {
    const { name } = useParams<{name: string}>();

    const [recipe, setRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            const res = await getRecipe(name || '');
            setRecipe(res);
        };
        fetchRecipe();
    }, [name]);

    return (
        <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
            <Typography variant="h2">{recipe?.name || 'Empty Recipe name'}</Typography>
            <Stack sx={{display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center'}}>
                <Logo size={300} path={recipe?.image || ''}/>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                    <Typography variant="h4">Ingridients:</Typography>
                    {recipe?.ingridients?.map((ingridient, index) => (
                        <Typography key={index}>{`${ingridient.quantity} ${ingridient.unit} of ${ingridient.name}`}</Typography>
                    ))}
                    <Typography variant="h4">Instructions:</Typography>
                    <Typography>{recipe?.instructions}</Typography>
                </Box>
            </Stack>
        </Box>
    );
}
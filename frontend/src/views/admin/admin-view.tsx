// import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useAuth } from '../../components/AuthProvider';
import { RoleBaseGuard, ErrorPage } from '../../components/components';
// import { getPendingRecipes } from '../../api/admin';
// import { type PendingRecipe, type PendingRecipesResponse } from '../../props/recipe-list';

export default function AdminView()
{
    const { user } = useAuth();

    // const [rows, setRows] = useState<PendingRecipe[]>([]);

    // const [isLoading, setIsLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);

    // useEffect(() => {
    //     const loadPendingRecipes = async () => {
    //         if (!user?.token) {
    //             setError('Missing authentication token. Please sign in again.');
    //             setRows([]);
    //             setIsLoading(false);
    //             return;
    //         }

    //         setIsLoading(true);
    //         setError(null);

    //         try {
    //             const response: PendingRecipesResponse = await getPendingRecipes(user.token);
    //             const mappedRows: PendingRecipe[] = response.recipes.map((recipe: PendingRecipe) => ({
    //                 recipe_name: recipe.recipe_name,
    //                 ingredient_name: recipe.ingredient_name,
    //                 diet: recipe.diet,
    //                 author: recipe.author,
    //                 status: recipe.status,
    //                 submission_date: recipe.submission_date,
    //             }));

    //             setRows(mappedRows);
    //         } catch (err) {
    //             const message = err instanceof Error ? err.message : 'Failed to load recipes';
    //             setError(message);
    //             setRows([]);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }

    //     loadPendingRecipes();
    // }, [user?.token]);

    return (
        <RoleBaseGuard role={user?.role} 
            children={
                <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
                    <h1>Admin View</h1>
                    <p>Only admin users can access this view.</p>
                    <h2>Pending Recipes</h2>
                    <p>Here you can review and approve or reject pending recipes submitted by users.</p>
                </Box>
            }
            protection={
                <ErrorPage message="You do not have permission to access this page." />
            }
        />
    );
}
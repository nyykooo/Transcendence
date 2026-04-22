// import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useAuth } from '../../components/AuthProvider';
import { RoleBaseGuard, ErrorPage } from '../../components/components';

export default function AdminView()
{
    const { user } = useAuth();

    // const [rows, setRows] = useState<PendingRecipeRow[]>([]);

    // const [isLoading, setIsLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);

    // useEffect(() => {
    //     if (!user?.token) {
    //         setError('Missing authentication token. Please sign in again.');
    //         setRows([]);
    //         setIsLoading(false);
    //         return;
    //     }

    //     setIsLoading(true);
    //     setError(null);

    //     try {
    //         const recipes = await getPendingRecipes(user.token);
    //         const mappedRows: PendingRecipeRow[] = recipes.map((recipe: PendingRecipe) => ({
    //             recipe_name: recipe.recipe_name,
    //             ingredient_name: recipe.ingredient_name,
    //             diet: recipe.diet,
    //             cost: recipe.cost,
    //             portions: recipe.portions,
    //             liked: recipe.liked,
    //             viewed: recipe.viewed,
    //         }));

    //         setRows(mappedRows);
    //     } catch (err) {
    //         const message = err instanceof Error ? err.message : 'Failed to load recipes';
    //         setError(message);
    //         setRows([]);
    //     } finally {
    //         setIsLoading(false);
    //     }
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
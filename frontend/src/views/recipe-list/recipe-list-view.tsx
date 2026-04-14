import { useEffect, useState } from 'react';

import { Alert, Box, CircularProgress, Typography } from '@mui/material';

import { DataGrid, type GridColDef } from '@mui/x-data-grid';

import RecipeListTableToolbar from './recipe-list-table-toolbar';
import { useAuth } from '../../components/AuthProvider';
import { getRecipes, type Recipe } from '../../api/recipes_list';

type RecipeRow = {
    recipe_name: string;
    ingridient_name: string;
    diet: string;
    cost: number;
    portions: number;
    liked: number;
    viewed: number;
};

export default function RecipeListView() {
    const { user } = useAuth();
    const [rows, setRows] = useState<RecipeRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRecipes = async () => {
            if (!user?.token) {
                setError('Missing authentication token. Please sign in again.');
                setRows([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const recipes = await getRecipes(user.token);
                const mappedRows: RecipeRow[] = recipes.map((recipe: Recipe) => ({
                    recipe_name: recipe.recipe_name,
                    ingridient_name: recipe.ingridient_name,
                    diet: recipe.diet,
                    cost: recipe.cost,
                    portions: recipe.portions,
                    liked: recipe.liked,
                    viewed: recipe.viewed,
                }));

                setRows(mappedRows);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load recipes';
                setError(message);
                setRows([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadRecipes();
    }, [user?.token]);

    // updateFilters

    const columns: GridColDef<RecipeRow>[] = [
    {
        field: 'recipe_name',
        headerName: 'Recipe Name',
        flex: 1,
    },
    {
        field: 'ingridient_name',
        headerName: 'Ingredient Name',
        flex: 2,
    },
    {
        field: 'diet',
        headerName: 'Diet',
        flex: 1,
    },
    {
        field: 'cost',
        headerName: 'Cost',
        flex: 1,
    },
    {
        field: 'portions',
        headerName: 'Portions',
        flex: 1,
    },
 
    ];

    return (
        <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
            <RecipeListTableToolbar/> {/*passar a updateFilters como prop (callback)*/}
            {error && (
                <Alert severity='error' sx={{ width: '100%' }}>
                    {error}
                </Alert>
            )}
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row: RecipeRow) => `${row.recipe_name}-${row.ingridient_name}`}
                    loading={isLoading}
                    slots={{
                        loadingOverlay: () => (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <CircularProgress size={28} />
                            </Box>
                        ),
                        noRowsOverlay: () => (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <Typography variant='body2'>No recipes available.</Typography>
                            </Box>
                        ),
                    }}
                    initialState={{
                    pagination: {
                        paginationModel: {
                        pageSize: 5,
                        },
                    },
                    }}
                    pageSizeOptions={[5]}
                    disableRowSelectionOnClick
                />
            </Box>
        </Box>
    );
}
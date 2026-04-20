import { useEffect, useState } from 'react';

import { Alert, Box, CircularProgress, Typography } from '@mui/material';

import { DataGrid, type GridColDef } from '@mui/x-data-grid';

import RecipeListTableToolbar from './recipe-list-table-toolbar';
import { useAuth } from '../../components/AuthProvider';
import { getRecipes} from '../../api/recipes_list';
import { type Recipe, type RecipeListFiltersProps, type RecipeRow } from '../../props/recipe-list';


export default function RecipeListView() {
    const { user } = useAuth();
    const [rows, setRows] = useState<RecipeRow[]>([]);
    const [defaultFilters, setDefaultFilters] = useState<RecipeListFiltersProps>({
        recipes: [],
        ingridients: [],
        diets: [],
        cost: {
            min: 0,
            max: 0,
        },
        servings: {
            min: 0,
            max: 0,
        }
    });
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

    useEffect(() => {
        const dietOptions: string[] = Array.from<string>(
            new Set<string>(
                rows
                    .map((row: RecipeRow) => row.diet)
                    .filter((diet: string) => diet.trim() !== ''),
            ),
        ).sort((a: string, b: string) => a.localeCompare(b));

        const ingredientOptions: string[] = Array.from<string>(
            new Set<string>(
                rows
                    .flatMap((row: RecipeRow) =>
                        row.ingridient_name
                            .split(',')
                            .map((ingredient: string) => ingredient.trim())
                            .filter((ingredient: string) => ingredient !== ''),
                    ),
            ),
        ).sort((a: string, b: string) => a.localeCompare(b));

        const nameOptions: string[] = Array.from<string>(
            new Set<string>(
                rows
                    .map((row: RecipeRow) => row.recipe_name)
                    .filter((name: string) => name.trim() !== ''),
            ),
        ).sort((a: string, b: string) => a.localeCompare(b));

        const costs = rows.map((row: RecipeRow) => Number(row.cost)).filter(cost => !isNaN(cost));
        const portions = rows.map((row: RecipeRow) => Number(row.portions)).filter(portion => !isNaN(portion));

        const _defaultFilters = {
            recipes: nameOptions,
            ingridients: ingredientOptions,
            diets: dietOptions,
            cost: {
                min: costs.length > 0 ? Math.min(...costs) : 0,
                max: costs.length > 0 ? Math.max(...costs) : 0,
            },
            servings: {
                min: portions.length > 0 ? Math.min(...portions) : 0,
                max: portions.length > 0 ? Math.max(...portions) : 0,
            }
        };
        console.log('Extracted default filters: ', _defaultFilters);
        setDefaultFilters(_defaultFilters);
    }, [rows]);

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
            <RecipeListTableToolbar 
                defaultFilters={defaultFilters}
            /> {/*passar a updateFilters como prop (callback)*/}
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
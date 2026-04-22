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
    const [filteredRows, setFilteredRows] = useState<RecipeRow[]>([]);
    const [defaultFilters, setDefaultFilters] = useState<RecipeListFiltersProps>({
        recipes: [],
        ingredients: [],
        diets: [],
        cost: {
            min: 0,
            max: 10,
        },
        servings: {
            min: 0,
            max: 10,
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
                    ingredient_name: recipe.ingredient_name,
                    diet: recipe.diet,
                    cost: recipe.cost,
                    portions: recipe.portions,
                    liked: recipe.liked,
                    viewed: recipe.viewed,
                }));

                setRows(mappedRows);
                setFilteredRows(mappedRows);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load recipes';
                setError(message);
                setRows([]);
                setFilteredRows([]);
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
                        row.ingredient_name
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
            ingredients: ingredientOptions,
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
        setDefaultFilters(_defaultFilters);
    }, [rows]);

    // handle search
    function handleSearch(selectedFilters: RecipeListFiltersProps | null | undefined) {
        if (!selectedFilters) {
            // fazer um tratamento de erro melhor aqui, talvez mostrar um alerta ou algo do tipo
            setFilteredRows(rows);
            return;
        }
        const filtered: RecipeRow[] = rows.filter((row: RecipeRow) => {
            const matchesRecipe = selectedFilters.recipes.length === 0 || selectedFilters.recipes.includes(row.recipe_name);
            const matchesDiet = selectedFilters.diets.length === 0 || selectedFilters.diets.includes(row.diet);
            const matchesIngredient =
                selectedFilters.ingredients.length === 0 ||
                row.ingredient_name.split(',').some(ingredient => selectedFilters.ingredients.includes(ingredient.trim()));
            const matchesCost =
                (isNaN(Number(row.cost)) || (Number(row.cost) >= selectedFilters.cost.min && Number(row.cost) <= selectedFilters.cost.max));
            const matchesPortions =
                (isNaN(Number(row.portions)) || (Number(row.portions) >= selectedFilters.servings.min && Number(row.portions) <= selectedFilters.servings.max));

            return matchesRecipe && matchesDiet && matchesIngredient && matchesCost && matchesPortions;
        });
        setFilteredRows(filtered);
    }

    const columns: GridColDef<RecipeRow>[] = [
        {
            field: 'recipe_name',
            headerName: 'Recipe Name',
            flex: 1,
        },
        {
            field: 'ingredient_name',
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
                handleSearch={handleSearch}
            /> {/*passar a updateFilters como prop (callback)*/}
            {error && (
                <Alert severity='error' sx={{ width: '100%' }}>
                    {error}
                </Alert>
            )}
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    getRowId={(row: RecipeRow) => `${row.recipe_name}-${row.ingredient_name}`}
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
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    disableRowSelectionOnClick
                />
            </Box>
        </Box>
    );
}
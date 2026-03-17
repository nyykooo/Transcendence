import { Box } from '@mui/material';

import { DataGrid, type GridColDef } from '@mui/x-data-grid';

import RecipeListTableToolbar from './recipe-list-table-toolbar';

export default function RecipeListView() {

    // mock data for testing, replace with actual data fetching logic
    const rows = [
    { id: 1, name: 'Recipe 1', ingridients: 'Ingredient 1, Ingredient 2, Ingredient 3', diet: 'Vegetarian', cost: 10.99, portions: 4 },
    { id: 2, name: 'Recipe 2', ingridients: 'Ingredient 3, Ingredient 4', diet: 'Vegan', cost: 15.50, portions: 6 },
    { id: 3, name: 'Recipe 3', ingridients: 'Ingredient 5, Ingredient 6', diet: 'Keto', cost: 12.75, portions: 5 },
    { id: 4, name: 'Recipe 4', ingridients: 'Ingredient 7, Ingredient 8', diet: 'Paleo', cost: 18.25, portions: 8 },
    { id: 5, name: 'Recipe 5', ingridients: 'Ingredient 9, Ingredient 10', diet: 'Gluten-Free', cost: 20.00, portions: 10 },
    { id: 6, name: 'Recipe 6', ingridients: 'Ingredient 11, Ingredient 12', diet: 'Low-Carb', cost: 25.50, portions: 12 },
    ];

    // updateFilters

    const columns: GridColDef<(typeof rows)[number]>[] = [
    {
        field: 'name',
        headerName: 'Name',
        flex: 1,
        editable: true,
    },
    {
        field: 'ingridients',
        headerName: 'Ingredients',
        flex: 2,
        editable: true,
    },
    {
        field: 'diet',
        headerName: 'Diet',
        flex: 1,
    },
    {
        field: 'cost',
        headerName: 'Cost',
        type: 'number',
        flex: 1,
        editable: true,
    },
    {
        field: 'portions',
        headerName: 'Portions',
        type: 'number',
        flex: 1,
        editable: true,
    },
    ];

    return (
        <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
            <RecipeListTableToolbar/> {/*passar a updateFilters como prop (callback)*/}
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
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
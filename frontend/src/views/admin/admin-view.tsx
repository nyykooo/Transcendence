import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useAuth } from '../../components/AuthProvider';
import { RoleBaseGuard, ErrorPage } from '../../components/components';
import { getPendingRecipes, getAllUsers, deleteUser } from '../../api/admin';
import { type PendingRecipe, type PendingRecipesResponse } from '../../props/recipe-list';
import { type UserRows, type AllUsersResponse } from '../../props/userProps';

export default function AdminView()
{
    const { user } = useAuth();

    const [pendingRecipesRows, setPendingRecipesRows] = useState<PendingRecipe[]>([]);

    const [usersRows, setUsersRows] = useState<UserRows[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadPendingRecipesAsync = async () => {
        if (!user?.token) {
            setError('Missing authentication token. Please sign in again.');
            setPendingRecipesRows([]);
            return;
        }
        const responsePendingRecipes: PendingRecipesResponse = await getPendingRecipes(user.token);
        const mappedRows: PendingRecipe[] = responsePendingRecipes.recipes.map((recipe: PendingRecipe) => ({
            recipe_name: recipe.recipe_name,
            ingredient_name: recipe.ingredient_name,
            diet: recipe.diet,
            author: recipe.author,
            status: recipe.status,
            submission_date: recipe.submission_date,
        }));

        setPendingRecipesRows(mappedRows);
    };

    const loadUsers = async () => {
        if (!user?.token) {
            setError('Missing authentication token. Please sign in again.');
            setUsersRows([]);
            return;
        }

        const responseUsers: AllUsersResponse = await getAllUsers(user.token);
        const mappedUsersRows: UserRows[] = responseUsers.users.map((user: UserRows) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            is_active: user.is_active,
            token: user.token,
        }));
        setUsersRows(mappedUsersRows);
    };

    useEffect(() => {
        const loadPendingRecipes = async () => {
            if (!user?.token) {
                setError('Missing authentication token. Please sign in again.');
                setPendingRecipesRows([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                await loadPendingRecipesAsync();
                await loadUsers();
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load recipes';
                setError(message);
                setPendingRecipesRows([]);
            } finally {
                setIsLoading(false);
            }
        }

        loadPendingRecipes();
    }, [user?.token]);

    function handleDeleteUser(userId: number) {
        const deleteUserAsync = async () => {
            try
            {
                if (!user?.token) {
                    setError('Missing authentication token. Please sign in again.');
                    return;
                }

                setIsLoading(true);
                setError(null);

                await deleteUser(user.token, userId);
                await loadUsers();
            }
            catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load recipes';
                setError(message);
                setPendingRecipesRows([]);
            } finally {
                setIsLoading(false);
            }
        }

        deleteUserAsync();
        setUsersRows(prev => prev.filter(user => user.id !== userId));
    }
    
    const pendingRecipesColumns: GridColDef<PendingRecipe>[] = [
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
            field: 'author',
            headerName: 'Author',
            flex: 1,
        },
        {
            field: 'submission_date',
            headerName: 'Submission Date',
            flex: 1,
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
        },
    ];

    const usersColumns: GridColDef<UserRows>[] = [
        {
            field: 'name',
            headerName: 'User Name',
            flex: 1,
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
        },
        {
            field: 'role',
            headerName: 'Role',
            flex: 1,
        },
        {
            field: 'is_active',
            headerName: 'Active',
            flex: 1,
            renderCell: (params) => (
                <Typography variant='body2' color={params.value ? 'green' : 'red'}>
                    {params.value ? 'Yes' : 'No'}
                </Typography>
            ),
        },
        {
            headerName: 'Actions',
            field: 'actions',
            flex: 1,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* Implement action buttons like Edit, Deactivate, etc. */}
                    <button>Edit</button>
                    <button onClick={() => handleDeleteUser(params.row.id)}>Delete</button>
                </Box>
            ),
        }
    ];

    return (
        <RoleBaseGuard role={user?.role} 
            children={
                <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
                    <h1>Admin View</h1>
                    <p>Only admin users can access this view.</p>
                    <h2>Pending Recipes</h2>
                    <p>Here you can review and approve or reject pending recipes submitted by users.</p>
                    {error && (
                        <Alert severity='error' sx={{ width: '100%' }}>
                            {error}
                        </Alert>
                    )}
                    <Typography variant='body2' color='textSecondary'>
                        {`Pending Recipes`}
                    </Typography>
                    <DataGrid
                        rows={pendingRecipesRows}
                        columns={pendingRecipesColumns}
                        getRowId={(row: PendingRecipe) => `${row.recipe_name}-${row.ingredient_name}`}
                        loading={isLoading}
                        slots={{
                            loadingOverlay: () => (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                                    <CircularProgress size={28} />
                                </Box>
                            ),
                            noRowsOverlay: () => (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
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
                    <Typography variant='body2' color='textSecondary'>
                        {`Users`}
                    </Typography>
                    <DataGrid
                        rows={usersRows}
                        columns={usersColumns}
                        getRowId={(row: UserRows) => `${row.id}`}
                        loading={isLoading}
                        slots={{
                            loadingOverlay: () => (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                    <CircularProgress size={28} />
                                </Box>
                            ),
                            noRowsOverlay: () => (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                    <Typography variant='body2'>No users available.</Typography>
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
            }
            protection={
                <ErrorPage message="You do not have permission to access this page." />
            }
        />
    );
}
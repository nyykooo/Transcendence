import { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, MenuItem, Select, type SelectChangeEvent, Typography, Tabs, Tab, useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useAuth } from '../../components/AuthProvider';
import { RoleBaseGuard, ErrorPage } from '../../components/components';
import { getPendingRecipes, getAllUsers, deleteUser, updateUserRole, aprovePendingRecipe, reprovePendingRecipe } from '../../api/admin';
import AdminFileManagement from '../../components/AdminFileManagement';
import { type PendingRecipe, type PendingRecipesResponse } from '../../props/recipe-list';
import { type UserRows, type AllUsersResponse } from '../../props/userProps';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Tooltip, IconButton } from '@mui/material';

export default function AdminView()
{
    const theme = useTheme();

    const { user } = useAuth();

    const [pendingRecipesRows, setPendingRecipesRows] = useState<PendingRecipe[]>([]);

    const [usersRows, setUsersRows] = useState<UserRows[]>([]);
    
    const [tabValue, setTabValue] = useState(0);

    const ROLE_OPTIONS = ['user', 'admin'];

    const [editedRoles, setEditedRoles] = useState<Record<number, string>>({});

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);
    const [selectedRecipeInstructions, setSelectedRecipeInstructions] = useState<{ name: string; instructions: string } | null>(null);

    const handleRoleChange = (userId: number) => (event: SelectChangeEvent<string>) => {
        setEditedRoles(prev => ({ ...prev, [userId]: event.target.value }));
    };

    const handleViewInstructions = (recipe: PendingRecipe) => {
        setSelectedRecipeInstructions({
            name: recipe.recipe_name,
            instructions: recipe.instructions
        });
        setInstructionsModalOpen(true);
    };

    const handleCloseInstructionsModal = () => {
        setInstructionsModalOpen(false);
        setSelectedRecipeInstructions(null);
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

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
            created_at: recipe.created_at,
            instructions: recipe.instructions,
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

    const handleUpdateUserRole = async (userId: number) => {
        const row = usersRows.find(row => row.id === userId);
        if (!row) return;

        const newRole = editedRoles[userId] ?? row.role;
        if (newRole === row.role) return;

        if (!user?.token) {
            setError('Missing authentication token. Please sign in again.');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            await updateUserRole(user.token, userId, newRole);
            await loadUsers();
            setEditedRoles(prev => {
            const next = { ...prev };
            delete next[userId];
            return next;
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update user role');
        } finally {
            setIsLoading(false);
        }
    };


    function handleAprovePendingRecipe(name: string) {
        const aprovePendingRecipeAsync = async () => {
            try
            {
                if (!user?.token) {
                    setError('Missing authentication token. Please sign in again.');
                    return;
                }

                setIsLoading(true);
                setError(null);

                await aprovePendingRecipe(user.token, name);
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

        aprovePendingRecipeAsync();
        setPendingRecipesRows(prev => prev.filter(recipe => recipe.recipe_name !== name));
    };

    function handleReprovePendingRecipe(name: string) {
        const reprovePendingRecipeAsync = async () => {
            try
            {
                if (!user?.token) {
                    setError('Missing authentication token. Please sign in again.');
                    return;
                }

                setIsLoading(true);
                setError(null);

                await reprovePendingRecipe(user.token, name);
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

        reprovePendingRecipeAsync();
        setPendingRecipesRows(prev => prev.filter(recipe => recipe.recipe_name !== name));
    }
    
    const pendingRecipesColumns: GridColDef<PendingRecipe>[] = [
        {
            field: 'recipe_name',
            headerName: 'Recipe Name',
            flex: 1,
            minWidth: 130,
        },
        {
            field: 'ingredient_name',
            headerName: 'Ingredient Name',
            flex: 2,
            minWidth: 130,
        },
        {
            field: 'diet',
            headerName: 'Diet',
            flex: 1,
            minWidth: 130,
        },
        {
            field: 'author',
            headerName: 'Author',
            flex: 1,
            minWidth: 130,
        },
        {
            field: 'created_at',
            headerName: 'Submission Date',
            flex: 1,
            minWidth: 130,
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            minWidth: 130,
        },
        {
            headerName: 'View Instructions',
            field: 'instructions_button',
            flex: 1,
            minWidth: 80,
            renderCell: (params) => (
                <Tooltip title="View Instructions">
                    <IconButton
                    size="small"
                    color="info"
                    onClick={() => handleViewInstructions(params.row)}
                    >
                    <VisibilityIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            ),
        },
        {
            headerName: 'Actions',
            field: 'actions',
            flex: 1,
            minWidth: 100,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Approve">
                    <IconButton
                    size="small"
                    color="success"
                    onClick={() => handleAprovePendingRecipe(params.row.recipe_name)}
                    sx={{ display: { xs: 'inline-flex',  md: 'inline-flex', lg: 'none' } }}
                    >
                    <CheckIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Reprove">
                    <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleReprovePendingRecipe(params.row.recipe_name)}
                    sx={{ display: { xs: 'inline-flex', md: 'inline-flex', lg: 'none' } }}
                    >
                    <CloseIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Button
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={() => handleAprovePendingRecipe(params.row.recipe_name)}
                    sx={{ display: { xs: 'none', md: 'none', lg: 'inline-flex' } }}
                >
                    Approve
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleReprovePendingRecipe(params.row.recipe_name)}
                    sx={{ display: { xs: 'none', md: 'none', lg: 'inline-flex' } }}
                >
                    Reprove
                </Button>
                </Box>
            ),
            }
    ];

    const usersColumns: GridColDef<UserRows>[] = [
        {
            field: 'name',
            headerName: 'User Name',
            flex: 1,
            minWidth: 130,
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            minWidth: 130,
        },
        
        {
            field: 'role',
            headerName: 'Role',
            flex: 1,
            minWidth: 130,
            renderCell: (params) => {
                const currentRole = (editedRoles[params.row.id] ?? params.row.role) as string;
                return (
                    <Select
                    value={currentRole}
                    onChange={handleRoleChange(params.row.id)}
                    size="small"
                    onOpen={(e) => e.stopPropagation()}
                    MenuProps={{
                        disableScrollLock: true,
                        disablePortal: false,
                        keepMounted: false,
                        container: document.body,
                    }}
                    >
                    {ROLE_OPTIONS.map((role) => (
                        <MenuItem key={role} value={role}>
                        {role}
                        </MenuItem>
                    ))}
                    </Select>
                );
                },
        },
        {
            field: 'is_active',
            headerName: 'Active',
            flex: 1,
            minWidth: 130,
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
            minWidth: 100,
            renderCell: (params) => {
                const selectedRole = editedRoles[params.row.id] ?? params.row.role;
                const isChanged = selectedRole !== params.row.role;
                return (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {/* Mobile: ícones */}
                    <Tooltip title="Update">
                    <span> {/* span necessário para o Tooltip funcionar com botão disabled */}
                        <IconButton
                        size="small"
                        color="success"
                        disabled={!isChanged}
                        onClick={() => handleUpdateUserRole(params.row.id)}
                        sx={{ display: { xs: 'inline-flex', md: 'inline-flex', lg: 'none' } }}
                        >
                        <SaveIcon fontSize="small" />
                        </IconButton>
                    </span>
                    </Tooltip>
                    <Tooltip title="Delete">
                    <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteUser(params.row.id)}
                        sx={{ display: { xs: 'inline-flex', md: 'inline-flex', lg: 'none' } }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                    </Tooltip>

                    {/* Desktop: botões com texto */}
                    <Button
                    variant="contained"
                    size="small"
                    color="success"
                    disabled={!isChanged}
                    onClick={() => handleUpdateUserRole(params.row.id)}
                    sx={{ display: { xs: 'none', md: 'none', lg: 'inline-flex' } }}
                    >
                    Update
                    </Button>
                    <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleDeleteUser(params.row.id)}
                    sx={{ display: { xs: 'none', md: 'none', lg: 'inline-flex' } }}
                    >
                    Delete
                    </Button>
                </Box>
                );
            },
        }
    ];

    return (
        <RoleBaseGuard role={user?.role} 
            children={
                <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
                    {error && (
                        <Alert severity='error' sx={{ width: '100%' }}>
                            {error}
                        </Alert>
                    )}
                    
                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant={isMobile ? 'fullWidth' : 'standard'}
                            scrollButtons="auto"
                        >
                            <Tab
                                label={isMobile ? '📋' : '📋 Pending Recipes'}
                                title="Pending Recipes"
                                sx={{ minWidth: isMobile ? 'unset' : undefined }}
                            />
                            <Tab
                                label={isMobile ? '👥' : '👥 Users'}
                                title="Users"
                                sx={{ minWidth: isMobile ? 'unset' : undefined }}
                            />
                            <Tab
                                label={isMobile ? '📁' : '📁 File Management'}
                                title="File Management"
                                sx={{ minWidth: isMobile ? 'unset' : undefined }}
                            />
                        </Tabs>
                    </Box>


                    {/* Tab Content - Pending Recipes */}
                    {tabValue === 0 && (
                    <>
                        <Typography variant='h2' color='secondary' sx={{ mt: 4 }}>
                            {`Pending Recipes`}
                        </Typography>
                        <Box sx={{ width: '90vw', overflowX: 'auto' }}>
                            <DataGrid
                                sx={{
                                    flex: 1,
                                    minWidth: 130,
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                }}
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
                        </Box>
                    </>
                    )}

                    {/* Tab Content - Users */}
                    {tabValue === 1 && (
                    <>
                        <Typography variant='h2' color='secondary' sx={{ mt: 4 }}>
                            {`Users`}
                        </Typography>
                        <Box sx={{ width: '90vw', overflowX: 'auto'  }}>
                            <DataGrid
                                sx={{ width: '100%', flex: 1 }}
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
                                disableVirtualization
                                onCellClick={(_, event) => event.stopPropagation()}
                            />
                        </Box>
                    </>
                    )}

                    {/* Tab Content - File Management */}
                    {tabValue === 2 && (
                    <AdminFileManagement />
                    )}

                    {/* Instructions Modal */}
                    <Dialog
                        open={instructionsModalOpen}
                        onClose={handleCloseInstructionsModal}
                        maxWidth="md"
                        fullWidth
                    >
                        <DialogTitle>
                            Recipe Instructions: {selectedRecipeInstructions?.name}
                        </DialogTitle>
                        <DialogContent sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', pt: 2 }}>
                            {selectedRecipeInstructions?.instructions || 'No instructions available'}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseInstructionsModal} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            }
            protection={
                <ErrorPage message="You do not have permission to access this page." />
            }
        />
    );
}
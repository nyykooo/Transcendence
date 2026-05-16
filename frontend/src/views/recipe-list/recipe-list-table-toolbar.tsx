import { useEffect, useState } from 'react';

import { Box, Stack, Button, type SelectChangeEvent, Paper } from '@mui/material';

import { MultipleSelect, SliderSelector, MultipleAutoComplete, Logo } from '../../components/components';

import { images } from '../../configs/images';

import { type RecipeListFiltersProps } from '../../props/recipe-list'

type RecipeListTableToolbarProps = {
    defaultFilters: RecipeListFiltersProps;
    handleSearch: (selectedFilters: RecipeListFiltersProps | null | undefined) => void;
};

export default function RecipeListTableToolbar({ defaultFilters, handleSearch }: RecipeListTableToolbarProps) {
    const safeCostMax = Number.isFinite(defaultFilters.cost?.max)
        ? Math.max(1, defaultFilters.cost.max)
        : 10;
    const safeServingMax = Number.isFinite(defaultFilters.servings?.max)
        ? Math.max(1, defaultFilters.servings.max)
        : 10;

    // SelectedFilters
    const [selectedFilters, setSelectedFilters] = useState<RecipeListFiltersProps | null>();

    const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
    
    const handleChangeDiet = (event: SelectChangeEvent<typeof defaultFilters.diets>) => {
        const {
            target: { value },
        } = event;
        setSelectedDiets(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split('.') : value,
        );
    };

    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

    const handleChangeIngredients = (event: SelectChangeEvent<typeof defaultFilters.ingredients>) => {
        const {
            target: { value },
        } = event;
        setSelectedIngredients(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };


    // ### Cost ###
    const [selectedCost, setSelectedCost] = useState<number[]>([0, safeCostMax]);

    useEffect(() => {
        setSelectedCost([0, safeCostMax]);
    }, [safeCostMax]);

    const handleChangeselectedCost = (_event: Event, newValue: number | number[], activeThumb: number) => {
        if (!Array.isArray(newValue)) return;
        if (activeThumb === 0) {
            setSelectedCost([Math.min(newValue[0], selectedCost[1] - 0.1), selectedCost[1]]);
        } else {
            setSelectedCost([selectedCost[0], Math.max(newValue[1], selectedCost[0] + 0.1)]);
        }
        // event.preventDefault();
    };

    // ### Serving ###
    const [selectedServing, setSelectedServing] = useState<number[]>([0, safeServingMax]);

    useEffect(() => {
        setSelectedServing([0, safeServingMax]);
    }, [safeServingMax]);

    const handleChangeSelectedServing = (_event: Event, newValue: number | number[], activeThumb: number) => {
        if (!Array.isArray(newValue)) return;
        if (activeThumb === 0) {
            setSelectedServing([Math.min(newValue[0], selectedServing[1] - 1), selectedServing[1]]);
        } else {
            setSelectedServing([selectedServing[0], Math.max(newValue[1], selectedServing[0] + 1)]);
        }
        // event.preventDefault();
    };

    const recipes = defaultFilters.recipes ?? [];

    const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);

    const handleChangeRecipes = ( _event: React.SyntheticEvent, newValue: string[] ) => {
        setSelectedRecipes(newValue);
    };

    // ### Buttons ###
    const handleSearchButton = () =>
    {
        const _selectedFilters: RecipeListFiltersProps = {
            recipes: selectedRecipes,
            diets: selectedDiets,
            ingredients: selectedIngredients,
            cost: {
                min: selectedCost[0],
                max: selectedCost[1]
            },
            servings: {
                min: selectedServing[0],
                max: selectedServing[1]
            }
        };
        setSelectedFilters(_selectedFilters);
    }

    useEffect(() => {
        handleSearch(selectedFilters);
    }, [selectedFilters]);


    const handleCleanFilters = () =>
    {
        setSelectedCost([0, safeCostMax]);
        setSelectedServing([0, safeServingMax]);
        setSelectedRecipes([]);
        setSelectedDiets([]);
        setSelectedIngredients([]);
        setSelectedFilters(defaultFilters);
    }

    useEffect (() => {
        setSelectedCost([0, safeCostMax]);
        setSelectedServing([0, safeServingMax]);
    }, [safeCostMax, safeServingMax]);

    
    return (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2.5, md: 4 },
                    width: '90vw',
                    borderRadius: 6,
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    boxShadow: '0 30px 80px rgba(15, 23, 42, 0.08)',
                    background: 'linear-gradient(150deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.8) 100%)',
                    backdropFilter: 'blur(3px)',
                }}
            >
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    useFlexGap
                >
                    {/* Name */}
                    <Box sx={{ flex: { xs: '1 1 100%', md: '2 1 200px', width: '90%' } }}>
                        <MultipleAutoComplete<string>
                            id="customized-hook-demo"
                            options={recipes}
                            getOptionLabel={(option) => option}
                            onChange={handleChangeRecipes}
                            value={selectedRecipes ?? []}
                        />
                    </Box>

                    {/* Diet */}
                    <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 140px', width: '90%' } }}>
                        <MultipleSelect
                            name="Diets"
                            options={defaultFilters.diets}
                            selectedOptions={selectedDiets}
                            onChange={handleChangeDiet}
                        />
                    </Box>

                    {/* Ingredients */}
                    <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 140px', width: '90%' } }}>
                        <MultipleSelect
                            name="Ingredients"
                            options={defaultFilters.ingredients}
                            selectedOptions={selectedIngredients}
                            onChange={handleChangeIngredients}
                        />
                    </Box>

                    {/* Sliders */}
                    <Stack
                        direction="column"
                        spacing={1}
                        sx={{ flex: { xs: '1 1 100%', md: '1 1 180px' } }}
                    >
                        <SliderSelector
                            value={selectedCost}
                            valueText="€"
                            onChange={handleChangeselectedCost}
                            min={0}
                            max={safeCostMax}
                            name="Cost"
                            step={0.1}
                        />
                        <SliderSelector
                            value={selectedServing}
                            valueText="units"
                            onChange={handleChangeSelectedServing}
                            min={0}
                            max={safeServingMax}
                            name="Servings"
                            step={1}
                        />
                    </Stack>

                    {/* Action buttons */}
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            flex: { xs: '1 1 100%', md: '0 0 auto' },
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Button onClick={handleSearchButton}>
                            <Logo size={20} path={images.icons.search} />
                        </Button>
                        <Button onClick={handleCleanFilters}>
                            <Logo size={20} path={images.icons.trash} />
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
}
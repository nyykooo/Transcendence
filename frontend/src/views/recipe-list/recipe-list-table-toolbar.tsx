import { useState } from 'react';

import { Box, Stack, Button, type SelectChangeEvent } from '@mui/material';

import { MultipleSelect, SliderSelector, MultipleAutoComplete, Logo } from '../../components/components';

import { images } from '../../configs/images';

import { type RecipeListFiltersProps } from '../../props/recipe-list'

export default function RecipeListTableToolbar() {

    // SelectedFilters
    const [selectedFilters, setSelectedFilters] = useState<RecipeListFiltersProps | null>();

    // ### Diets ###
    // mock data for testing, replace with actual data fetching logic
    const diets = [
        'Vegetarian',
        'Vegan',
        'Keto',
        'Paleo',
        'Gluten-Free',
        'Low-Carb'
    ];

    const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
    
    const handleChangeDiet = (event: SelectChangeEvent<typeof diets>) => {
        const {
            target: { value },
        } = event;
        setSelectedDiets(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split('.') : value,
        );
    };


    // ### Ingredients ###
    // mock data for testing, replace with actual data fetching logic
    const ingredients = [
        'Ingredient 1',
        'Ingredient 2',
    ];

    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

    const handleChangeIngredients = (event: SelectChangeEvent<typeof ingredients>) => {
        const {
            target: { value },
        } = event;
        setSelectedIngredients(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };


    // ### Cost ###
    const [selectedCost, setSelectedCost] = useState<number[]>([0, 10.0]);

    const handleChangeselectedCost = (event: Event, newValue: number[], activeThumb: number) => {
        if (activeThumb === 0) {
        setSelectedCost([Math.min(newValue[0], selectedCost[1] - 1), selectedCost[1]]);
        } else {
        setSelectedCost([selectedCost[0], Math.max(newValue[1], selectedCost[0] + 1)]);
        }
    };

    
    // ### Serving ###
    const [selectedServing, setSelectedServing] = useState<number[]>([0, 10]);

    const handleChangeSelectedServing = (event: Event, newValue: number[], activeThumb: number) => {
        if (activeThumb === 0) {
        setSelectedServing([Math.min(newValue[0], selectedServing[1] - 1), selectedServing[1]]);
        } else {
        setSelectedServing([selectedServing[0], Math.max(newValue[1], selectedServing[0] + 1)]);
        }
    };



    // ### Recipes ###
    // mock data for testing, replace with actual data fetching logic
    const recipes = [
        'Banana',
        'Apple',
        'Mango',
        'Pear',
        'Grape',
    ];

    const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);

    const handleChangeRecipes = ( _event: React.SyntheticEvent, newValue: string[] ) => {
        setSelectedRecipes(newValue); // newValue = array completo dos itens selecionados
    };

    // ### Buttons ###
    const handleSearch = () =>
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
        }
    }
    const handleCleanFilters = () =>
    {
        setSelectedCost([0, 10]);
        setSelectedServing([0, 10]);
        setSelectedRecipes([]);
        setSelectedDiets([]);
        setSelectedIngredients([]);
        setSelectedFilters(null);
    }

    return (
        <Box sx={{width: '100%', height: '20%'}}>
            <Stack direction="row" spacing={2}>
                {/*Name == MultipleAutoComplete*/}
                <MultipleAutoComplete<string>
                    id="customized-hook-demo"
                    options={recipes}
                    getOptionLabel={(option) => option}
                    onChange={handleChangeRecipes}
                    value={selectedRecipes ?? []}
                />
                {/* Diet == Multiple Select */}
                <MultipleSelect 
                    name="Diets"
                    options={diets}
                    selectedOptions={selectedDiets}
                    onChange={handleChangeDiet}
                />
                {/* Ingredients == Multiple Select */}
                <MultipleSelect 
                    name="Ingredients"
                    options={ingredients}
                    selectedOptions={selectedIngredients}
                    onChange={handleChangeIngredients}
                />
                <Stack direction="column" spacing={1} sx={{width: '30%'}}>
                    {/* selectedCost == Slider Selector */}
                    <SliderSelector
                        value={selectedCost}
                        valueText="€"
                        onChange={handleChangeselectedCost}
                        min={0}
                        max={10}
                        name='selectedCost'
                    />
                    {/* selectedServing == Slider Selector */}
                    <SliderSelector
                        value={selectedServing}
                        valueText="units"
                        onChange={handleChangeSelectedServing}
                        min={0}
                        max={10}
                        name='selectedServing'
                    />
                </Stack>
                <Button onClick={() => handleSearch()}>
                    <Logo size={20} path={images.icons.search}></Logo>
                </Button>
                <Button onClick={() => handleCleanFilters()}>
                    <Logo size={20} path={images.icons.trash}></Logo>
                </Button>
            </Stack>
        </Box>
    );
}
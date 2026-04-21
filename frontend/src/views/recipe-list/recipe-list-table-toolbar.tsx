import { useEffect, useState } from 'react';

import { Box, Stack, Button, type SelectChangeEvent } from '@mui/material';

import { MultipleSelect, SliderSelector, MultipleAutoComplete, Logo } from '../../components/components';

import { images } from '../../configs/images';

import { type RecipeListFiltersProps } from '../../props/recipe-list'

type RecipeListTableToolbarProps = {
    defaultFilters: RecipeListFiltersProps;
    handleSearch: (selectedFilters: RecipeListFiltersProps | null | undefined) => void;
};

export default function RecipeListTableToolbar({ defaultFilters, handleSearch }: RecipeListTableToolbarProps) {

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

    const handleChangeIngredients = (event: SelectChangeEvent<typeof defaultFilters.ingridients>) => {
        const {
            target: { value },
        } = event;
        setSelectedIngredients(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };


    // ### Cost ###
    const [selectedCost, setSelectedCost] = useState<number[]>([0, defaultFilters.cost?.max ?? 10]);

    useEffect(() => {
        if (defaultFilters.cost && defaultFilters.cost.max > 0) {
            setSelectedCost([0, defaultFilters.cost.max]);
        }
    }, [defaultFilters.cost]);

    const handleChangeselectedCost = (event: Event, newValue: number[], activeThumb: number) => {
        if (activeThumb === 0) {
            setSelectedCost([Math.min(newValue[0], selectedCost[1] - 0.1), selectedCost[1]]);
        } else {
            setSelectedCost([selectedCost[0], Math.max(newValue[1], selectedCost[0] + 0.1)]);
        }
        event.preventDefault();
    };

    // ### Serving ###
    const [selectedServing, setSelectedServing] = useState<number[]>([0, defaultFilters.servings?.max ?? 10]);

    useEffect(() => {
        if (defaultFilters.servings && defaultFilters.servings.max > 0) {
            setSelectedServing([0, defaultFilters.servings.max]);
        }
    }, [defaultFilters.servings]);

    const handleChangeSelectedServing = (event: Event, newValue: number[], activeThumb: number) => {
        if (activeThumb === 0) {
            setSelectedServing([Math.min(newValue[0], selectedServing[1] - 1), selectedServing[1]]);
        } else {
            setSelectedServing([selectedServing[0], Math.max(newValue[1], selectedServing[0] + 1)]);
        }
        event.preventDefault();
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
            ingridients: selectedIngredients,
            cost: {
                min: selectedCost[0],
                max: selectedCost[1]
            },
            servings: {
                min: selectedServing[0],
                max: selectedServing[1]
            }
        }
        console.log(_selectedFilters);
        setSelectedFilters(_selectedFilters);
    }

    useEffect(() => {
        handleSearch(selectedFilters);
    }, [selectedFilters]);


    const handleCleanFilters = () =>
    {
        setSelectedCost([0, defaultFilters.cost?.max ?? 10]);
        setSelectedServing([0, defaultFilters.servings?.max ?? 10]);
        setSelectedRecipes([]);
        setSelectedDiets([]);
        setSelectedIngredients([]);
        setSelectedFilters(defaultFilters);
    }

    useEffect (() => {
        setSelectedCost(defaultFilters.cost ? [0, defaultFilters.cost.max ?? 10] : [0, 10]);
        setSelectedServing(defaultFilters.servings ? [0, defaultFilters.servings.max ?? 10] : [0, 10]);
    }, [defaultFilters]);

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
                    options={defaultFilters.diets}
                    selectedOptions={selectedDiets}
                    onChange={handleChangeDiet}
                />
                {/* Ingredients == Multiple Select */}
                <MultipleSelect 
                    name="Ingredients"
                    options={defaultFilters.ingridients}
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
                        max={defaultFilters.cost?.max ?? 10}
                        name='selectedCost'
                        step={0.1}
                    />
                    {/* selectedServing == Slider Selector */}
                    <SliderSelector
                        value={selectedServing}
                        valueText="units"
                        onChange={handleChangeSelectedServing}
                        min={0}
                        max={defaultFilters.servings?.max ?? 10}
                        name='selectedServing'
                        step={1}
                    />
                </Stack>
                <Button onClick={() => handleSearchButton()}>
                    <Logo size={20} path={images.icons.search}></Logo>
                </Button>
                <Button onClick={() => handleCleanFilters()}>
                    <Logo size={20} path={images.icons.trash}></Logo>
                </Button>
            </Stack>
        </Box>
    );
}
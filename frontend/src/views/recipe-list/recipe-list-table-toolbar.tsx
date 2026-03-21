import { useState } from 'react';

import { Box, Stack, Button, type SelectChangeEvent } from '@mui/material';

import { MultipleSelect, SliderSelector, MultipleAutoComplete, Logo } from '../../components/components';

import { images } from '../../configs/images';

export default function RecipeListTableToolbar() {

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
    const [cost, setCost] = useState<number[]>([0, 10.0]);

    const handleChangeCost = (event: Event, newValue: number[], activeThumb: number) => {
        if (activeThumb === 0) {
        setCost([Math.min(newValue[0], cost[1] - 1), cost[1]]);
        } else {
        setCost([cost[0], Math.max(newValue[1], cost[0] + 1)]);
        }
    };

    
    // ### Portion ###
    const [portion, setPortion] = useState<number[]>([0, 10]);

    const handleChangePortion = (event: Event, newValue: number[], activeThumb: number) => {
        if (activeThumb === 0) {
        setPortion([Math.min(newValue[0], portion[1] - 1), portion[1]]);
        } else {
        setPortion([portion[0], Math.max(newValue[1], portion[0] + 1)]);
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

    const [selectedRecipes, setSelectedRecipes] = useState<string[]>();

    const handleChangeRecipes = ( _event: React.SyntheticEvent, newValue: string[] ) => {
        setSelectedRecipes(newValue); // newValue = array completo dos itens selecionados
    };


    // ### Buttons ###
    const handleSearch = () =>
    {
        
    }

    return (
        <Box sx={{width: '100%', height: '20%'}}>
            <Stack direction="row" spacing={2}>
                {/*Name == MultipleAutoComplete*/}
                <MultipleAutoComplete<string>
                    id="customized-hook-demo"
                    defaultValue={undefined}
                    options={recipes}
                    getOptionLabel={(option) => option}
                    onChange={handleChangeRecipes}
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
                    {/* Cost == Slider Selector */}
                    <SliderSelector
                        value={cost}
                        valueText="€"
                        onChange={handleChangeCost}
                        min={0}
                        max={10}
                        name='Cost'
                    />
                    {/* Portion == Slider Selector */}
                    <SliderSelector
                        value={portion}
                        valueText="units"
                        onChange={handleChangePortion}
                        min={0}
                        max={10}
                        name='Portion'
                    />
                </Stack>
                <Button onClick={() => handleSearch()}>
                    <Logo size={20} path={images.icons.search}></Logo>
                </Button>
                <Logo size={20} path={images.icons.trash}></Logo>
            </Stack>
        </Box>
    );
}
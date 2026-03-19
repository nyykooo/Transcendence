import { useState } from 'react';

import { Box, Stack, type SelectChangeEvent } from '@mui/material';

import { MultipleSelect, SliderSelector, MultipleAutoComplete } from '../../components/components';

interface FilmOptionType {
  title: string;
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  {
    title: 'Banana',
  },
  {
    title: 'Apple',
  },
  {
    title: 'Mango',
  },
  {
    title: 'Pear',
  },
  {
    title: 'Grape',
  },
];

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

    return (
        <Box sx={{width: '100%', height: '20%'}}>
            <Stack direction="row" spacing={2}>
                {/*Name == MultipleAutoComplete*/}
                <MultipleAutoComplete<FilmOptionType>
                    id="customized-hook-demo"
                    defaultValue={[top100Films[1]]}
                    options={top100Films}
                    getOptionLabel={(option) => option.title}
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
            </Stack>
        </Box>
    );
}
import { api } from '../configs/api';

export type Recipe = {
    recipe_name: string;
    ingridient_name: string;
    quantity: string | number | null;
};

type RecipesResponse = {
    count: number;
    recipes: Recipe[];
};

export async function getRecipes(token: string): Promise<Recipe[]> {
    const response = await fetch(api.recipes, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok)
        throw new Error('Failed to fetch recipes');

    const data: RecipesResponse = await response.json();
    return data.recipes;
}

import { api } from '../configs/api';
import { type Recipe, type RecipesResponse } from '../props/recipe-list.tsx';


export async function getRecipes(token: string): Promise<Recipe[]> {
    const response = await fetch(api.recipe, {
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

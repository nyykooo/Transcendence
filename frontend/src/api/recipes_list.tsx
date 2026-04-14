import { api } from '../configs/api';

export type Recipe = {
    recipe_name: string;
    ingridient_name: string;
    diet: string;
    cost: number;
    portions: number;
    liked: number;
    viewed: number;

};

type RecipesResponse = {
    count: number;
    recipes: Recipe[];
};

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

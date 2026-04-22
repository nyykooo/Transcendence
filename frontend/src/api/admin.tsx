import { type PendingRecipesResponse } from '../props/recipe-list';
import { api } from '../configs/api';

export async function getPendingRecipes(token: string): Promise<PendingRecipesResponse> {
    const response = await fetch(api.recipe, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok)
        throw new Error('Failed to fetch recipes');

    const data: PendingRecipesResponse = await response.json();
    return data;
}
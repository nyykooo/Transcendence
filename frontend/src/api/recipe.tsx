import { api } from '../configs/api';
import { type Recipe } from '../props/recipeProps';
import type { User } from '../props/userProps';

// Simple mapping of ingredient IDs to names (you might want to fetch this from an API endpoint)
// const ingredientMap: { [key: number]: string } = {
//     9: 'Garlic',
//     20: 'Onion',
//     32: 'Tomato Concentrate',
//     74: 'Basil',
//     93: 'Eggs',
//     99: 'Saloia Bread',
//     103: 'Chili Pepper',
//     105: 'Red Bell Pepper',
//     122: 'Tomato',
//     124: 'Thyme'
// };

export async function getRecipe(name: string): Promise<Recipe | null>
{
    const auth: User | null = JSON.parse(localStorage.getItem('auth') || 'null');
    if (!auth) {
        return null;
    }

    try {
        const response = await fetch(api.recipe + name, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        // Map the backend response to Recipe type
        const recipe: Recipe = {
            name: data.name,
            ingridients: [],
            instructions: data.instructions
        };

        return recipe;
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return null;
    }
}
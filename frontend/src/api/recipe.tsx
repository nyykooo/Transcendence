import { api } from '../configs/api';
import { type Recipe } from '../props/recipeProps';
import type { User } from '../props/userProps';



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
        // console.log('Received data:', data);

        // Map the backend response to Recipe type
        const recipe: Recipe = {
            name: data.name,
            ingridients: data.ingridients ? data.ingridients : [],
            instructions: data.instructions ? data.instructions : '',
            image: data.image ? data.image : ''
        };

        return recipe;
    } catch (error) {
        console.log('Error fetching recipe:', error);
        return null;
    }
}
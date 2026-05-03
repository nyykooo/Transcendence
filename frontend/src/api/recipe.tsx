import { api } from '../configs/api';
import { type Recipe, type InstructionGroup } from '../props/recipeProps';
import type { User } from '../props/userProps';


function normalizeMediaUrl(value?: string | null): string | null {
    if (!value) {
        return null;
    }

    if (value.startsWith('/uploads/')) {
        return value;
    }

    const uploadsIndex = value.indexOf('/uploads/');
    if (uploadsIndex >= 0) {
        return value.slice(uploadsIndex);
    }

    return value;
}


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
            ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
            instructions: Array.isArray(data.instructions)
                ? data.instructions.filter((group: any): group is InstructionGroup => Boolean(group && typeof group.title === 'string'))
                : [],
            image: normalizeMediaUrl(data.image ?? null),
            url: data.url ?? null,
        };

        return recipe;
    } catch (error) {
        console.log('Error fetching recipe:', error);
        return null;
    }
}
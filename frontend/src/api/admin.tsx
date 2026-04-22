import { type PendingRecipesResponse } from '../props/recipe-list';
import { type AllUsersResponse } from '../props/userProps';
import { api } from '../configs/api';

export async function getPendingRecipes(token: string): Promise<PendingRecipesResponse> {
    const response = await fetch(api.pendingRecipes, {
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

export async function getAllUsers(token: string): Promise<AllUsersResponse> {
    const response = await fetch(api.allUsers, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok)
        throw new Error('Failed to fetch users');

    const data: AllUsersResponse = await response.json();
    return data;
}
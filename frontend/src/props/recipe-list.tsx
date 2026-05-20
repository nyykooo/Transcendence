export type RecipeListFiltersProps = {
    recipes: string[];
    ingredients: string[];
    diets: string[];
    cost: {
        min: number;
        max: number;
    }
    servings: {
        min: number;
        max: number;
    }
}

export type Recipe = {
    recipe_name: string;
    ingredient_name: string;
    diet: string;
    cost: number;
    portions: number;
    liked: number;
    viewed: number;
};

export type RecipesResponse = {
    count: number;
    recipes: Recipe[];
};

export type RecipeRow = {
    recipe_name: string;
    ingredient_name: string;
    diet: string;
    cost: number;
    portions: number;
    liked: number;
    viewed: number;
};

export type PendingRecipesResponse = {
    count: number;
    recipes: PendingRecipe[];
};

export type PendingRecipe = {
    recipe_name: string;
    ingredient_name: string;
    diet: string;
    author: string;
    status: string;
    created_at: string;
    instructions: string;
};
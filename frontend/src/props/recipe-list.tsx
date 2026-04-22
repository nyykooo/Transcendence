export type RecipeListFiltersProps = {
    recipes: string[];
    ingridients: string[];
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
    ingridient_name: string;
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
    ingridient_name: string;
    diet: string;
    cost: number;
    portions: number;
    liked: number;
    viewed: number;
};

export type PendingRecipeRow = {
    recipe_name: string;
    ingridient_name: string;
    diet: string;
    cost: number;
    portions: number;
    creator: string;
};
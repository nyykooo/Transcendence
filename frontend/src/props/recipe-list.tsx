export type RecipeListFiltersProps = {
    recipes?: string[];
    ingredients?: string[];
    diets?: string[];
    cost?: {
        min?: number;
        max?: number;
    }
    servings?: {
        min?: number;
        max?: number;
    }
}
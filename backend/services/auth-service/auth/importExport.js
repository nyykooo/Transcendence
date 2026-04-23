const csv = require('csv-parse/sync');

function capitalizeWords(value) {
    return String(value || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function normalizeUnit(value) {
    const raw = String(value || '').trim();
    return raw || 'g';
}

function normalizeQuantity(value) {
    if (value === null || value === undefined || value === '') return 0;
    const parsed = Number(value);
    return Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;
}

function normalizeIngredient(ingredient, defaultQuantity, defaultUnit) {
    if (typeof ingredient === 'string') {
        const name = capitalizeWords(ingredient);
        return name
            ? {
                name,
                quantity: normalizeQuantity(defaultQuantity),
                unit: normalizeUnit(defaultUnit),
            }
            : null;
    }

    if (ingredient && typeof ingredient === 'object') {
        const name = capitalizeWords(ingredient.name || ingredient.ingredient_name);
        if (!name) return null;
        return {
            name,
            quantity: normalizeQuantity(ingredient.quantity ?? defaultQuantity),
            unit: normalizeUnit(ingredient.unit ?? defaultUnit),
        };
    }

    return null;
}

/**
 * Validate required recipe fields for import
 */
function validateRecipeFields(recipe) {
    const errors = [];
    
    if (!recipe.name || typeof recipe.name !== 'string' || recipe.name.trim() === '') {
        errors.push('name is required');
    }
    
    if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
        errors.push('ingredients is required');
    } else {
        recipe.ingredients.forEach((ingredient, index) => {
            if (!ingredient || typeof ingredient !== 'object') {
                errors.push(`ingredients[${index}] must be an object`);
                return;
            }

            if (!ingredient.name || typeof ingredient.name !== 'string') {
                errors.push(`ingredients[${index}].name is required`);
            }

            if (ingredient.quantity !== undefined && (isNaN(Number(ingredient.quantity)) || Number(ingredient.quantity) < 0)) {
                errors.push(`ingredients[${index}].quantity must be a non-negative number`);
            }

            if (ingredient.unit !== undefined && typeof ingredient.unit !== 'string') {
                errors.push(`ingredients[${index}].unit must be a string`);
            }
        });
    }
    
    // diet is optional, defaults to 'Vegan'
    if (recipe.diet && typeof recipe.diet !== 'string') {
        errors.push('diet must be a string');
    }
    
    // Optional numeric fields
    if (recipe.cost !== undefined && (isNaN(Number(recipe.cost)) || Number(recipe.cost) < 0)) {
        errors.push('cost must be a non-negative number');
    }
    
    if (recipe.portions !== undefined && (isNaN(Number(recipe.portions)) || Number(recipe.portions) < 1)) {
        errors.push('portions must be a positive number');
    }
    
    if (recipe.prep_time !== undefined && (isNaN(Number(recipe.prep_time)) || Number(recipe.prep_time) < 0)) {
        errors.push('prep_time must be a non-negative number');
    }
    
    if (recipe.cooking_time !== undefined && (isNaN(Number(recipe.cooking_time)) || Number(recipe.cooking_time) < 0)) {
        errors.push('cooking_time must be a non-negative number');
    }
    
    return errors;
}

/**
 * Parse ingredients string into JSONB array format
 * Accepts: "flour, sugar, butter" or JSON array "[{name: 'flour'}, ...]"
 */
function parseIngredients(ingredientsInput) {
    if (Array.isArray(ingredientsInput)) {
        return ingredientsInput
            .map(ing => normalizeIngredient(ing))
            .filter(Boolean);
    }
    
    if (typeof ingredientsInput === 'string') {
        try {
            // Try to parse as JSON first
            const parsed = JSON.parse(ingredientsInput);
            if (Array.isArray(parsed)) {
                return parsed
                    .map(ing => normalizeIngredient(ing))
                    .filter(Boolean);
            }
        } catch {
            // Fall back to comma-separated
            return ingredientsInput
                .split(',')
                .map(ing => normalizeIngredient(ing))
                .filter(Boolean);
        }
    }
    
    return [];
}

/**
 * Parse CSV file content into recipe objects
 * Expected headers: name, ingredients, diet, cost, portions, prep_time, cooking_time, instructions, url, author
 */
function parseCSV(csvContent) {
    try {
        const records = csv.parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            relax_quotes: true,
            relax_column_count: true,
        });

        if (records.length === 0) {
            return [];
        }

        const groupedByRecipeRows = records.some(record => record.recipe_name && record.ingredient_name);

        if (groupedByRecipeRows) {
            const recipeMap = new Map();

            records.forEach(record => {
                const recipeName = String(record.recipe_name || '').trim();
                if (!recipeName) return;

                if (!recipeMap.has(recipeName)) {
                    recipeMap.set(recipeName, {
                        name: recipeName,
                        ingredients: [],
                        diet: record.diet || 'Vegan',
                        cost: record.cost ? Number(record.cost) : 0,
                        portions: record.portions ? Number(record.portions) : 1,
                        prep_time: record.prep_time ? Number(record.prep_time) : null,
                        cooking_time: record.cooking_time ? Number(record.cooking_time) : null,
                        instructions: record.instructions || null,
                        url: record.url || null,
                        author: record.author || null,
                    });
                }

                const recipe = recipeMap.get(recipeName);
                const ingredient = normalizeIngredient(
                    { name: record.ingredient_name, quantity: record.quantity, unit: record.unit },
                    record.quantity,
                    record.unit,
                );

                if (ingredient) {
                    recipe.ingredients.push(ingredient);
                }
            });

            return Array.from(recipeMap.values());
        }
        
        return records.map(record => {
            const recipe = {
                name: record.name,
                ingredients: parseIngredients(record.ingredients),
                diet: record.diet || 'Vegan',
                cost: record.cost ? Number(record.cost) : 0,
                portions: record.portions ? Number(record.portions) : 1,
                prep_time: record.prep_time ? Number(record.prep_time) : null,
                cooking_time: record.cooking_time ? Number(record.cooking_time) : null,
                instructions: record.instructions || null,
                url: record.url || null,
                author: record.author || null,
            };
            return recipe;
        });
    } catch (error) {
        throw new Error(`CSV parsing failed: ${error.message}`);
    }
}

/**
 * Parse JSON file content into recipe objects
 */
function parseJSON(jsonContent) {
    try {
        let data = JSON.parse(jsonContent);
        
        // Support both single recipe object and array of recipes
        if (!Array.isArray(data)) {
            data = [data];
        }
        
        return data.map(recipe => ({
            name: recipe.name,
            ingredients: parseIngredients(recipe.ingredients),
            diet: recipe.diet || 'Vegan',
            cost: recipe.cost ? Number(recipe.cost) : 0,
            portions: recipe.portions ? Number(recipe.portions) : 1,
            prep_time: recipe.prep_time ? Number(recipe.prep_time) : null,
            cooking_time: recipe.cooking_time ? Number(recipe.cooking_time) : null,
            instructions: recipe.instructions || null,
            url: recipe.url || null,
            author: recipe.author || null,
        }));
    } catch (error) {
        throw new Error(`JSON parsing failed: ${error.message}`);
    }
}

/**
 * Validate imported recipes and return results with errors
 */
function validateRecipes(recipes) {
    return recipes.map((recipe, index) => {
        const errors = validateRecipeFields(recipe);
        return {
            index,
            recipe,
            valid: errors.length === 0,
            errors,
        };
    });
}

module.exports = {
    validateRecipeFields,
    parseIngredients,
    parseCSV,
    parseJSON,
    validateRecipes,
};

const csv = require('csv-parse/sync');

/**
 * Validate required recipe fields for import
 */
function validateRecipeFields(recipe) {
    const errors = [];
    
    if (!recipe.name || typeof recipe.name !== 'string' || recipe.name.trim() === '') {
        errors.push('name is required');
    }
    
    // ingredients can be array or comma-separated string
    if (!recipe.ingredients) {
        errors.push('ingredients is required');
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
        return ingredientsInput.map(ing => {
            if (typeof ing === 'string') {
                return { name: ing.trim() };
            }
            return ing;
        });
    }
    
    if (typeof ingredientsInput === 'string') {
        try {
            // Try to parse as JSON first
            const parsed = JSON.parse(ingredientsInput);
            if (Array.isArray(parsed)) {
                return parsed.map(ing => (typeof ing === 'string' ? { name: ing.trim() } : ing));
            }
        } catch {
            // Fall back to comma-separated
            return ingredientsInput.split(',').map(ing => ({ name: ing.trim() })).filter(ing => ing.name);
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

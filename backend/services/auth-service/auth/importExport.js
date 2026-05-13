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

function normalizeText(value) {
    return String(value ?? '').trim();
}

function normalizeOptionalNumber(value) {
    const raw = normalizeText(value);
    if (!raw) return null;

    const parsed = Number(raw);
    return Number.isNaN(parsed) || parsed < 0 ? null : parsed;
}

function parseIngredientToken(ingredient, defaultQuantity, defaultUnit) {
    if (typeof ingredient !== 'string') {
        return normalizeIngredient(ingredient, defaultQuantity, defaultUnit);
    }

    const raw = ingredient.trim();
    if (!raw) return null;

    const withQuantity = raw.match(/^(.+?)\s*\(\s*([0-9]+(?:[.,][0-9]+)?)\s*([^)]*?)\s*\)$/);
    if (withQuantity) {
        return {
            name: capitalizeWords(withQuantity[1]),
            quantity: normalizeQuantity(withQuantity[2].replace(',', '.')),
            unit: normalizeUnit(withQuantity[3]),
        };
    }

    const fallback = capitalizeWords(raw);
    return fallback
        ? {
            name: fallback,
            quantity: normalizeQuantity(defaultQuantity),
            unit: normalizeUnit(defaultUnit),
        }
        : null;
}

function normalizeIngredient(ingredient, defaultQuantity, defaultUnit) {
    if (typeof ingredient === 'string') {
        return parseIngredientToken(ingredient, defaultQuantity, defaultUnit);
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

    if (!recipe.diet || typeof recipe.diet !== 'string' || recipe.diet.trim() === '') {
        errors.push('diet is required');
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

    if (!recipe.instructions || typeof recipe.instructions !== 'string' || recipe.instructions.trim() === '') {
        errors.push('instructions is required');
    }

    if (recipe.cost !== undefined && recipe.cost !== null && recipe.cost !== '' && (isNaN(Number(recipe.cost)) || Number(recipe.cost) < 0)) {
        errors.push('cost must be a non-negative number');
    }

    if (recipe.portions !== undefined && recipe.portions !== null && recipe.portions !== '' && (isNaN(Number(recipe.portions)) || Number(recipe.portions) < 1)) {
        errors.push('portions must be a positive number');
    }

    if (recipe.prep_time !== undefined && recipe.prep_time !== null && recipe.prep_time !== '' && (isNaN(Number(recipe.prep_time)) || Number(recipe.prep_time) < 0)) {
        errors.push('prep_time must be a non-negative number');
    }

    if (recipe.cooking_time !== undefined && recipe.cooking_time !== null && recipe.cooking_time !== '' && (isNaN(Number(recipe.cooking_time)) || Number(recipe.cooking_time) < 0)) {
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
        const rawInput = ingredientsInput.trim();
        if (!rawInput) {
            return [];
        }

        try {
            const parsed = JSON.parse(rawInput);
            if (Array.isArray(parsed)) {
                return parsed
                    .map(ing => normalizeIngredient(ing))
                    .filter(Boolean);
            }
        } catch {
            const separator = rawInput.includes(';') ? ';' : ',';
            return rawInput
                .split(separator)
                .map(ing => parseIngredientToken(ing))
                .filter(Boolean);
        }
    }

    return [];
}

/**
 * Parse CSV file content into recipe objects
 * Expected headers: name, diet, ingredients, instructions, image_path, video_url, cost, portions
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
                        diet: normalizeText(record.diet),
                        cost: normalizeOptionalNumber(record.cost),
                        portions: normalizeOptionalNumber(record.portions),
                        prep_time: normalizeOptionalNumber(record.prep_time),
                        cooking_time: normalizeOptionalNumber(record.cooking_time),
                        instructions: normalizeText(record.instructions),
                        image_path: normalizeText(record.image_path || record.image),
                        video_url: normalizeText(record.video_url || record.url),
                        author: normalizeText(record.author),
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
                name: normalizeText(record.name),
                diet: normalizeText(record.diet),
                ingredients: parseIngredients(record.ingredients),
                cost: normalizeOptionalNumber(record.cost),
                portions: normalizeOptionalNumber(record.portions),
                prep_time: normalizeOptionalNumber(record.prep_time),
                cooking_time: normalizeOptionalNumber(record.cooking_time),
                instructions: normalizeText(record.instructions),
                image_path: normalizeText(record.image_path || record.image),
                video_url: normalizeText(record.video_url || record.url),
                author: normalizeText(record.author),
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
            name: normalizeText(recipe.name),
            diet: normalizeText(recipe.diet),
            ingredients: parseIngredients(recipe.ingredients),
            cost: normalizeOptionalNumber(recipe.cost),
            portions: normalizeOptionalNumber(recipe.portions),
            prep_time: normalizeOptionalNumber(recipe.prep_time),
            cooking_time: normalizeOptionalNumber(recipe.cooking_time),
            instructions: normalizeText(recipe.instructions),
            image_path: normalizeText(recipe.image_path || recipe.image),
            video_url: normalizeText(recipe.video_url || recipe.url),
            author: normalizeText(recipe.author),
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

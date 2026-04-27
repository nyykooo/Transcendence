const express = require('express');
const {requireAuth, requireAuthWithRateLimit} = require('../auth/requireAuth');
const {recipes, nextRecipeId} = require('./store');
const { pool } = require('../db');

const router = express.Router();

function findRecipe(id) {
    return recipes.find(r=> r.id === id);
}

function assertOwner(req, res, recipe) {
    if (!recipe)
        return res.status(404).json({error: 'Recipe not found'});
    if (recipe.createdBy !== req.userId)
        return res.status(403).json({error: 'Forbidden: not recipe owner'});
    return null;
}

function serializeRecipeRow(row) {
    // Garante que ingredients seja uma lista; se vier inválido, usa lista vazia.
    const ingredients = Array.isArray(row.ingredients)
        ? row.ingredients
        : [];

    // Pega apenas o campo "name" de cada ingrediente e remove valores vazios.
    const ingredientNames = ingredients
        .map((ingredient) => ingredient?.name)
        .filter((name) => typeof name === 'string' && name.trim() !== '');

    return {
        recipe_name: row.name,
        // String para exibir na coluna "Ingredient Name" da tabela.
        ingredient_name: ingredientNames.join(', '),
        // Array útil para filtros/autocomplete no frontend.
        ingredients_names: ingredientNames,
        diet: row.diet,
        cost: row.cost ?? null,
        portions: row.portions ?? null,
        liked: row.liked ?? null,
        viewed: row.viewed ?? null,
    };
}

router.get(['/recipes', '/recipes/', '/RecipeListView'], requireAuthWithRateLimit, (req, res) => {
    const query = `
        SELECT
            r.name,
            r.ingredients,
            r.diet,
            r.cost,
            r.portions,
            r.liked,
            r.viewed
            FROM public.all_recipes r
            ORDER BY r.name ASC
            `;
            //r.ingredients e' o json com os ingredientes; usado para extrair apenas os nomes no backend.
            
    pool.query(query)
        .then(({ rows }) => { 
            const serialized = rows.map(serializeRecipeRow);
            return res.json({ count: serialized.length, recipes: serialized });
        })
        .catch((error) => {
            return res.status(500).json({ error: 'Failed to fetch recipes', details: error.message });
        });
});

router.get(['/pending/recipes', '/pending/RecipeListView'], requireAuthWithRateLimit, (req, res) => {
    if (!req.userId) {
        return res.status(401).json({error: 'Unauthorized'});
    }
    const query = `
        SELECT
            r.author,
            r.name,
            r.ingredients,
            r.diet,
            r.status,
            r.submitted_at

            FROM public.pending_recipes r
            ORDER BY r.name ASC
            `;
            //r.ingredients e' o json com os ingredientes; usado para extrair apenas os nomes no backend.
            
    pool.query(query)
        .then(({ rows }) => { 
            const serialized = rows.map(serializeRecipeRow);
            return res.json({ count: serialized.length, recipes: serialized });
        })
        .catch((error) => {
            return res.status(500).json({ error: 'Failed to fetch recipes', details: error.message });
        });
});

router.delete(['/pending/recipes/reprove/:name', '/pending/RecipeListView/reprove/:name'], requireAuthWithRateLimit, (req, res) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (!req.userId) {
        return res.status(401).json({error: 'Unauthorized'});
    }

    const name = decodeURIComponent(req.params.name);
    pool.query(
        `DELETE FROM public.pending_recipes
         WHERE name = $1`,
        [name],
    )
    .then(() => {
        return res.status(204).send();
    })
    .catch((error) => {
        return res.status(500).json({ error: `Failed to delete recipe ${name}`, details: error.message });
    });
});

router.post(['/pending/recipes/approve/:name', '/pending/RecipeListView/approve/:name'], requireAuthWithRateLimit, async (req, res) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (!req.userId) {
        return res.status(401).json({error: 'Unauthorized'});
    }
    const name = decodeURIComponent(req.params.name);
    try {
        await pool.query('BEGIN');

        const pendingResult = await pool.query(
            `SELECT *
             FROM public.pending_recipes
             WHERE name = $1
             LIMIT 1`,
            [name],
        );

        if (pendingResult.rowCount === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ error: `Pending recipe ${name} not found` });
        }

        const pendingRecipe = pendingResult.rows[0];
        // ✅ VALIDAR E SANITIZAR ingredients
        const ingredients = pendingRecipe.ingredients && typeof pendingRecipe.ingredients === 'object'
            ? pendingRecipe.ingredients
            : {};

        const insertResult = await pool.query(`
            INSERT INTO public.all_recipes (
                author,
                name,
                ingredients,
                diet,
                instructions,
                url,
                cost,
                portions,
                prep_time,
                cooking_time,
                is_public,
                liked,
                viewed
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING id, author, name, ingredients, diet, instructions, url, cost, portions, prep_time, cooking_time
        `, [
            pendingRecipe.author,
            pendingRecipe.name,
            JSON.stringify(ingredients),  // ✅ Garantir string JSON válida
            pendingRecipe.diet,
            pendingRecipe.instructions,
            pendingRecipe.url,
            pendingRecipe.cost,
            pendingRecipe.portions,
            pendingRecipe.prep_time,
            pendingRecipe.cooking_time,
            false,  // is_public padrão
            0,      // liked padrão
            0       // viewed padrão
        ]);
        await pool.query(
            `DELETE FROM public.pending_recipes
             WHERE name = $1`,
            [name],
        );
        await pool.query('COMMIT');
        return res.status(201).json(insertResult.rows[0]);
    } catch (error) {
        await pool.query('ROLLBACK');
        return res.status(500).json({ error: `Failed to approve recipe ${name}`, details: error.message });
    }
});

router.post(['/recipes', '/RecipeListView'], requireAuthWithRateLimit, async (req, res) => {
    if(req.user.role !== 'admin') {
        return res.status(403).json({error: 'Forbidden: user is not an admin'});
    }
    const body = req.body || {};
    if (!body.name)
        return res.status(400).json({error: 'name is required'});

    if (!req.userId) {
        return res.status(401).json({error: 'Unauthorized'});
    }

    let ingredients = body.ingredients ?? [];
    if (typeof ingredients === 'string') {
        try {
            ingredients = JSON.parse(ingredients);
        } catch {
            ingredients = [];
        }
    }

    const normalizedIngredients =
        Array.isArray(ingredients) || (ingredients && typeof ingredients === 'object')
            ? ingredients
            : [];

    let authorName;
    try {
        const authorResult = await pool.query(
            `SELECT name
             FROM dev_dba.users
             WHERE id = $1
             LIMIT 1`,
            [req.userId],
        );

        if (authorResult.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        authorName = authorResult.rows[0].name;
    } catch (error) {
        return res.status(500).json({ error: 'Failed to resolve recipe author', details: error.message });
    }

    const query = `
        INSERT INTO public.all_recipes (
            author,
            name,
            ingredients,
            diet,
            instructions,
            url,
            cost,
            portions,
            prep_time,
            cooking_time,
            status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending')
        RETURNING
            id,
            author,
            name,
            ingredients,
            diet,
            instructions,
            url,
            cost,
            portions,
            prep_time,
            cooking_time,
            status,
            submitted_at
    `;

    const values = [
        authorName,
        body.name,
        JSON.stringify(normalizedIngredients),
        body.diet ?? 'Vegan',
        body.instructions ?? null,
        body.url ?? null,
        body.cost ?? 0,
        body.portions ?? 1,
        body.prep_time ?? null,
        body.cooking_time ?? null,
    ];

    try {
        const { rows } = await pool.query(query, values);
        return res.status(201).json(rows[0]);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to submit recipe', details: error.message });
    }
});

router.post(['/pending/recipes', '/Pending/RecipeListView'], requireAuthWithRateLimit, async (req, res) => {
    const body = req.body || {};
    if (!body.name)
        return res.status(400).json({error: 'name is required'});

    if (!req.userId) {
        return res.status(401).json({error: 'Unauthorized'});
    }

    let ingredients = body.ingredients ?? [];
    if (typeof ingredients === 'string') {
        try {
            ingredients = JSON.parse(ingredients);
        } catch {
            ingredients = [];
        }
    }

    const normalizedIngredients =
        Array.isArray(ingredients) || (ingredients && typeof ingredients === 'object')
            ? ingredients
            : [];

    let authorName;
    try {
        const authorResult = await pool.query(
            `SELECT name
             FROM dev_dba.users
             WHERE id = $1
             LIMIT 1`,
            [req.userId],
        );

        if (authorResult.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        authorName = authorResult.rows[0].name;
    } catch (error) {
        return res.status(500).json({ error: 'Failed to resolve recipe author', details: error.message });
    }

    const query = `
        INSERT INTO public.pending_recipes (
            author,
            name,
            ingredients,
            diet,
            instructions,
            url,
            cost,
            portions,
            prep_time,
            cooking_time,
            status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending')
        RETURNING
            id,
            author,
            name,
            ingredients,
            diet,
            instructions,
            url,
            cost,
            portions,
            prep_time,
            cooking_time,
            status,
            submitted_at
    `;

    const values = [
        authorName,
        body.name,
        JSON.stringify(normalizedIngredients),
        body.diet ?? 'Vegan',
        body.instructions ?? null,
        body.url ?? null,
        body.cost ?? 0,
        body.portions ?? 1,
        body.prep_time ?? null,
        body.cooking_time ?? null,
    ];

    try {
        const { rows } = await pool.query(query, values);
        return res.status(201).json(rows[0]);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to submit recipe', details: error.message });
    }
});

router.get(['/recipes/:name', '/RecipeView/:name'], requireAuthWithRateLimit, async (req, res) => {
    const name = req.params.name; // search normalized values?

    try {
        const result = await pool.query(`
            SELECT * FROM public.all_recipes
            WHERE LOWER(name) = LOWER($1)
            LIMIT 1
        `, [name]);

        if (!result.rows || result.rows.length === 0) {
            return res.status(404).json({error: `Recipe ${name} not found`});
        }

        const raw_recipe = result.rows[0];

        const recipe = {
            name: raw_recipe.name,
            ingredients: raw_recipe.ingredients,
            instructions: raw_recipe.instructions,
            prep_time: raw_recipe.prep_time,
            cook_time: raw_recipe.cooking_time,
            portions: raw_recipe.portions,
            diet: raw_recipe.diet,
            cost: raw_recipe.cost,
            liked: raw_recipe.liked,
            viewed: raw_recipe.viewed+1,
        };
        return res.json(recipe);
    } catch (error) {
        console.log('Error fetching recipe:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
})

router.get(['/pending/recipes/:name', '/pending/RecipeView/:name'], requireAuthWithRateLimit, async (req, res) => {
    const name = decodeURIComponent(req.params.name); // search normalized values?

    try {
        const result = await pool.query(`
            SELECT * FROM public.pending_recipes
            WHERE name = $1
            LIMIT 1
        `, [name]);

        if (!result.rows || result.rows.length === 0) {
            return res.status(404).json({error: `Recipe ${name} not found`});
        }

        const raw_recipe = result.rows[0];

        const recipe = {
            author: raw_recipe.author,
            name: raw_recipe.name,
            ingredients: raw_recipe.ingredients,
            diet: raw_recipe.diet,
            instructions: raw_recipe.instructions,
            cost: raw_recipe.cost,
            portions: raw_recipe.portions,
            prep_time: raw_recipe.prep_time,
            cook_time: raw_recipe.cooking_time,
            status: raw_recipe.status,
            submitted_at: raw_recipe.submitted_at,
            url: raw_recipe.url
        };
        return res.json(recipe);
    } catch (error) {
        console.log('Error fetching pending recipe:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
})

router.put(['/recipes/:name', '/RecipeView/:name'], requireAuthWithRateLimit, async (req, res) => {
    if(req.user.role !== 'admin') {
        return res.status(403).json({error: 'Forbidden: user is not an admin'});
    }
    const name = decodeURIComponent(req.params.name);
    if (!name) {
        return res.status(400).json({error: 'Invalid recipe name'});
    }

    const body = req.body || {};

    try {
        const existing = await pool.query(
            `SELECT id, author
             FROM public.all_recipes
             WHERE name = $1
             LIMIT 1`,
            [name],
        );

        if (!existing.rows || existing.rows.length === 0)
            return res.status(404).json({error: 'Recipe not found'});

        const ownerResult = await pool.query(
            `SELECT name
             FROM dev_dba.users
             WHERE id = $1
             LIMIT 1`,
            [req.userId],
        );

        if (ownerResult.rowCount === 0)
            return res.status(404).json({error: 'User not found'});

        if (existing.rows[0].author !== ownerResult.rows[0].name)
            return res.status(403).json({error: 'Forbidden: not recipe owner'});

        const query = `
            UPDATE public.all_recipes
            SET
                name = COALESCE($1, name),
                diet = COALESCE($2, diet),
                instructions = COALESCE($3, instructions),
                url = COALESCE($4, url),
                cost = COALESCE($5, cost),
                portions = COALESCE($6, portions),
                prep_time = COALESCE($7, prep_time),
                cooking_time = COALESCE($8, cooking_time)
            WHERE id = $9
            RETURNING
                id,
                author,
                name,
                diet,
                instructions,
                url,
                cost,
                portions,
                prep_time,
                cooking_time,
                status,
                submitted_at
        `;

        const values = [
            body.name ?? null,
            body.diet ?? null,
            body.instructions ?? null,
            body.url ?? null,
            body.cost ?? null,
            body.portions ?? null,
            body.prep_time ?? null,
            body.cooking_time ?? null,
            id,
        ];

        const { rows } = await pool.query(query, values);
        return res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update recipe', details: error.message });
    }
});

router.put(['/pending/recipes/:name', '/pending/RecipeView/:name'], requireAuthWithRateLimit, async (req, res) => {
    const name = decodeURIComponent(req.params.name);
    if (!name) {
        return res.status(400).json({error: 'Invalid recipe name'});
    }

    const body = req.body || {};

    try {
        const existing = await pool.query(
            `SELECT id, author
             FROM public.pending_recipes
             WHERE name = $1
             LIMIT 1`,
            [name],
        );

        if (!existing.rows || existing.rows.length === 0)
            return res.status(404).json({error: 'Recipe not found'});

        const ownerResult = await pool.query(
            `SELECT name
             FROM dev_dba.users
             WHERE id = $1
             LIMIT 1`,
            [req.userId],
        );

        if (ownerResult.rowCount === 0)
            return res.status(404).json({error: 'User not found'});

        if (existing.rows[0].author !== ownerResult.rows[0].name)
            return res.status(403).json({error: 'Forbidden: not recipe owner'});

        const query = `
            UPDATE public.pending_recipes
            SET
                name = COALESCE($1, name),
                diet = COALESCE($2, diet),
                ingredients = COALESCE($3, ingredients),
                instructions = COALESCE($4, instructions),
                url = COALESCE($5, url),
                cost = COALESCE($6, cost),
                portions = COALESCE($7, portions),
                prep_time = COALESCE($8, prep_time),
                cooking_time = COALESCE($9, cooking_time)
            WHERE id = $10
            RETURNING
                id,
                author,
                name,
                diet,
                ingredients,
                instructions,
                url,
                cost,
                portions,
                prep_time,
                cooking_time,
                status,
                submitted_at
        `;

        const values = [
            body.name ?? null,
            body.diet ?? null,
            body.ingredients ?? null,
            body.instructions ?? null,
            body.url ?? null,
            body.cost ?? null,
            body.portions ?? null,
            body.prep_time ?? null,
            body.cooking_time ?? null,
            name,
        ];

        const { rows } = await pool.query(query, values);
        return res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update recipe', details: error.message });
    }
});

// Still need to change this to use the DB

router.delete(['/recipes/:name', '/RecipeView/:name'], requireAuthWithRateLimit, async (req, res) => {
    if(req.user.role !== 'admin') {
      return res.status(403).json({error: 'Forbidden: user is not an admin'});
    }
    const name = decodeURIComponent(req.params.name);
    if (!name) {
        return res.status(400).json({error: 'Invalid recipe name'});
    }
    const index = recipes.findIndex(r => r.name === name);
    if (index === -1)
            return res.status(404).json({error: 'Recipe not found'})
    if (recipes[index].createdBy !== req.userId)
            return res.status(403).json({ error: 'Forbidden: not recipe owner'});
    recipes.splice(index, 1);
    return res.status(204).send();
});

router.delete(['/pending/recipes/:name', '/pending/RecipeView/:name'], requireAuthWithRateLimit, async (req, res) => {
    const name = decodeURIComponent(req.params.name);
    if (!name) {
        return res.status(400).json({error: 'Invalid recipe name'});
    }

    try {
        const existing = await pool.query(
            `SELECT id, author
             FROM public.pending_recipes
             WHERE name = $1
             LIMIT 1`,
            [name],
        );

        if (!existing.rows || existing.rows.length === 0)
            return res.status(404).json({error: 'Recipe not found'});

        const ownerResult = await pool.query(
            `SELECT name
             FROM dev_dba.users
             WHERE id = $1
             LIMIT 1`,
            [req.userId],
        );

        if (ownerResult.rowCount === 0)
            return res.status(404).json({error: 'User not found'});

        if (existing.rows[0].author !== ownerResult.rows[0].name)
            return res.status(403).json({error: 'Forbidden: not recipe owner'});

        await pool.query(
            `DELETE FROM public.pending_recipes
             WHERE name = $1`,
            [name],
        );

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete recipe', details: error.message });
    }
});

module.exports = {recipesRouter: router};

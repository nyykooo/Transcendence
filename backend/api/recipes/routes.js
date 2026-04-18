const express = require('express');
const {requireAuth} = require('../auth/requireAuth');
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
    return {
        recipe_name: row.name,
        diet: row.diet,
        cost: row.cost ?? null,
        portions: row.portions ?? null,
        liked: row.liked ?? null,
        viewed: row.viewed ?? null,
    };
}

router.get(['/recipes', '/RecipeListView'], requireAuth, (req, res) => {
    const query = `
        SELECT
            r.name,
            r.diet,
            r.cost,
            r.portions,
            r.liked,
            r.viewed
        FROM public.all_recipes r
        ORDER BY r.name ASC
    `;
    // depois mudar para all_recipes

    pool.query(query)
        .then(({ rows }) => { 
            const serialized = rows.map(serializeRecipeRow);
            return res.json({ count: serialized.length, recipes: serialized });
        })
        .catch((error) => {
            return res.status(500).json({ error: 'Failed to fetch recipes', details: error.message });
        });
});

router.post(['/recipes', '/RecipeListView'], requireAuth, async (req, res) => {
    const body = req.body || {};
    if (!body.name)
        return res.status(400).json({error: 'name is required'});

    const query = `
        INSERT INTO public.pending_recipes (
            user_id,
            name,
            diet,
            instructions,
            url,
            cost,
            portions,
            prep_time,
            cooking_time,
            status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
        RETURNING
            id,
            user_id,
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
        req.userId,
        body.name,
        body.diet ?? 0,
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

router.get(['/recipes/:name', '/RecipeView/:name'], requireAuth, async (req, res) => {
    const name = decodeURIComponent(req.params.name); // search normalized values?

    try {
        const result = await pool.query(`
            SELECT * FROM public.all_recipes
            WHERE name = $1
            LIMIT 1
        `, [name]);

        if (!result.rows || result.rows.length === 0) {
            return res.status(404).json({error: `Recipe ${name} not found`});
        }

        const raw_recipe = result.rows[0];

        const recipe = {
            name: raw_recipe.name,
            ingridients: raw_recipe.ingredients,
            instructions: raw_recipe.instructions,
            prep_time: raw_recipe.prep_time,
            cook_time: raw_recipe.cooking_time,
            portions: raw_recipe.portions,
            diet: raw_recipe.diet,
            cost: raw_recipe.cost,
            liked: raw_recipe.liked,
            viewed: raw_recipe.viewed,
        };
        return res.json(recipe);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
})

router.put(['/recipes/:id', '/RecipeView/:id'], requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
        return res.status(400).json({error: 'Invalid recipe id'});

    const body = req.body || {};

    try {
        const existing = await pool.query(
            `SELECT id, user_id
             FROM public.pending_recipes
             WHERE id = $1
             LIMIT 1`,
            [id],
        );

        if (!existing.rows || existing.rows.length === 0)
            return res.status(404).json({error: 'Recipe not found'});
        if (existing.rows[0].user_id !== req.userId)
            return res.status(403).json({error: 'Forbidden: not recipe owner'});

        const query = `
            UPDATE public.pending_recipes
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
                user_id,
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

// Still need to change this to use the DB

router.delete(['/recipes/:id', '/RecipeView/:id'], requireAuth, (req, res) => {
    const id = Number(req.params.id);
    const index = recipes.findIndex(r => r.id === id);
    if (index === -1)
            return res.status(404).json({error: 'Recipe not found'})
    if (recipes[index].createdBy !== req.userId)
            return res.status(403).json({ error: 'Forbidden: not recipe owner'});
    recipes.splice(index, 1);
    return res.status(204).send();
});

module.exports = {recipesRouter: router};

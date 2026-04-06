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
        id: row.id,
        name: row.name,
        diet: row.diet,
        instructions: row.instructions,
        url: row.url,
        cost: row.cost !== null ? Number(row.cost) : null,
        portions: row.portions,
        is_public: row.is_public,
        prep_time: row.prep_time,
        cooking_time: row.cooking_time,
        created_at: row.created_at,
        updated: row.updated,
    };
}

router.get(['/recipes', '/RecipeListView'], requireAuth, (req, res) => {
    const query = `
        SELECT
            r.id,
            r.name,
            r.diet,
            r.instructions,
            r.url,
            r.cost,
            r.portions,
            r.is_public,
            r.prep_time,
            r.cooking_time,
            r.created_at,
            r.updated
        FROM dev_dba.all_recipes r
        ORDER BY r.id ASC
    `;

    pool.query(query)
        .then(({ rows }) => {
            const serialized = rows.map(serializeRecipeRow);
            return res.json({ count: serialized.length, recipes: serialized });
        })
        .catch((error) => {
            return res.status(500).json({ error: 'Failed to fetch recipes', details: error.message });
        });
});

// Still need to change this to use the DB

router.post(['/recipes', '/RecipeListView'], requireAuth, (req, res) => {
    const body = req.body || {};
    if (!body.name)
        return res.status(400).json({error: 'name is required'});
    const recipe = {
        id: nextRecipeId(),
        createdBy: req.userId,
        ...body,
        created_at: new Date().toISOString(),
        updated: null,
    };
    recipes.push(recipe);
    return res.status(201).json(recipe);
});

router.get(['/recipes/:id', '/RecipeView/:id'], requireAuth, (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id))
        return res.status(400).json({ error: 'Invalid recipe id' });

    const query = `
        SELECT
            r.id,
            r.name,
            r.diet,
            r.instructions,
            r.url,
            r.cost,
            r.portions,
            r.is_public,
            r.prep_time,
            r.cooking_time,
            r.created_at,
            r.updated
        FROM dev_dba.all_recipes r
        WHERE r.id = $1
    `;

    pool.query(query, [id])
        .then(({ rows }) => {
            if (rows.length === 0)
                return res.status(404).json({ error: 'Recipe not found' });

            const recipe = serializeRecipeRow(rows[0]);
            return res.json(recipe);
        })
        .catch((error) => {
            return res.status(500).json({ error: 'Failed to fetch recipe', details: error.message });
        });
})

// Still need to change this to use the DB

router.put(['/recipes/:id', '/RecipeView/:id'], requireAuth, (req, res) => {
    const id = Number(req.params.id);
    const recipe = findRecipe(id);
    
    const ownerError = assertOwner(req, res, recipe);
    if (ownerError)
            return ownerError;
    const body = req.body || {};
    delete body.id;
    delete body.createdBy;
    Object.assign(recipe, body, { updated: new Date().toISOString()});
    return res.json(recipe);
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

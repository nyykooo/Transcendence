const express = require('express');
const {requireAuth} = require('../auth/requireAuth');
const { pool } = require('../db');
// const {recipes, nextRecipeId} = require('./store');

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

router.get(['/recipes', '/RecipeListView'], requireAuth, (req, res) => {
    res.json({ count: recipes.length, recipes});
});


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

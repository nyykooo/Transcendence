const express = require('express');
const app = express();

const recipes = [
  {
    id: 1,
    name: "Shakshuka",
    diet: 1, // Vegetarian per your views.sql mapping
    instructions:
      "1. **Prepare ingredients**:\n" +
      "   Finely dice all ingredients, really small cuts\n" +
      "2. **Sauté aromatics**:\n" +
      "   - Heat olive oil in a large pan\n" +
      "   - Brown the garlic, onion and the pepper\n" +
      "   - Add the tomato and season, let it in low heat until the sauce is thickened\n\n" +
      "3. **Add tomatoes and spices**:\n" +
      "   - Add the tomato and season\n" +
      "   - Salt to taste\n" +
      "   - Simmer for 15-20 minutes until thickened\n\n" +
      "4. **Add eggs**:\n" +
      "   - Make wells in the sauce and crack eggs\n" +
      "   - Cover and cook until eggs are set (5-7 minutes)\n\n" +
      "5. **Serve**:\n" +
      "   - Serve hot with Saloia bread (100g) on the side\n" +
      "   - Garnish with fresh herbs if desired",
    url: "https://youtu.be/SjCkW-oAFQ8?si=8dk4eXJW1kk6ohr1&t=31",
    cost: 12.75,
    portions: 4,
    is_public: false,
    prep_time: null,
    cooking_time: null,
    created_at: new Date().toISOString(),
    updated: null, 
    ingredients: [
      // Fill ingredient_id from DB (next section)
      { ingredient_id: " Eggs id ", quantity: 2, unit: "units" },
      { ingredient_id: " Onion id ", quantity: 0.115, unit: "kg" },
      { ingredient_id: " Red Bell Pepper id ", quantity: 0.114, unit: "kg" },
      { ingredient_id: " Tomato id ", quantity: 0.551, unit: "kg" },
      { ingredient_id: " Garlic id ", quantity: 0.014, unit: "kg" },
      { ingredient_id: " Rosemary id ", quantity: 0.002, unit: "kg" },
      { ingredient_id: " Thyme id ", quantity: 0.004, unit: "kg" },
      { ingredient_id: " Basil id ", quantity: 0.006, unit: "kg" },
      { ingredient_id: " Chili Pepper id ", quantity: 0.011, unit: "kg" },
      { ingredient_id: " Sweet Paprika id ", quantity: 0.010, unit: "kg" },
      { ingredient_id: " Cumin id ", quantity: 0.004, unit: "kg" },
      { ingredient_id: " Tomato Concentrate id ", quantity: 0.050, unit: "kg" },
      { ingredient_id: " Saloia Bread id ", quantity: 0.100, unit: "kg" },
    ],
  },
];

let recipeId = 2;


app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome to my domain')
})

app.get('/status', (req, res) => {
    res.json({status: "operational", timestamp: new Date().toISOString()})
})

app.get('/user/:name', (req, res) => {
    const name = req.params.name
    res.json({message: `Hello, ${name}`, timestamp: new Date().toISOString()})
})

app.get('/search', (req, res) => {
  const q = req.query.q;

  if (!q) {
    return res.status(400).json({ error: 'Missing query parameter.' });
  }

  res.json({ query: q, timestamp: new Date().toISOString() });
});

app.post('/recipes', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    if (!title || !description)
        return res.status(400).json({"error": "Title and description are required"})
    const recipe = {
        id: recipeId,
        title,
        description
    }
    recipeId++;
    recipes.push(recipe);
    return res.status(201).json({message: "Recipe created", recipe:{ title: `${title}`, description: `${description}`}})

})

app.put('/RecipeView/:id', (req, res) =>{
    const id = Number(req.params.id);
    const name = req.body.name;
    const diet = req.body.diet;
    const instructions = req.body.instructions;
    const url = req.body.url;
    const cost = req.body.cost;
    const portions = req.body.portions;
    const is_public = req.body.is_public;
    const prep_time = req.body.prep_time;
    const cooking_time = req.body.cooking_time;
    const created_at = req.body.created_at;
    const updated = req.body.cooking_time;
    const ingredients = req.body.ingredients;

    const recipe = recipes.find(r => r.id === id)
    if (!name && !diet &&  !instructions &&  !url &&  !cost &&  !portions &&  !is_public &&  !prep_time &&  !cooking_time &&  !created_at &&  !updated &&  !ingredients)
        return res.status(400).json({"error": "No fields to update"})
    if (!recipe)
        return res.status(404).json({"error": "Recipe not found"})
    if (name)
        recipe.name = name;
    if (diet)
        recipe.diet = diet;
    if (instructions)
        recipe.instructions = instructions;
    if (url)
        recipe.url = url;
    if (cost)
        recipe.cost = cost;
    if (portions)
        recipe.portions = portions;
    if (is_public)
        recipe.is_public = is_public;
    if (prep_time)
        recipe.prep_time = prep_time;
    if (cooking_time)
        recipe.cooking_time = cooking_time;
    if (created_at)
        recipe.created_at = created_at;
    if (updated)
        recipe.updated = updated;
    if (ingredients)
        recipe.ingredients = ingredients;
    return res.status(200).json(recipe);
})

app.delete('/RecipeView/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = recipes.findIndex(r =>r.id === id)
    if (index === -1)
        return res.status(404).json({"error": "Recipe not found"})
    recipes.splice(index, 1);
    return res.status(204).json()
})
app.get('/RecipeView/:id', (req, res) => {
const id = Number(req.params.id);
const recipe = recipes.find(r => r.id === id)
if (recipe)
    return res.status(200).json(recipe);
return res.status(404).json({"error": "Recipe not found."})
})

app.get('/RecipeListView', (req,res)=> {

    res.json({count: recipes.length, recipes})
})


const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Recipes listening on ${PORT}`));
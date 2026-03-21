const express = require('express');
const app = express();

const recipes = [];
let recipeId = 1;


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

app.put('/recipes/:id', (req, res) =>{
    const title = req.body.title;
    const description = req.body.description;
    const id = Number(req.params.id);
    const recipe = recipes.find(r => r.id === id)
    if (!title && !description)
        return res.status(400).json({"error": "No fields to update"})
    if (!recipe)
        return res.status(404).json({"error": "Recipe not found"})
    if (title)
        recipe.title = title;
    if (description)
        recipe.description = description;
    return res.status(200).json(recipe);
})

app.delete('/recipes/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = recipes.findIndex(r =>r.id === id)
    if (index === -1)
        return res.status(404).json({"error": "Recipe not found"})
    recipes.splice(index, 1);
    return res.status(204).json()
})

app.get('/recipes', (req,res)=> {
    res.json({count: recipes.length, recipes})
})

app.get('/recipes/:id', (req, res) => {
const id = Number(req.params.id);
const recipe = recipes.find(r => r.id === id)
if (recipe)
    return res.status(200).json(recipe);
return res.status(404).json({"error": "Recipe not found."})
})

app.listen(3000)
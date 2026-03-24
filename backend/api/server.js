const express = require('express');
const app = express();
app.use(express.json())

require('dotenv').config();

const {authRouter} = require('./auth/routes');
const { recipesRouter} = require('./recipes/routes');
app.use(authRouter);
app.use(recipesRouter);


const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Recipes listening on ${PORT}`));

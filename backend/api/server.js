const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const { authRouter } = require('./auth/routes');
const { recipesRouter } = require('./recipes/routes');

app.use(authRouter);
app.use(recipesRouter);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Recipes listening on ${PORT}`));

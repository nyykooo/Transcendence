const express = require('express');
const cors = require('cors');

const app = express();
require('dotenv').config();
const { pool } = require('./db');

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
	if (req.url.length > 1 && req.url.endsWith('/')) {
		req.url = req.url.replace(/\/+$/, '');
	}
	next();
});

const { recipesRouter } = require('./recipes/routes');

app.use(recipesRouter);
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', service: 'recipes-service' }));

const PORT = Number(process.env.PORT || 3002);

function startHttpServer() {
	app.listen(PORT, () => console.log(`Recipes service listening on ${PORT}`));
}

async function startServer() {
	try {
		await pool.query('SELECT 1');
		console.log('Connected to PostgreSQL');
		startHttpServer();
	} catch (error) {
		console.log('Failed to connect to PostgreSQL:', error.message);
		process.exit(1);
	}
}

process.on('SIGTERM', async () => {
	await pool.end();
	process.exit(0);
});

process.on('SIGINT', async () => {
	await pool.end();
	process.exit(0);
});

startServer();

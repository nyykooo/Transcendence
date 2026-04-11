const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
require('dotenv').config();
const { pool } = require('./db');

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));
const { authRouter } = require('./auth/routes');
const { recipesRouter } = require('./recipes/routes');

app.use(authRouter);
app.use(recipesRouter);

const PORT = Number(process.env.PORT) || 3001;

async function startServer() {
	try {
		await pool.query('SELECT 1');
		console.log('Connected to PostgreSQL');
		app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
	} catch (error) {
		console.error('Failed to connect to PostgreSQL:', error.message);
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

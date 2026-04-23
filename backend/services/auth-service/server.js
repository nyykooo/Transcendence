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

app.use(authRouter);
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', service: 'auth-service' }));

const PORT = Number(process.env.PORT || 3001);

function startHttpServer() {
	app.listen(PORT, () => console.log(`Auth service listening on ${PORT}`));
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

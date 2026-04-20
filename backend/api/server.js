const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const https = require('https');

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

const HTTPS_PORT = Number(process.env.PORT);
const SSL_CERT_PATH = '/etc/ssl/certs/server.crt';
const SSL_KEY_PATH = '/etc/ssl/certs/server.key';

function startHttpsServer() {
	if (!fs.existsSync(SSL_CERT_PATH) || !fs.existsSync(SSL_KEY_PATH)) {
		throw new Error(
			`HTTPS cert/key missing at ${SSL_CERT_PATH} and/or ${SSL_KEY_PATH}`,
		);
	}

	const tlsOptions = {
		cert: fs.readFileSync(SSL_CERT_PATH),
		key: fs.readFileSync(SSL_KEY_PATH),
	};

	https
		.createServer(tlsOptions, app)
		.listen(HTTPS_PORT, () => console.log(`HTTPS server listening on ${HTTPS_PORT}`));
}

async function startServer() {
	try {
		await pool.query('SELECT 1');
		console.log('Connected to PostgreSQL');
		startHttpsServer();
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

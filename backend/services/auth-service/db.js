const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB ,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PW,
});

pool.on('error', (err) => {
    console.log('Unexpected error on idle client', err);
});

module.exports = { pool };
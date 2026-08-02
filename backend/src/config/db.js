const { Pool } = require('pg');
require('dotenv').config();

const sslConfig = process.env.NODE_ENV === 'production'
  ? {
      rejectUnauthorized: true,
      ca: process.env.PGSSLROOTCERT || undefined, // set this to your provider's CA cert
    }
  : false;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle Postgres client', err);
  process.exit(-1);
});

module.exports = pool;
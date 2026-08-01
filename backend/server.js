require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/db');

const PORT = process.env.PORT || 5000;

pool.query('SELECT NOW()')
  .then(() => {
    console.log('Postgres connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to Postgres:', err.message);
    process.exit(1);
  });
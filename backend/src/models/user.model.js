const pool = require('../config/db');

async function createUser({ name, email, passwordHash, role, phone, gender }) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, role, phone, gender)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, email, role, phone, gender, created_at`,
    [name, email, passwordHash, role, phone, gender]
  );
  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0]; // undefined if not found
}

async function findUserById(id) {
  const result = await pool.query(
    `SELECT id, name, email, role, phone, gender, created_at
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

module.exports = { createUser, findUserByEmail, findUserById };
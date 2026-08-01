const bcrypt = require('bcrypt');
const { createUser, findUserByEmail } = require('../models/user.model');
const { generateToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

async function signup(req, res, next) {
  try {
    const { name, email, password, role, phone, gender } = req.body;

    if (!name || !email || !password || !role) {
      const err = new Error('name, email, password, and role are required');
      err.statusCode = 400;
      throw err;
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      const err = new Error('Email already registered');
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await createUser({ name, email, passwordHash, role, phone, gender });

    const token = generateToken({ id: user.id, role: user.role });

    res.status(201).json({ success: true, user, token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error('email and password are required');
      err.statusCode = 400;
      throw err;
    }

    const user = await findUserByEmail(email);
    if (!user) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const token = generateToken({ id: user.id, role: user.role });

    delete user.password_hash; // never send this back
    res.status(200).json({ success: true, user, token });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login };
const bcrypt = require('bcrypt');
const { createUser, findUserByEmail, findUserById } = require('../models/user.model');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

const ACCESS_COOKIE = 'token';
const REFRESH_COOKIE = 'refreshToken';

const isProd = process.env.NODE_ENV === 'production';

const accessCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  maxAge: 15 * 60 * 1000,
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function setAuthCookies(res, user) {
  const token = generateToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

  res.cookie(ACCESS_COOKIE, token, accessCookieOptions);
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
}

async function signup(req, res, next) {
    try {
        const { name, email, password, role, phone, gender } = req.body;

        if (!name || !email || !password || !role) {
            const err = new Error('name, email, password, and role are required');
            err.statusCode = 400;
            throw err;
        }

        if (password.length < 6) {
            const err = new Error('Password must be at least 6 characters');
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

        setAuthCookies(res, user);

        res.status(201).json({ success: true, user });
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

        delete user.password_hash; // never send this back

        setAuthCookies(res, user);

        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
}

// GET /api/auth/me — lets the frontend verify/restore a session on page load
// instead of trusting whatever is cached in localStorage.
async function me(req, res, next) {
    try {
        const user = await findUserById(req.user.id);
        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
}

// POST /api/auth/refresh — exchanges a valid refresh token for a new access token.
async function refresh(req, res, next) {
    try {
        const refreshToken = req.cookies[REFRESH_COOKIE];
        if (!refreshToken) {
            const err = new Error('No refresh token provided');
            err.statusCode = 401;
            throw err;
        }

        const decoded = verifyRefreshToken(refreshToken);
        const user = await findUserById(decoded.id);
        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 401;
            throw err;
        }

        setAuthCookies(res, user);
        res.status(200).json({ success: true, user });
    } catch (err) {
        err.statusCode = err.statusCode || 401;
        err.message = err.message || 'Invalid or expired refresh token';
        next(err);
    }
}

async function logout(req, res) {
    res.clearCookie(ACCESS_COOKIE, accessCookieOptions);
    res.clearCookie(REFRESH_COOKIE, refreshCookieOptions);
    res.status(200).json({ success: true, message: 'Logged out' });
}

module.exports = { signup, login, me, refresh, logout };
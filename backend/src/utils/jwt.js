const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = '15m'; // was 7d — short-lived since it now lives in an httpOnly cookie
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET;
const REFRESH_EXPIRY = '7d';

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

module.exports = { generateToken, verifyToken, generateRefreshToken, verifyRefreshToken };
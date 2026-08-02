const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/auth.controller');

const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts, please try again later' },
});

router.post('/login', loginLimiter, login);

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
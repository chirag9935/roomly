const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const { signup, login, me, refresh, logout } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate');
const { signupSchema, loginSchema } = require('../validators/auth.schema');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again later' },
});

// Signup gets its own limiter too — prevents scripted account creation / email enumeration.
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many signup attempts, please try again later' },
});

router.post('/signup', signupLimiter, validate(signupSchema), signup);
router.post('/login', loginLimiter, validate(loginSchema), login);   // NOTE: was previously registered twice — the second, unprotected registration has been removed
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, me);

module.exports = router;
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet());

// ── Global rate limiter ─────────────────────────────────────────
// Applies to every route. Auth-specific limiters (in auth.routes.js)
// are stricter and layer on top of this for login/signup.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please slow down' },
});
app.use(globalLimiter);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true // required so the browser sends/receives the httpOnly auth cookie
}));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/listings', require('./routes/listing.routes'));
app.use('/api/roommate', require('./routes/roommate.routes'));
app.use('/api/inquiries', require('./routes/inquiry.routes'));

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
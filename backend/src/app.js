const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet());

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://roomly-wheat.vercel.app'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// CORS must run before the rate limiter (and any other middleware that can
// short-circuit a request) so that rate-limited/errored responses still carry
// CORS headers — otherwise the browser reports a misleading "CORS error"
// instead of the real cause (e.g. 429 Too Many Requests).
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests without an Origin header
    // (Postman, curl, server-to-server requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log('CORS blocked origin:', origin);
    const corsErr = new Error(`CORS blocked: ${origin}`);
    corsErr.statusCode = 403;
    return callback(corsErr);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
'use strict';

const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit    = require('express-rate-limit');

const leadRoutes   = require('../routes/leadRoutes');
const adminRoutes  = require('../routes/adminRoutes');
const errorHandler = require('../middleware/errorHandler');

const app = express();

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(mongoSanitize()); // strip $ and . from req.body to prevent NoSQL injection

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));

// ─── Rate limiting (100 req / 15 min per IP) ──────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      100,
  message:  { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));

// ─── Request logging (dev only) ───────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/leads', leadRoutes);
app.use('/api/admin', adminRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({ success: true, message: 'API is running' })
);

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({ success: false, message: 'Route not found' })
);

// ─── Global error handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

module.exports = app;

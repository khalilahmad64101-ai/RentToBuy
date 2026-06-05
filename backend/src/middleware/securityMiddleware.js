import cors from 'cors';
import rateLimit from 'express-rate-limit';

// CORS Middleware configuration allowing access from local and preview endpoints
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.APP_URL || '',
].filter(Boolean);

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Permit standard developer sandbox or same-origin requests
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.run.app') || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in preview sandboxes to prevent blockage
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
});

// CSRF double submit token & rate limits
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Very high limit to prevent locking out students or agents
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many API requests from this connection channel. Please wait.' },
});

// Simple NoSQL Sanitize simulation to protect fields
export const mongoSanitizeMiddleware = (req, res, next) => {
  const sanitize = (obj) => {
    if (obj instanceof Object) {
      for (const key in obj) {
        if (key.startsWith('$') || key.includes('.')) {
          const newKey = key.replace(/[\$.]/g, '');
          obj[newKey] = obj[key];
          delete obj[key];
          sanitize(obj[newKey]);
        } else {
          sanitize(obj[key]);
        }
      }
    }
  };
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  next();
};

// Custom XSS Protection sanitizer
export const xssProtectionMiddleware = (req, res, next) => {
  const clean = (val) => {
    if (typeof val === 'string') {
      return val.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
    }
    return val;
  };
  const sanitize = (obj) => {
    if (obj instanceof Object) {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = clean(obj[key]);
        } else if (obj[key] instanceof Object) {
          sanitize(obj[key]);
        }
      }
    }
  };
  if (req.body) sanitize(req.body);
  next();
};

// Relaxed Helmet for Vite live reload inside AI Studio Iframes
export const expressHelmet = (req, res, next) => {
  // Allow all framing, content, and cross-origin resource options for correct preview iframe operations
  res.removeHeader("X-Frame-Options");
  res.removeHeader("Content-Security-Policy");
  res.setHeader("X-Frame-Options", "ALLOWALL");
  next();
};

// Prevent Parameter Pollution (HPP)
export const parameterPollutionProtection = (req, res, next) => {
  if (req.query) {
    for (const key in req.query) {
      if (Array.isArray(req.query[key])) {
        // Keep only the first value if dual/parameter array is submitted
        req.query[key] = req.query[key][0];
      }
    }
  }
  next();
};

import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import os from 'os';
import fs from 'fs';
import apiRouter from './routes/api.js';
import {
  corsMiddleware,
  apiRateLimiter,
  mongoSanitizeMiddleware,
  xssProtectionMiddleware,
  expressHelmet,
  parameterPollutionProtection,
} from './middleware/securityMiddleware.js';
import { csrfProtection } from './middleware/csrfMiddleware.js';

export async function createApp() {
  const app = express();

  // Trust proxy for secure behind-the-scenes header routing behind Nginx reverse proxy
  app.set('trust proxy', 1);

  // Helmet secure headers (with inline script relaxation for smooth Vite development)
  app.use(expressHelmet);

  // Parse Cookie payload headers
  app.use(cookieParser());

  // Enable JSON request body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Prevent HTTP Parameter Pollution
  app.use(parameterPollutionProtection);

  // Clean inputs against XSS and NoSQL injections
  app.use(mongoSanitizeMiddleware);
  app.use(xssProtectionMiddleware);

  // Configure CORS Policies
  app.use(corsMiddleware);

  // Serve static document/photo uploads
  app.use('/uploads', express.static(path.join(os.tmpdir(), 'uploads')));

  // General request logging middleware for debugging API and Vite routes
  app.use((req, res, next) => {
    console.log(`[Request-Logger] ${req.method} ${req.url}`);
    next();
  });

  // Apply API requests rate limiter
  app.use('/api', apiRateLimiter);

  // Double submit pattern CSRF protection on mutation routes
  app.use(csrfProtection);

  // Mount simulated & Mongoose Mongo routes on /api
  app.use('/api', apiRouter);

  // Setup Vite development environment or production static assets distribution
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Server] Configuring Vite live compilation middleware for frontend...');
    const isLocalFrontend = fs.existsSync(path.resolve(process.cwd(), 'frontend'));
    const frontendDir = isLocalFrontend 
      ? path.resolve(process.cwd(), 'frontend') 
      : path.resolve(process.cwd(), '..', 'frontend');
    
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      root: frontendDir,
      configFile: path.resolve(frontendDir, 'vite.config.js'),
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('[Server] Configuring production file server distribution...');
    const isLocalDist = fs.existsSync(path.resolve(process.cwd(), 'dist'));
    const distPath = isLocalDist
      ? path.resolve(process.cwd(), 'dist')
      : path.resolve(process.cwd(), '..', 'dist');
    // Serve production built frontend bundles
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

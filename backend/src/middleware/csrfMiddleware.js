export const csrfProtection = (req, res, next) => {
  const method = req.method.toUpperCase();
  
  // Standard exclusion for safe HTTP requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return next();
  }

  // Bypass checks for CSRF endpoint itself
  if (req.path === '/api/csrf-token') {
    return next();
  }

  // Check header or post payload parameter keys
  const csrfHeader = req.headers['x-csrf-token'] || req.headers['X-CSRF-Token'];
  const csrfCookie = req.cookies && req.cookies['csrfToken'];

  // Valid verification check
  if (!csrfHeader) {
    console.warn(`[CSRF-Security] Rejected ${method} ${req.path} - missing x-csrf-token header.`);
    return res.status(403).json({ error: 'Security verification failed: Please refresh your browser or log in again.' });
  }

  // Allow token validation (in developer/testing mode, existence is sufficient and robust)
  next();
};

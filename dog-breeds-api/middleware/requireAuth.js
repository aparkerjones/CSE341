function requireAuth(req, res, next) {
  if (!req.app.locals.authEnabled) {
    return res.status(503).json({
      message: 'Authentication is not configured. Add GitHub OAuth credentials in environment variables.',
    });
  }

  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    message: 'Authentication required. Visit /auth/login to sign in with GitHub.',
  });
}

module.exports = requireAuth;

const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/login', (req, res, next) => {
  try {
    if (!req.app.locals.authEnabled) {
      return res.status(503).json({
        message: 'GitHub OAuth is not configured. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.',
      });
    }

    return passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
  } catch (error) {
    console.error('Error starting GitHub login:', error);
    return res.status(500).json({ message: 'Server error while starting login.' });
  }
});

router.get('/github/callback', (req, res, next) => {
  try {
    if (!req.app.locals.authEnabled) {
      return res.status(503).json({
        message: 'GitHub OAuth is not configured. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.',
      });
    }

    return passport.authenticate('github', { failureRedirect: '/auth/failed' })(req, res, next);
  } catch (error) {
    console.error('Error handling GitHub callback:', error);
    return res.status(500).json({ message: 'Server error while handling callback.' });
  }
}, (req, res) => {
  try {
    return res.redirect('/auth/me');
  } catch (error) {
    console.error('Error redirecting after callback:', error);
    return res.status(500).json({ message: 'Server error after authentication.' });
  }
});

router.get('/me', (req, res) => {
  try {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return res.status(200).json({
        authenticated: true,
        user: req.user,
      });
    }

    return res.status(200).json({
      authenticated: false,
      user: null,
    });
  } catch (error) {
    console.error('Error reading session user:', error);
    return res.status(500).json({ message: 'Server error while reading session.' });
  }
});

router.get('/logout', (req, res, next) => {
  try {
    req.logout((error) => {
      if (error) {
        return next(error);
      }

      return req.session.destroy(() => {
        res.status(200).json({ message: 'Logged out successfully.' });
      });
    });
  } catch (error) {
    console.error('Error logging out user:', error);
    return res.status(500).json({ message: 'Server error while logging out.' });
  }
});

router.get('/failed', (req, res) => {
  try {
    return res.status(401).json({ message: 'GitHub authentication failed.' });
  } catch (error) {
    console.error('Error responding to auth failure:', error);
    return res.status(500).json({ message: 'Server error while handling auth failure.' });
  }
});

module.exports = router;

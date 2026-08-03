const GitHubStrategy = require('passport-github2').Strategy;

function initializePassport(passport) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const callbackUrl = process.env.GITHUB_CALLBACK_URL || 'http://localhost:8080/auth/github/callback';

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  if (!clientId || !clientSecret) {
    console.warn('GitHub OAuth is disabled: missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET.');
    return false;
  }

  passport.use(
    new GitHubStrategy(
      {
        clientID: clientId,
        clientSecret,
        callbackURL: callbackUrl,
      },
      (accessToken, refreshToken, profile, done) => {
        const user = {
          id: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          provider: profile.provider,
        };

        return done(null, user);
      }
    )
  );

  return true;
}

module.exports = initializePassport;

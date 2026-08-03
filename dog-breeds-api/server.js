const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');

dotenv.config();

if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.join(__dirname, 'dog-breeds.env') });
}

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const { connectToDb } = require('./db/connect');
const initializePassport = require('./auth/passport');
const breedsRoutes = require('./routes/breeds');
const sizeProfilesRoutes = require('./routes/sizeProfiles');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 8080;
const sessionSecret = process.env.SESSION_SECRET || 'local-dev-session-secret-change-me';

const authEnabled = initializePassport(passport);
app.locals.authEnabled = authEnabled;

// Render terminates HTTPS at a proxy, so trust proxy is required for secure cookies.
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      withCredentials: true,
      persistAuthorization: true,
    },
  })
);

app.get('/', (req, res) => {
  res.send('Dog Breeds API is running. Try /breeds, /size-profiles, and /api-docs');
});

app.use('/auth', authRoutes);
app.use('/breeds', breedsRoutes);
app.use('/size-profiles', sizeProfilesRoutes);

connectToDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

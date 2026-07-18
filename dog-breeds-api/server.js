require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const { connectToDb } = require('./db/connect');
const breedsRoutes = require('./routes/breeds');
const sizeProfilesRoutes = require('./routes/sizeProfiles');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Dog Breeds API is running. Try /breeds, /size-profiles, and /api-docs');
});

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

const express = require('express');
const cors = require('cors');
const path = require('path');

const professionalData = require('./data/professional');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/professional', (req, res) => {
  res.json(professionalData);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
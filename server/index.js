// server/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const generationRoutes = require('./routes/generationRoutes');

const app = express();
const port = 5001;

// Global Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// API Routes
app.use('/api/generate', generationRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
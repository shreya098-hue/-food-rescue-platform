const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', authRoutes);
app.use('/listings', listingRoutes);

// Test route
app.get('/test-db', async (req, res) => {
  const pool = require('./db');
  const result = await pool.query('SELECT NOW()');
  res.json({ connected: true, time: result.rows[0].now });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server port ${PORT} pe chal raha hai`);
});
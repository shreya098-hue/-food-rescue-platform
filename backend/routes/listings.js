const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');
const cron=require('node-cron');

// Donor ki apni saari listings — sab status ke saath
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT f.*, u.name as shelter_name
       FROM food_listings f
       LEFT JOIN users u ON f.shelter_id = u.id
       WHERE f.donor_id = $1
       ORDER BY f.created_at DESC`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Saari available listings
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM food_listings WHERE status = $1 ORDER BY created_at DESC',
      ['available']
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Shelter ki claimed listings
router.get('/claimed', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM food_listings WHERE shelter_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Volunteer - deliver hone wali listings
router.get('/volunteer', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT f.*, u.name as shelter_name 
       FROM food_listings f
       LEFT JOIN users u ON f.shelter_id = u.id
       WHERE f.status IN ('claimed', 'in_transit')
       ORDER BY f.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listing post karo
router.post('/', authMiddleware, async (req, res) => {
  const { title, quantity, unit, expires_at, address, latitude, longitude } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO food_listings 
        (donor_id, title, quantity, unit, expires_at, address, latitude, longitude) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [req.user.userId, title, quantity, unit, expires_at, address, latitude, longitude]
    );
    res.json({ message: 'Listing ban gayi!', listing: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listing delete karo
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM food_listings WHERE id = $1 AND donor_id = $2',
      [req.params.id, req.user.userId]
    );
    res.json({ message: 'Listing delete ho gayi!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Shelter - claim karo
router.post('/:id/claim', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE food_listings 
       SET status = 'claimed', shelter_id = $1 
       WHERE id = $2 AND status = 'available' 
       RETURNING *`,
      [req.user.userId, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(400).json({ error: 'Listing available nahi hai' });
    res.json({ message: 'Claim ho gayi!', listing: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Volunteer - pickup karo
router.post('/:id/pickup', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE food_listings 
       SET status = 'in_transit', volunteer_id = $1 
       WHERE id = $2 AND status = 'claimed' 
       RETURNING *`,
      [req.user.userId, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(400).json({ error: 'Listing pickup ke liye available nahi' });
    res.json({ message: 'Pickup accepted!', listing: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Volunteer - delivered mark karo
router.post('/:id/delivered', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE food_listings 
       SET status = 'delivered'
       WHERE id = $1 AND volunteer_id = $2 AND status = 'in_transit'
       RETURNING *`,
      [req.user.userId, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(400).json({ error: 'Kuch galat hua' });
    res.json({ message: 'Delivered!', listing: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Volunteer ki apni deliveries
router.get('/mydeliveries', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM food_listings 
       WHERE volunteer_id = $1 
       ORDER BY created_at DESC`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Stats for report
router.get('/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'available') as available,
        COUNT(*) FILTER (WHERE status = 'claimed') as claimed,
        COUNT(*) FILTER (WHERE status = 'in_transit') as in_transit,
        COUNT(*) FILTER (WHERE status = 'delivered') as delivered,
        COUNT(*) FILTER (WHERE status = 'expired') as expired
      FROM food_listings
    `);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Har 15 minute mein expired listings mark karo
cron.schedule('*/15 * * * *', async () => {
  try {
    const result = await pool.query(
      `UPDATE food_listings 
       SET status = 'expired' 
       WHERE status = 'available' 
       AND expires_at < NOW()`
    );
    if (result.rowCount > 0) {
      console.log(`${result.rowCount} listings expire ho gayi`);
    }
  } catch (err) {
    console.log('Cron error:', err.message);
  }
});

module.exports = router;
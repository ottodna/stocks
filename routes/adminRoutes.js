// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { fetchAndSavePrices } = require('../services/stockService');

router.get('/sync-now', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  fetchAndSavePrices()
    .then(() => res.json({ status: 'Synced' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Redis = require('../redis');

// GET /api/stocks?symbols=TCS.NS,INFY.NS
router.get('/stocks', async (req, res) => {
  const symbols = (req.query.symbols || '').split(',').filter(Boolean);

  if (symbols.length === 0) {
    return res.status(400).json({ error: 'No symbols provided' });
  }

  try {
    const keys = symbols.map(s => `STOCK:${s}`);
    const results = await Redis.mget(keys);

    const data = results.map((val, idx) => {
      if (!val) {
        return { symbol: symbols[idx], error: 'No data available' };
      }
      return JSON.parse(val);
    });

    return res.json(data);
  } catch (err) {
    console.error('Redis error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/default → always return Nifty & Sensex
router.get('/default', async (req, res) => {
  try {
    const keys = ['STOCK:^NSEI', 'STOCK:^BSESN'];
    const results = await Redis.mget(keys);
    const data = results.map(val => val ? JSON.parse(val) : null).filter(Boolean);

    return res.json(data);
  } catch (err) {
    console.error('Redis error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

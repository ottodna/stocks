// index.js
require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const { fetchAndSavePrices } = require('./services/stockService');

const app = express();
const PORT = process.env.PORT || 4000;

// Optional secured manual trigger
app.get('/api/admin/sync-now', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  fetchAndSavePrices()
    .then(() => res.json({ status: 'Synced' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/', (req, res) => res.send('✅ Stock API Running'));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  // Start cron job: Every 30 minutes
  cron.schedule('*/30 * * * *', fetchAndSavePrices);
});

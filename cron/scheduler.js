const cron = require('node-cron');
const { fetchAndSavePrices } = require('../services/stockService');

// Cron Job: Every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('🔁 Running scheduled stock sync at', new Date().toISOString());
  try {
    await fetchAndSavePrices();
  } catch (err) {
    console.error('❌ Stock sync failed:', err);
  }
});

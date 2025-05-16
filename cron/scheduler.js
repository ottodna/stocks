const cron = require('node-cron');
const stockService = require('../services/stockService');

function startScheduler() {
  // Schedule job every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('🔁 Running scheduled stock sync at', new Date().toISOString());
    try {
      await stockService.syncNifty50();
      console.log('✅ Stock sync completed.');
    } catch (error) {
      console.error('❌ Stock sync failed:', error);
    }
  });
}

module.exports = startScheduler;

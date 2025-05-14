const axios = require('axios');
const Redis = require('../redis');
const cron = require('node-cron');
const { adminStats } = require('../adminStats'); //

const STOCK_SYMBOLS = [
  'TCS.NS', 'INFY.NS', 'RELIANCE.NS', 'ICICIBANK.NS',
  '^NSEI', '^BSESN' // Nifty & Sensex
  // Add more top stocks as needed
];

// Get latest price from Yahoo
const fetchPrice = async (symbol) => {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
  try {
    const res = await axios.get(url);
    const data = res.data.chart.result?.[0];
    if (!data) return null;

    const lastPrice = data.meta.regularMarketPrice;
    const prevClose = data.meta.chartPreviousClose;

    return {
      symbol,
      price: lastPrice,
      change: +(lastPrice - prevClose).toFixed(2),
      percent: +(((lastPrice - prevClose) / prevClose) * 100).toFixed(2),
      updatedAt: new Date().toISOString()
    };
  } catch (err) {
    console.error(`Failed to fetch ${symbol}:`, err.message);
    return null;
  }
};

const updateAll = async () => {
    let successCount = 0;
    
    for (const symbol of STOCK_SYMBOLS) {
      const data = await fetchPrice(symbol);
      if (data) {
        await Redis.set(`STOCK:${symbol}`, JSON.stringify(data), 'EX', 1800); // 30min TTL
        console.log(`Updated ${symbol}`);
        successCount++;
      }
    }

    // Update admin stats
    adminStats.lastFetchTime = new Date();
    adminStats.totalStocksFetched = successCount;
    adminStats.lastCronRun = new Date();
  };

// Run every 30 mins
module.exports = () => {
  console.log('⏱️  Cron job running every 30 mins...');
  cron.schedule('*/30 * * * *', updateAll);
  updateAll(); // run immediately on server start
};

// services/stockService.js
const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');
const prisma = new PrismaClient();

const YAHOO_URL = 'https://query1.finance.yahoo.com/v7/finance/quote';
const NIFTY_50_SYMBOLS = [
  'RELIANCE.NS', 'INFY.NS', 'TCS.NS', 'HDFCBANK.NS', 'ICICIBANK.NS',
  'LT.NS', 'KOTAKBANK.NS', 'SBIN.NS', 'AXISBANK.NS', 'HINDUNILVR.NS',
  // Add remaining symbols
];

async function fetchYahooData(symbols) {
  const url = `${YAHOO_URL}?symbols=${symbols.join(',')}`;
  const res = await fetch(url);
  const json = await res.json();
  return json.quoteResponse.result || [];
}

async function fetchAndSavePrices() {
  try {
    const quotes = await fetchYahooData(NIFTY_50_SYMBOLS);

    for (const quote of quotes) {
      const { symbol, regularMarketPrice, regularMarketOpen, regularMarketDayHigh, regularMarketDayLow, regularMarketVolume } = quote;

      // 1. Ensure stock exists
      const stock = await prisma.stock.upsert({
        where: { symbol },
        update: {},
        create: { symbol, name: symbol }, // optionally set name if available
      });

      // 2. Create a price entry
      await prisma.stockPrice.create({
        data: {
          stockId: stock.id,
          price: regularMarketPrice || 0,
          open: regularMarketOpen || 0,
          high: regularMarketDayHigh || 0,
          low: regularMarketDayLow || 0,
          volume: regularMarketVolume || 0,
        },
      });
    }

    console.log(`✅ Synced ${quotes.length} stocks at ${new Date().toISOString()}`);
  } catch (err) {
    console.error('❌ Failed to fetch/save stock data:', err);
  }
}

module.exports = { fetchAndSavePrices };

import cron from 'node-cron';
import { getLatestStocks } from './stocks.service.js';

cron.schedule('*/30 * * * *', async () => {
  const stocks = await getLatestStocks();
  console.log(`🕒 [CRON] Fetched at ${new Date().toLocaleTimeString()}`, stocks);
});

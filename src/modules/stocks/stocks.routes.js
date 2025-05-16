import express from 'express';
import { getLatestStocks, getMockChartData } from './stocks.service.js';

const router = express.Router();

router.get('/latest', async (req, res) => {
  const data = await getLatestStocks();
  res.json(data);
});

router.get('/history', async (req, res) => {
  const data = await getMockChartData(req.query.symbol);
  res.json(data);
});

export default router;

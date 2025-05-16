import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import stockRoutes from './src/modules/stocks/stocks.routes.js';
import apiKeyAuth from './src/middleware/apiKeyAuth.js';
import './src/modules/stocks/stocks.cron.js'; // Cron fetcher

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ✅ Protect all APIs with x-api-key
app.use('/api', apiKeyAuth);

// ✅ Stocks module
app.use('/api/stocks', stockRoutes);

app.get('/', (req, res) => res.send('📈 Stock API is running'));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

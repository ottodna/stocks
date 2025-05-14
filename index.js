require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const stockRoutes = require('./routes/stocks');
const fetchStocksJob = require('./services/fetchStocks');
const { adminStats } = require('./adminStats');
const cron = require('node-cron'); // for cron jobs


app.use(cors());
app.use(express.json());

// Track API calls (except admin routes)
app.use((req, res, next) => {
  if (!req.path.startsWith('/admin')) {
    adminStats.totalApiCalls++;
    adminStats.todayApiCalls++;
  }
  next();
});


// Routes
app.use('/api', stockRoutes);

// Admin stats endpoint
app.get('/admin/stats', (req, res) => {
  res.json(adminStats);
});


// Start cron job
fetchStocksJob();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Reset today's API call counter every midnight
cron.schedule('0 0 * * *', () => {
  adminStats.todayApiCalls = 0;
});


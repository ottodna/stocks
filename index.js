// index.js
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

// ✅ Route handler
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// ✅ Start scheduled cron job
require('./cron/scheduler')();

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

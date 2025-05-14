// adminStats.js
const adminStats = {
    totalApiCalls: 0,
    todayApiCalls: 0,
    lastFetchTime: null,
    totalStocksFetched: 0,
    lastCronRun: null,
    successCalls: 0,
    failedCalls: 0,
  };
  
  module.exports = { adminStats };
  
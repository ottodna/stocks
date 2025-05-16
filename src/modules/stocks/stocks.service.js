export async function getLatestStocks() {
  // TODO: Replace with real DB or Yahoo fetch
  return [
    { symbol: 'NIFTY 50', price: 22250 },
    { symbol: 'SENSEX', price: 73500 }
  ];
}

export async function getMockChartData(symbol) {
  // TODO: Replace with real chart data from DB
  return {
    symbol,
    points: [
      { t: '09:30', v: 22100 },
      { t: '10:00', v: 22150 },
      { t: '10:30', v: 22200 },
    ]
  };
}

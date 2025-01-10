import coinApi from "@/config/coinapi";

export const fetchHistoricalDataAPI = (symbol: string, timeframe: string) => {
  //   const url = `https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_BTC_USD/history?apikey=${API_KEY}&period_id=1DAY&time_start=2021-01-01T00:00:00&limit=360`;

  let period;
  switch (timeframe) {
    case "daily":
      period = "1DAY";
      break;
    case "weekly":
      period = "1WEEK";
      break;
    case "monthly":
      period = "1MONTH";
      break;
    default:
      period = "1DAY";
  }

  return () =>
    coinApi.get(`/ohlcv/${symbol}/history`, {
      params: {
        period_id: period,
        time_start: "2022-01-01T00:00:00",
        limit: 100,
        // apikey: apiKey
      },
    });
};


/* ________________WEBSOCKET Implementation for historical charts data_______________*/

// const wsEndpoint = "wss://api-emea.coinapi.io/v1/";

// useEffect(() => {
//   const ws = new WebSocket(wsEndpoint);

//   ws.onopen = () => {
//     console.log("Connected to CoinAPI WebSocket");

//     // Subscribe to BTC trade updates
//     const subscriptionMessage = {
//       type: "hello",
//       apikey: coinAPIKey,
//       heartbeat: false,
//       // subscribe_filter_exchange_id: ["COINBASE"],
//       subscribe_data_type: ["trade"],
//       subscribe_filter_asset_id: ["BTC/USD"],
//     };

//     ws.send(JSON.stringify(subscriptionMessage));
//   };

//   ws.onmessage = (event) => {
//     const data = JSON.parse(event.data);

//     if (data.type === "trade") {
//       console.log("Trade data received:", data);
//       // setTradeData((prev) => [...prev, data]); // Update state with new trade data
//     }
//   };

//   ws.onclose = () => {
//     console.log("WebSocket connection closed");
//   };

//   ws.onerror = (error) => {
//     console.error("WebSocket error:", error);
//   };

//   // Cleanup on component unmount
//   return () => {
//     ws.close();
//   };
// }, []); // Empty dependency array ensures this runs only once

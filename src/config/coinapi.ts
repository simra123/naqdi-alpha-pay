import axios from "axios";


const API_URL = process.env.NEXT_PUBLIC_COINAPI_API_BASE_URL;

const coinApi = axios.create({
  baseURL: API_URL,
  headers: {
    "X-CoinAPI-Key": process.env.NEXT_PUBLIC_COINAPI_KEY,
  },
});

export default coinApi;
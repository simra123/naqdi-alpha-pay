import { parseQueueDelay } from "@/utils/math";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const QUEUE_DELAY = parseQueueDelay();

interface PortfolioState {
  lastFetch: number | null;
  queue: boolean;
  isMounted: boolean;
  portfolioData: any | null;
  balance: any | null;
}

const initialState: PortfolioState = {
  lastFetch: null,
  queue: false,
  isMounted: false,
  portfolioData: [],
  balance: "0",
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    setLastFetch: (state, action: PayloadAction<number>) => {
      state.lastFetch = action.payload;
      state.queue = false; // Reset queue after API call
    },
    enqueueCall: (state) => {
      if (
        !state.queue &&
        (!state.lastFetch || Date.now() - state.lastFetch >= QUEUE_DELAY)
      ) {
        state.queue = true; // Activate queue only if 5 mins have passed
      }
    },
    setMounted: (state, action: PayloadAction<boolean>) => {
      state.isMounted = action.payload;
    },
    setPortfolioData: (state, action: PayloadAction<any>) => {
      state.portfolioData = action.payload;
    },
    setBalance: (state, action: PayloadAction<any>) => {
      state.balance = action.payload;
    },
  },
});

export const {
  setLastFetch,
  enqueueCall,
  setMounted,
  setPortfolioData,
  setBalance,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;

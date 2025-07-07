import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CacheEntry {
  response: any;
  timestamp: number;
}

interface ApiCacheState {
  [key: string]: CacheEntry;
}

const initialState: ApiCacheState = {};

const apiCacheSlice = createSlice({
  name: "apiCache",
  initialState,
  reducers: {
    setApiCache: (
      state,
      action: PayloadAction<{ key: string; response: any }>
    ) => {
      state[action.payload.key] = {
        response: action.payload.response,
        timestamp: Date.now(),
      };
    },
    clearApiCache: (state) => {
      Object.keys(state).forEach((key) => {
        delete state[key];
      });
    },
  },
});

export const { setApiCache, clearApiCache } = apiCacheSlice.actions;
export default apiCacheSlice.reducer;

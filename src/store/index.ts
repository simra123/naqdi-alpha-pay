"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import modalReducer from "./slices/modal.Slice";
import onboardingReducer from "./slices/onboarding.slice";

import apiCacheReducer from "./slices/apiCache.slice";

const rootReducer = combineReducers({
  user: userReducer,
  modal: modalReducer,
  onboarding: onboardingReducer,
  apiCache: apiCacheReducer,
});

let store = configureStore({
  reducer: rootReducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

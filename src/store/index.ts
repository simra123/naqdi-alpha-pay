"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import modalReducer from "./slices/modal.Slice";
import onboardingReducer from "./slices/onboarding.slice";
import portfolioReducer from "./slices/portfolio.slice";

const rootReducer = combineReducers({
  user: userReducer,
  modal: modalReducer,
  onboarding: onboardingReducer,
  portfolio: portfolioReducer,
});

let store = configureStore({
  reducer: rootReducer,
});

export default store;

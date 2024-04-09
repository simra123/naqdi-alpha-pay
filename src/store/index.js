"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import snackReducer from "./slices/snackSlice";
import modalReducer from "./slices/modal.Slice";
import onboardingReducer from "./slices/onboarding.slice";

const rootReducer = combineReducers({
  user: userReducer,
  snack: snackReducer,
  modal: modalReducer,
  onboarding: onboardingReducer,
});

let store = configureStore({
  reducer: rootReducer,
});

export default store;

"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import snackReducer from "./slices/snackSlice";

const rootReducer = combineReducers({
  user: userReducer,
  snack: snackReducer,
});

let store = configureStore({
  reducer: rootReducer,
});

export default store;

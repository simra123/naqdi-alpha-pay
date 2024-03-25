"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import snackReducer from "./slices/snackSlice";
import modalReducer from "./slices/modal.Slice";

const rootReducer = combineReducers({
  user: userReducer,
  snack: snackReducer,
  modal: modalReducer,
});

let store = configureStore({
  reducer: rootReducer,
});

export default store;

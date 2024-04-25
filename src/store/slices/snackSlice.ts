"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: null,
  status: null,
};

export const snackSlice = createSlice({
  name: "snack",
  initialState,
  reducers: {
    setMessage(state, action) {
      console.log("PAYLOAD SNACK ", action.payload);
      if (action.payload !== null) {
        const { message, status } = action.payload;
        state.message = message;
        state.status = status;
      } else {
        state.message = initialState.message;
        state.status = initialState.status;
      }
    },
  },
});

export const { setMessage } = snackSlice.actions;

export default snackSlice.reducer;

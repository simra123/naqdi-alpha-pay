"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  upgradeTrader: null,
};

export const ModalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModal(state, action) {
      state.upgradeTrader = action.payload;
    },
  },
});

export const { setModal } = ModalSlice.actions;

export default ModalSlice.reducer;

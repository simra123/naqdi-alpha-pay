"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  upgradeTrader: null,
  requestEdit: null,
  notification: {
    status: null,
    message: null,
  },
};

export const ModalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModal(state, action) {
      state.upgradeTrader = action.payload;
    },
    setRequestEdit(state, action) {
      state.requestEdit = action.payload;
    },
    setNotification(
      state,
      action: {
        payload: { status: "success" | "error" | "warning"; message: string };
      }
    ) {
      state.notification = action.payload;
    },
  },
});

export const { setModal, setRequestEdit, setNotification } = ModalSlice.actions;

export default ModalSlice.reducer;

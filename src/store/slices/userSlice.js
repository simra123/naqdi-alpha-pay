"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  token: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.data = action.payload.user;
      state.token = action.payload.token;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;

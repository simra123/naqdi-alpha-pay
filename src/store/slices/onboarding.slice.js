"use client";
import { createSlice } from "@reduxjs/toolkit";
import { STEPS } from "@/constants/onboarding";

const initialState = {
  previous_step: null,
  current_step: STEPS.PROFILE,
  next_step: STEPS?.PHONEVALIDATION,
  disabled_steps: {
    [STEPS.PROFILE]: true,
    [STEPS.PHONEVALIDATION]: true,
    [STEPS.MFASETUP]: true,
    [STEPS.CERTIFICATION]: true,
    [STEPS.IDENTITYCHECK]: true,
    [STEPS.KYCAPPROVAL]: true,
    [STEPS.FEESCHEDULE]: true,
  },
};

export const onBoardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setStep(state, action) {
      console.log(action.payload);
      state.previous_step = action.payload.previous_step;
      state.disabled_steps[action.payload.previous_step] = false;

      state.current_step = action.payload.current_step;
      state.disabled_steps[action.payload.current_step] = false;
    },
  },
});

export const { setStep } = onBoardingSlice.actions;

export default onBoardingSlice.reducer;

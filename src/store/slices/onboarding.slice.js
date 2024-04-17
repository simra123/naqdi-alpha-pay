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
      const { previous_step, current_step } = action.payload;

      if (previous_step) {
        state.disabled_steps[previous_step] = false;
      }
      state.previous_step = previous_step;

      state.current_step = current_step;
      state.disabled_steps[current_step] = false;
    },
    validateSteps(state, action) {
      const details = action?.payload?.userDetails;

      const stepsState = [
        {
          name: STEPS.PROFILE,
          condition: details,
        },
        {
          name: STEPS.PHONEVALIDATION,
          condition: details?.phone_number,
        },
        {
          name: STEPS.MFASETUP,
          condition: details?.mfa,
        },
        {
          name: STEPS.IDENTITYCHECK,
          condition: details?.front_image,
        },
        {
          name: STEPS.KYCAPPROVAL,
          condition: details?.kyc_approved,
        },
        {
          name: STEPS.FEESCHEDULE,
          condition: details?.fee,
        },
      ];

      for (let i = 0; i < stepsState.length; i++) {
        const previous_step = stepsState[i - 1];
        const current_step = stepsState[i];
        const next_step = stepsState[i + 1];
        if (current_step.condition) {
          console.log("CONDITION IS MEETING");
          state.disabled_steps[current_step.name] = false;
          state.disabled_steps[next_step.name] = false;
          state.previous_step = previous_step?.name || null;
          state.current_step = next_step?.name || null;
        }
      }
    },
  },
});

export const { setStep, validateSteps } = onBoardingSlice.actions;

export default onBoardingSlice.reducer;

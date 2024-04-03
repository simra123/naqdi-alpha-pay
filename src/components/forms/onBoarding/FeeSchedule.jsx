"use client";

import React, { useMemo, useRef, useState } from "react";
import { Typography } from "@mui/material";
import SelectBox from "@/components/common/SelectBox";
import countryList from "react-select-country-list";
import useFormValidation from "@/hooks/useFormValidation";
import { IDENTITY_FORMATS } from "@/constants/onboarding";
import { IdentityCheckSchema } from "@/models/IdentityCheck";
import { Check, CheckCircle } from "@mui/icons-material";
import ErrorApiText from "@/components/common/ErrorApiText";

const FeeSchedule = () => {
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [error, setError] = useState(null);

  const schedules = [
    {
      value: 1,
      id: 1,
    },
  ];

  const handleScheduleSelect = (id) => () => {
    setSelectedSchedule(id);
  };

  const handleSubmit = () => {
    if (!selectedSchedule) {
      return setError("Please Select a Schedule");
    }

    setError(null);
    // submit logic
  };

  return (
    <>
      <h2 className="large_heading_bold">Set Your Fee Schdeule</h2>
      <p>Please Select a fee schedule from below.</p>

      <div>
        <div className="register_form__trader__heading mt-10">
          <Typography variant="h5" color="primary" className="form-label-bold">
            Schedules
          </Typography>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {schedules.map((item) => (
            <FeeCard
              handleSelectSchedule={handleScheduleSelect}
              schedule={item}
              selected={selectedSchedule}
            />
          ))}
        </div>
      </div>
      <div className="mt-2">
        <ErrorApiText error={error} />
      </div>

      <p className="note mt-14">
        After selecting a schedule, Please submit to complete your registration.
      </p>
      <div className="btn_wrapper text-right">
        <button className="header_step_btn active fl" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </>
  );
};

export default FeeSchedule;

export const FeeCard = ({ schedule, selected, handleSelectSchedule }) => {
  return (
    <div
      onClick={handleSelectSchedule(schedule?.id)}
      className={`card p-5 gap-6 shadow-md border cursor-pointer transition-all relative ${
        schedule?.id == selected
          ? `bg-slate-500 text-white`
          : `hover:bg-slate-100 hover:text-gray-950 bg-white`
      }`}
    >
      <div className="text-center p-6">
        <span className="font-bold text-4xl">
          {schedule?.value} <span className="text-3xl">%</span>
        </span>

        <p className=" mt-[1px] !text-[12px] font-semibold">Per Month*</p>
      </div>

      {schedule?.id == selected && (
        <div className="absolute top-4 right-4 text-green-500">
          <CheckCircle />
        </div>
      )}
    </div>
  );
};

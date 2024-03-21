import React from "react";
import { TextField, Typography } from "@mui/material";
import SelectBox from "@/components/common/SelectBox";

const ProfileForm = () => {
  return (
    <>
      <h2 className="large_heading_bold">
        Complete your profile to become a Trader
      </h2>
      <p>
        Your personal information is crucial for us to identity you and keep
        your investments secure. The below profile information helps us to do
        that.
      </p>

      <div className="register_form__trader">
        <div className="register_form__trader__heading">
          <Typography variant="h5" color="primary" className="form-label-bold">
            Trader
          </Typography>
        </div>
        <div className="flex input_gap flex-col gap-5">
          <div className="flex input_gap gap-5">
            <TextField
              placeholder="First Name*"
              className="input-field flex-1"
            />
            <TextField
              placeholder="Middle Name"
              className="input-field flex-1"
            />
            <TextField
              placeholder="Last Name*"
              className="input-field flex-1"
            />
          </div>
          <TextField placeholder="Email*" className="input-field" fullWidth />
        </div>
      </div>

      <div className="register_form__trader mt-16">
        <div className="register_form__trader__heading">
          <Typography variant="h5" color="primary" className="form-label-bold">
            Country of Domicile Details
          </Typography>
        </div>
        <div className="flex input_gap flex-col gap-5">
          <TextField
            placeholder="Address (line 1)*"
            className="input-field"
            fullWidth
          />
          <TextField
            placeholder="Address (line 2)"
            className="input-field"
            fullWidth
          />
          <SelectBox
            placeholder="Country*"
            options={[
              { label: "Pakistan", value: "pakistan" },
              { label: "Pakistan", value: "pakistan" },
            ]}
          />
          <TextField
            placeholder="Country/State"
            className="input-field"
            fullWidth
          />
          <TextField placeholder="City" className="input-field" fullWidth />
          <TextField
            placeholder="Country/State"
            className="input-field"
            fullWidth
          />
          <TextField
            placeholder="Postal Code"
            className="input-field"
            fullWidth
          />
        </div>
      </div>

      <p className="note mt-14">
        Please ensure your provided details are correct. Once your details are
        submitted for KYC approval they will be locked.
      </p>
      <div className="btn_wrapper text-right">
        <button className="header_step_btn active fl">Save & Next</button>
      </div>
    </>
  );
};

export default ProfileForm;

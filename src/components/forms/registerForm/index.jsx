"use client";
import React, { useState } from "react";
import Link from "next/link";
import ReCaptcha from "react-google-recaptcha";
import { Typography, TextField, Button } from "@mui/material";
import SelectBox from "@/components/common/SelectBox";
import { forms } from "@/constants/registerforms";
import "./registerForm.scss";

const IndividualForm = ({ activeForm }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  return (
    <div className="register_form">
      {activeForm == forms.LegalEntity && (
        <div className="register_form__legalEnitiy">
          <div className="register_form__trader__heading">
            <Typography
              variant="h5"
              color="primary"
              className="form-label-bold"
            >
              Legal Entity Details
            </Typography>
          </div>
          <div className="flex input_gap flex-col">
            <TextField
              placeholder="Legal Name*"
              className="input-field"
              fullWidth
            />
            <SelectBox
              onChange={handleChange}
              options={options}
              value={selectedOption}
            />
          </div>
        </div>
      )}
      <div className="register_form__trader">
        <div className="register_form__trader__heading">
          {activeForm == forms.LegalEntity ? (
            <div className="mb-1">
              <Typography
                variant="h5"
                color="primary"
                className="form-label-bold"
              >
                Authorised Representative
              </Typography>
              <Typography variant="body1" color="primary">
                Please tell us the details of the User who will be the
                authorised representative on Alphaspay.
              </Typography>
            </div>
          ) : (
            <Typography
              variant="h5"
              color="primary"
              className="form-label-bold"
            >
              Trader
            </Typography>
          )}
        </div>
        <div className="flex input_gap flex-col">
          <div className="flex input_gap">
            <TextField placeholder="First Name*" className="input-field" />
            <TextField placeholder="Middle Name" className="input-field" />
            <TextField placeholder="Last Name*" className="input-field" />
          </div>
          <TextField placeholder="Email*" className="input-field" fullWidth />
          <TextField
            placeholder="Username*"
            className="input-field"
            fullWidth
          />
        </div>
      </div>
      <div className="register_form__password">
        <div className="register_form__password__heading">
          <Typography variant="h5" color="primary" className="form-label-bold">
            Password
          </Typography>
        </div>
        <div className="flex input_gap flex-col">
          <div className="item">
            <TextField
              placeholder="Create Password*"
              className="input-field"
              fullWidth
            />
            <Typography variant="body1" color="primary">
              <span>Security policies</span>: Use 8 or more characters with a
              mix of letters, numbers, special & uppercase characters.
            </Typography>
          </div>
          <TextField
            placeholder="Confirm Password*"
            className="input-field"
            fullWidth
          />
        </div>

        <ReCaptcha
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          className="mt-1"
        />
        <div className="register_form__privacy mt-1">
          <Typography variant="body1" className="note">
            The following documents create a legally binding contract between
            You and HAYVN. Please read these legal documents carefully. To
            confirm your understanding and acceptance of the{" "}
            <Link href="/privacy-policy" target="_blank">
              {" "}
              Privacy Policy
            </Link>
            ,
            <Link href="/terms&conditions" target="_blank">
              Terms and Conditions
            </Link>
            ,
            <Link href="/user-agreement" target="_blank">
              {" "}
              User Agreement{" "}
            </Link>
            and
            <Link href="/custody-agreement" target="_blank">
              {" "}
              Custody Agreement
            </Link>
            , click "Register Account".
          </Typography>
        </div>

        <div className="footer mt-1">
          <Button variant="contained" className="btn gradient-btn">
            Register Account
          </Button>

          <Typography variant="body1" color="primary" className="mt-1">
            I already have an account? <Link href="/login">Login!</Link>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default IndividualForm;

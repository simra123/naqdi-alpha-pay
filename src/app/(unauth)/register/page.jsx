"use client";
import React, { useState } from "react";
import { Typography } from "@mui/material";
import { Business, Person } from "@mui/icons-material";
import { forms } from "@/constants/registerforms";
import IndividualForm from "@/components/forms/registerForm";

import "./register.scss";

const Register = () => {
  const [activeForm, setActiveForm] = useState(forms.INDIVIDUAL);

  const toggleForm = (form) => () => {
    setActiveForm(form);
  };

  return (
    <main className="register">
      <Typography variant="h2" color="primary" className="register__heading">
        Let's get you started!
      </Typography>
      <Typography
        variant="body1"
        color="primary"
        className="register__heading__caption"
      >
        Please select whether you would like to be registered as an Individual
        User, or as a Legal Entity. Depending on your choice, Alphaspy will ask
        you to provide either personal information or information about the
        Legal Entity you represent.
      </Typography>

      <div className="register__form">
        <div className="register__form--buttonWrapper">
          <button
            variant="text"
            color="primary"
            className={activeForm === forms.INDIVIDUAL ? "active" : ""}
            onClick={toggleForm(forms.INDIVIDUAL)}
          >
            <Person />
            <span>Individual</span>
          </button>
          <button
            variant="text"
            color="primary"
            className={activeForm === forms.LegalEntity ? "active" : ""}
            onClick={toggleForm(forms.LegalEntity)}
          >
            <Business />
            <span>Legal Entity</span>
          </button>
        </div>
        <IndividualForm activeForm={activeForm} />
      </div>
    </main>
  );
};

export default Register;

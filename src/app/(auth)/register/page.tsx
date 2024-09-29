"use client";
import React, { useState } from "react";
import { forms } from "@/constants/registerforms";
import IndividualForm from "@/components/forms/registerForm";

import "./regsiter.scss";
import { Individual, LegalEntity } from "@/assets/Svgs";

const Register = () => {
  const [activeForm, setActiveForm] = useState(forms.INDIVIDUAL);

  const toggleForm = (form) => () => {
    setActiveForm(form);
  };

  return (
    <main className="register">
      <h2 className="text-h2 font-semibold mb-4 text-blackGrey-100 mt-20">
        Ready to Begin? Sign Up Now!
      </h2>

      <p className="text-p120 text-blackGrey-100 leading-7 mt-5">
        Please select whether you would like to be registered as an Individual
        User, or as a Legal Entity.
      </p>

      <h4 className="text-h3.5 font-semibold mb-4 text-blackGrey-100 mt-10">
        Select Role
      </h4>

      <div className="register__form">
        <div className="flex gap-2 justify-between">
          <button
            className={`w-full border   p-4 text-center rounded-large ${
              activeForm === forms.INDIVIDUAL
                ? "bg-purple-20 border-purple"
                : "border-light-purple bg-white"
            }`}
            onClick={toggleForm(forms.INDIVIDUAL)}
          >
            <div
              className={`p-[10px] w-fit m-auto rounded-full mb-1 ${
                activeForm === forms.INDIVIDUAL
                  ? "bg-purple-100"
                  : "bg-light-gray"
              }`}
            >
              <Individual
                active={activeForm === forms.INDIVIDUAL}
                className="w-[30px] h-[30px]"
              />
            </div>
            <span className="font-semibold">Individual</span>
          </button>
          <button
            className={`w-full  border  p-4 text-center rounded-large mb-1 ${
              activeForm === forms.LegalEntity
                ? "bg-purple-20 border-purple"
                : "bg-white border-light-purple"
            }`}
            onClick={toggleForm(forms.LegalEntity)}
          >
            <div
              className={`p-[10px] w-fit rounded-full m-auto ${
                activeForm === forms.LegalEntity
                  ? "bg-purple-100"
                  : "bg-light-gray"
              }`}
            >
              <LegalEntity
                active={activeForm === forms.LegalEntity}
                className="w-[30px] h-[30px]"
              />
            </div>
            <span className="font-semibold">Legal Entity</span>
          </button>
        </div>
        <IndividualForm activeForm={activeForm} />
      </div>
    </main>
  );
};

export default Register;

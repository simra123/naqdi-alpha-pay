"use client";
import React, { useState } from "react";
import { forms } from "@/constants/registerforms";
import IndividualForm from "@/components/forms/registerForm";

import { Individual, LegalEntity } from "@/assets/Svgs";

const Register = () => {
  const [activeForm, setActiveForm] = useState(forms.INDIVIDUAL);

  const toggleForm = (form) => () => {
    setActiveForm(form);
  };

  return (
    <main className="register">
      <h2 className="mt-[30px] mb-4 font-semibold text-blackGrey-100 text-h2 text-center">
        Ready to Begin? Sign Up Now!
      </h2>

      <p className="mt-2 text-blackGrey-100 text-p120 text-center leading-7">
        Please select whether you would like to be registered as an Individual
        User, or as a Legal Entity.
      </p>

      <h4 className="mt-10 mb-4 font-semibold text-blackGrey-100 text-h3.5">
        Select Role
      </h4>

      <div className="register__form">
        <div className="flex justify-between gap-2">
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
                  ? "bg-purple-500"
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
                  ? "bg-purple-500"
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

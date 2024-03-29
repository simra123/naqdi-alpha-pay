"use client";

import React from "react";
import Modal from "../Modal";

import "./requestEditModal.scss";
import { Close } from "@mui/icons-material";

const UpgradeTraderModal = ({ isOpen, setIsOpen }) => {
  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <Modal isOpen={isOpen}>
      <div className="modal_wrapper p-8 flex place-items-center place-content-center">
        <div className="flex gap-3">
          <div className="request_box shadow-md-border px-14 py-8 w-[750px] max-w-full bg-white gap-4">
            <div className=" grid place-content-center ">
              <p className="font-bold text-2xl primary-color pe-36 lead">
                Please contact HAYVN Support (support@alphaspay.com) to update
                your account information
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <button
              className="outline-none p-1 rounded-sm border-none text-white bg-red-500"
              onClick={closeModal}
            >
              <Close />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradeTraderModal;

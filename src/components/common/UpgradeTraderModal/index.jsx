"use client";

import React from "react";
import Modal from "../Modal";

import { useSelector, useDispatch } from "react-redux";

import "./upgrademoda.scss";
import { Security } from "@mui/icons-material";
import { setModal } from "@/store/slices/modal.Slice";
import { useRouter } from "next/navigation";

const UpgradeTraderModal = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const modalState = useSelector((state) => state.modal.upgradeTrader);

  const closeModal = () => {
    dispatch(setModal(null));
  };
  return (
    <Modal isOpen={modalState}>
      <div className="upgrade_modal_wrapper p-8">
        <h3 className="text-center text-4xl font-bold">Become a Trader</h3>
        <p className="text-center max-w-xl text-lg mx-auto mt-5">
          You have limited access to the Alphaspay platform functionalities until
          you are verified as Trader.
        </p>

        <div className="user_cards grid grid-cols-2 max-w-3xl mx-auto gap-6">
          <div className="flex flex-col gap-8">
            <div className="mt-6 continue_modal px-14 py-24 min-h-[570px]">
              <div className="flex flex-col gap-8 ">
                <div className="secure_icon text-center">
                  <Security />
                </div>

                <h5 className="text-center font-semibold text-2xl mt-2">
                  User Account
                </h5>

                <div className="details font-semibold leading-7">
                  <p>
                    A User Account gives you limited access to navigate the
                    Alphaspay platform.
                  </p>
                  <p>
                    In order to trade and Custody on the Alphaspay platform you
                    need to upgrade your account to Trader status.
                  </p>
                </div>
              </div>
            </div>
            <button
              className="w-full uppercase font-extrabold btn-secondary no-radius"
              onClick={closeModal}
            >
              Continue
            </button>
          </div>
          <div className="flex flex-col gap-8">
            <div className="mt-6 upgrade_modal px-10 py-24  min-h-[570px]">
              <div className="flex flex-col gap-8 ">
                <div className="secure_icon text-center">
                  <Security />
                </div>

                <h5 className="text-center font-semibold text-2xl mt-2">
                  Trader Account
                </h5>

                <div className="details font-semibold leading-6">
                  <p>
                    With a Alphaspay Trader Account you have full access to the
                    Alphaspay platform.
                  </p>
                  <p>
                    This includes the ability to Custody your digital currency
                    directly from your external wallets into Alphaspay cold
                    storage solution and to trade OTC on our transparent trading
                    platform.
                  </p>
                </div>
              </div>
            </div>
            <button
              className="w-full btn gradient_bg"
              onClick={() => {
                closeModal();
                router.push("/main");
              }}
            >
              Upgrade to trader
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradeTraderModal;

import React from "react";
import Link from "next/link";
import {
  CancelOutlined,
  CheckCircleOutline,
  PauseCircle,
  PauseCircleOutline,
  Pending,
} from "@mui/icons-material";

const KYCApproval = () => {
  return (
    <>
      <h2 className="large_heading_bold">KYC Approval</h2>

      <p className="text-base font-semibold mt-2">Welcome back to Alphaspay</p>

      <div className="status my-8">
        <div className="flex flex-col justify-center items-center gap-1">
          <PauseCircleOutline className="text-9xl text-orange-500" />
          <span className="font-bold text-xl text-orange-500">Pending</span>
        </div>
        <p className="text-base font-semibold mt-6">
          Please wait patiently while we are verifying your documents. The
          process may take 1-3 days to complete.
        </p>
      </div>

      <div className="status my-8">
        <div className="flex flex-col justify-center items-center gap-1">
          <CheckCircleOutline className="text-9xl text-green-500" />
          <span className="font-bold text-xl text-green-500">Verified</span>
        </div>
        <p className="text-base font-semibold mt-6">
          <span className="font-bold text-lg">Congratulations ,</span> Your
          documents have been verified. Please click the next button to set your
          fee schedule.
        </p>
      </div>

      <div className="status my-8">
        <div className="flex flex-col justify-center items-center gap-1">
          <CancelOutlined className="text-9xl text-red-500" />
          <span className="font-bold text-xl text-red-500">Rejected</span>
        </div>
        <p className="text-base font-semibold mt-6">
          We have not been able to verify your documents. Please check the
          remarks and try again.
        </p>

        <h2 className="medium_heading_light mt-6 !font-semibold">Remarks</h2>

        <p className="font-semibold mt-2">Your reason for being rejected</p>
      </div>

      <p className="note mt-6">
        Once your documents have been approved, you will be notified and you
        will be able to move to next step.
      </p>
      <div className="btn_wrapper text-right">
        <button className="header_step_btn active fl">Next</button>
      </div>
    </>
  );
};

export default KYCApproval;

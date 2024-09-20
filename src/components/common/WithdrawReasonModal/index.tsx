import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useDispatch } from "react-redux";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";

import { setNotification } from "@/store/slices/modal.Slice";

import IconField from "../IconField";
import LoaderButton from "../LoaderButton";
import ErrorApiText from "../ErrorApiText";
import { withdrawalRejectAdminApi } from "@/services/withdrawal";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  toggleHandler: () => void;
  withdrawId: number;
}

const ReasonModal = ({ isOpen, toggleHandler, withdrawId }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [data, setData] = useState({ reason: "" });
  const [isRejectLoading, isRejectError, callRejectApi] = useApi();

  const handleWithdrawalReject = async () => {
    await callApiHook({
      apiCall: callRejectApi(
        withdrawalRejectAdminApi({
          withdraw_id: withdrawId,
          reason: data.reason,
        })
      ),
      successCallBack: (response: any) => {
        dispatch(
          setNotification({
            message: "Withdrawal Request Rejected Successfully",
            status: "success",
          })
        );
        router.push("/withdrawals");
      },
    });
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData((pre) => ({ ...pre, [name]: value }));
  };

  useEffect(() => {
    if (isOpen) {
      setData({ reason: "" });
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen}>
      <div className="modal_content_wrapper bg-white p-10 rounded-md shadow-lg w-[547px] max-w-full">
        <h2 className="text-h3.5 font-semibold mb-4">Reason For Rejection</h2>

        <form className="mt-8 flex flex-col gap-2">
          <IconField
            value={data.reason}
            name="reason"
            label="Reason"
            onChange={handleInputChange}
          />

          <div className="flex flex-col justify-end mt-4">
            <LoaderButton
              type="submit"
              content={`Reject`}
              variant="contained"
              onClick={handleWithdrawalReject}
              loading={isRejectLoading}
            />

            <button
              type="button"
              className="text-black-100 px-4 py-2 mt-2"
              onClick={toggleHandler}
            >
              Cancel
            </button>
          </div>
        </form>

        <ErrorApiText error={isRejectError} />
      </div>
    </Modal>
  );
};

export default ReasonModal;

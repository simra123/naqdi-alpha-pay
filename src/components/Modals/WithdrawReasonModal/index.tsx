import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useDispatch } from "react-redux";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";

import { setNotification } from "@/store/slices/modal.Slice";

import IconField from "../../common/IconField";
import LoaderButton from "../../common/LoaderButton";
import ErrorApiText from "../../common/ErrorApiText";
import { withdrawalRejectAdminApi } from "@/services/admin/withdrawal";
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
    <Modal isOpen={isOpen} onClose={toggleHandler}>
      <h2 className="mb-4 font-semibold text-h3.5">Reason For Rejection</h2>

      <form className="flex flex-col gap-2 mt-8">
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

          {/* <button
              type="button"
              className="mt-2 px-4 py-2 text-black-100"
              onClick={toggleHandler}
            >
              Cancel
            </button> */}
        </div>
      </form>

      <ErrorApiText error={isRejectError} />
    </Modal>
  );
};

export default ReasonModal;

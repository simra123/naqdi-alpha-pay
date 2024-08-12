"use client";
import React, { useEffect, useState } from "react";

import { callApiHook } from "@/utils/apifuncs";
import { useApi } from "@/hooks/useApi";
import { getTransactionDetailsByUserApi } from "@/services/transaction";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import moment from "moment";
import { capitalize } from "@/utils/dataFormatters";
import { roundToPrecision } from "@/utils/math";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Role } from "@/constants/roles";
import { getTransactionDetailsByAdminApi } from "@/services/admin/transaction";
import { Mail, Person } from "@mui/icons-material";
import Details from "@/components/common/Details";

const TransactionDetails = ({ params }) => {
  const tranascionId = params?.id;
  const user = useLocalStorage("user");
  const [transactionDetails, setTransactionDetails]: any = useState({});
  const [
    isTransactionDetailsLoading,
    isTransactionDetailsError,
    callTransactionDetailsApi,
  ] = useApi(true);

  const getTransactionDetails = async () => {
    if (user.role == Role.USER) {
      await callApiHook({
        apiCall: callTransactionDetailsApi(
          getTransactionDetailsByUserApi({ id: tranascionId })
        ),
        successCallBack: (response: any) => {
          setTransactionDetails(response);
        },
      });
    }

    if (user.role == Role.ADMIN) {
      await callApiHook({
        apiCall: callTransactionDetailsApi(
          getTransactionDetailsByAdminApi({ id: tranascionId })
        ),
        successCallBack: (response: any) => {
          setTransactionDetails(response);
        },
      });
    }
  };

  useEffect(() => {
    getTransactionDetails();
  }, []);

  return (
    <div className="rounded-medium flex flex-col  bg-white p-6">
      <h3 className="text-h3.5 font-semibold text-blackGrey-100 ">
        Transaction Details
      </h3>

      <ErrorApiText error={isTransactionDetailsError} />
      <LoadingApi loading={isTransactionDetailsLoading}>
        <div className="res-3-grid py-6 mt-4">
          <Details
            Icon={Person}
            label="Date Recieved"
            value={moment(transactionDetails?.createdAt).format("DD-MM-YYYY")}
          />
          <Details Icon={Mail} label="Related Payment" value={"test"} />
          <Details
            Icon={Mail}
            label="Transaction Type"
            value={transactionDetails?.transaction_type}
          />
        </div>
        <div className="res-3-grid py-6 mt-4">
          <Details
            Icon={Person}
            label="Transaction Hash"
            value={transactionDetails?.transaction_hash}
          />
          <Details
            Icon={Mail}
            label="Source Wallet Address"
            value={transactionDetails?.wallet?.wallet_address}
          />
          <Details
            Icon={Mail}
            label="Amount"
            value={`${roundToPrecision(+transactionDetails?.amount, 10)} ${
              transactionDetails?.unit
            }`}
          />
        </div>
        <div className="res-3-grid py-6 mt-4">
          <Details Icon={Person} label="Payment Address" value={"test"} />
          <Details
            Icon={Mail}
            label="Network"
            value={transactionDetails?.wallet?.blockchain}
          />
          <Details
            Icon={Mail}
            label="Status"
            value={transactionDetails?.status}
          />
        </div>
      </LoadingApi>
    </div>
  );
};

export default TransactionDetails;

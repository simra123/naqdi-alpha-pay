"use client";
import React, { useEffect, useState } from "react";

import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { getUserDetailsApi } from "@/services/admin/users";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import moment from "moment";
import { capitalize } from "@/utils/dataFormatters";

import { FolderIcon, StatusIcon } from "@/assets/Svgs";
import Details from "@/components/common/Details";
import { MdOutlineContactMail, MdOutlineLocationOn } from "react-icons/md"
import CustomTable from "@/components/common/CustomTable";
import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";
import { unitName } from "@/constants/blockchains";
import PermissionAccess from "@/middleware/PermissionAccess";

const BalanceColumns: TableColumns = [
  { field: "id", headerName: "ID" },
  {
    field: "unit",
    headerName: "Currency",
    dataValidator(value, row: { standard: string | null }) {
      return row?.standard
        ? `${value} (${row?.standard})`
        : `${unitName[value.toLocaleLowerCase()]}`;
    },
  },
  { field: "amount", headerName: "Balance" },
];

const UserDetails = ({ params }) => {
  const userId = params?.id;
  const [userDetails, setUserDetails]: any = useState({});
  const [isUserDetailsLoading, isUserDetailsError, callUserDetailsApi] = useApi(
    { initailLoading: true }
  );

  const getUserDetailsAdmin = async () => {
    await callApiHook({
      apiCall: callUserDetailsApi(getUserDetailsApi({ userId })),
      successCallBack: (response) => {
        setUserDetails(response);
      },
    });
  };

  useEffect(() => {
    getUserDetailsAdmin();
  }, []);

  return (
    <>
      <ErrorApiText error={isUserDetailsError} />
      <LoadingApi loading={isUserDetailsLoading}>
        <div className="flex flex-col">
          <h3 className="font-semibold text-blackGrey-100 text-h3.5">
            Merchant Details
          </h3>

          <div className="flex items-center gap-2 mt-8 py-4 border-b border-light-gray">
            <FolderIcon />
            <h5 className="font-semibold text-h5 text-purple-500">General</h5>
          </div>
          <div className="res-2-grid py-6">
            <Details label="ID" value={userDetails?.user_details_uuid} />
            <Details
              label="Created Date"
              value={moment(userDetails?.user?.created_at).format("DD-MM-YYYY")}
            />
            <Details label="First Name" value={userDetails?.user?.first_name} />
            <Details label="Last Name" value={userDetails?.user?.last_name} />
            <Details label="Legal Name" value={userDetails?.user?.legal_name} />
            <Details label="User Type" value={userDetails?.user?.user_type} />
          </div>

          <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
            <MdOutlineContactMail className="text-purple-500" />
            <h5 className="font-semibold text-h5 text-purple-500">Contacts</h5>
          </div>
          <div className="res-2-grid py-6">
            <Details label="Phone" value={userDetails?.phone_number} />
            <Details label="Email" value={userDetails?.user?.email} />
          </div>

          <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
            <MdOutlineLocationOn className="text-purple-500" />
            <h5 className="font-semibold text-h5 text-purple-500">
              Addressess
            </h5>
          </div>
          <div className="res-2-grid py-6">
            <Details label="Address" value={userDetails?.address_line_1} />
            <Details label="Country" value={userDetails?.country} />
            <Details label="State" value={capitalize(userDetails?.state)} />
            <Details label="City" value={userDetails?.city} />
            <Details label="Postal Code" value={userDetails?.postal_code} />
          </div>

          <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
            <StatusIcon />
            <h5 className="font-semibold text-h5 text-purple-500">Status</h5>
          </div>
          <div className="res-2-grid py-6">
            <Details
              label="Email Verified"
              value={userDetails?.user?.verified ? "Verified" : "Unverified"}
            />
            <Details
              label="MFA"
              value={userDetails?.mfa ? "Enabled" : "Disabled"}
            />

            <Details label="KYC" value={userDetails?.kyc_status} />
            <Details
              label="Fees"
              value={userDetails?.fees ? userDetails?.fees + "%" : "Unset"}
            />
          </div>
        </div>

        <div className="mt-8">
          <CustomTable
            columns={BalanceColumns}
            rows={userDetails?.user?.balances || []}
            actions={
              <h3 className="mb-8 font-semibold text-blackGrey-100 text-h3.5">
                Balance
              </h3>
            }
            columnClassName="max-w-[200px]"
          />
        </div>
      </LoadingApi>
    </>
  );
};

export default PermissionAccess(
  UserDetails,
  ModulesEnum.merchant,
  AccessLevelEnum.read
);

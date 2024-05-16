"use client";
import React, { useEffect, useState } from "react";
import TransparentInput from "@/components/common/TransparentInput";
import DetailsWrapper from "@/components/ui/Wrappers/DetailsWrapper";
import DashboardPageWrapper from "@/components/ui/Wrappers/DashboardPageWrapper";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { getUserDetailsApi } from "@/services/admin/users";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import moment from "moment";
import { capitalize } from "@/utils/dataFormatters";

const TransactionDetails = ({ params }) => {
  const userId = params?.userId;
  const [userDetails, setUserDetails]: any = useState({});
  const [isUserDetailsLoading, isUserDetailsError, callUserDetailsApi] =
    useApi(true);

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
    <DashboardPageWrapper>
      <div className="data-grid-container">
        <div className=" flex items-center justify-between">
          <h2 className="text-xl font-semibold">User Details</h2>
        </div>
        <ErrorApiText error={isUserDetailsError} />
        <LoadingApi loading={isUserDetailsLoading}>
          <div className="detailspage mt-6">
            <div className="flex flex-col gap-4">
              <DetailsWrapper title={"Date Created"}>
                <TransparentInput
                  value={moment(userDetails?.user?.created_at).format(
                    "DD-MM-YYYY"
                  )}
                />
              </DetailsWrapper>
              <DetailsWrapper title={"ID"}>
                <TransparentInput value={userDetails?.id} />
              </DetailsWrapper>
              <DetailsWrapper title={"First Name"}>
                <TransparentInput value={userDetails?.user?.first_name} />
              </DetailsWrapper>
              <DetailsWrapper title={"Last Name"}>
                <TransparentInput value={userDetails?.user?.last_name} />
              </DetailsWrapper>
              <DetailsWrapper title={"Email"}>
                <TransparentInput value={userDetails?.user?.email} />
              </DetailsWrapper>
              <DetailsWrapper title={"Username"}>
                <TransparentInput value={userDetails?.user?.username} />
              </DetailsWrapper>
              <DetailsWrapper title={"User Type"}>
                <TransparentInput value={userDetails?.user?.user_type} />
              </DetailsWrapper>
              <DetailsWrapper title={"Status"}>
                <TransparentInput value={userDetails?.user?.status} />
              </DetailsWrapper>

              <DetailsWrapper title={"Address"}>
                <TransparentInput value={userDetails?.address_line_1} />
              </DetailsWrapper>
              <DetailsWrapper title={"State"}>
                <TransparentInput value={capitalize(userDetails?.state)} />
              </DetailsWrapper>
              <DetailsWrapper title={"City"}>
                <TransparentInput value={userDetails?.city} />
              </DetailsWrapper>
              <DetailsWrapper title={"Country"}>
                <TransparentInput value={userDetails?.country} />
              </DetailsWrapper>
              <DetailsWrapper title={"Phone"}>
                <TransparentInput value={userDetails?.phone_number} />
              </DetailsWrapper>
              <DetailsWrapper title={"Postal Code"}>
                <TransparentInput value={userDetails?.postal_code} />
              </DetailsWrapper>
            </div>
          </div>
        </LoadingApi>
      </div>
    </DashboardPageWrapper>
  );
};

export default TransactionDetails;

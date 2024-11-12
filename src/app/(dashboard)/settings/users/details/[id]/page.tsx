"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Details from "@/components/common/Details";
import DeleteModal from "@/components/Modals/DeleteModal";
import { useApi } from "@/hooks/useApi";
import { AccessLevelEnum, ModulesEnum } from "@/constants/types";
import { callApiHook } from "@/utils/apifuncs";
import { deleteSubusersApi, getSubuserDetailsApi } from "@/services/auth";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";

const UserDetails = ({ params }) => {
  const userID = params?.id;
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<null | any>(null);
  const [isUserDeleteLoading, isUserDeleteError, callUserDeleteApi] = useApi({
    notify: true,
  });
  const [isUserDetailsLoading, isUserDetailsError, callUserDetailsApi] = useApi(
    {
      initailLoading: true,
    }
  );
  // const [permissions, setPermissions] = useState({
  //   integrations: "none",
  //   payments: "none",
  //   payouts: "none",
  //   users: "none",
  //   withdrawals: "none",
  // });

  const fetchUserDetails = async () => {
    await callApiHook({
      apiCall: callUserDetailsApi(getSubuserDetailsApi({ id: userID })),
      successCallBack: (response: any) => {
        setUserDetails(response);
      },
    });
  };

  const deleteSubUser = async () => {
    await callApiHook({
      apiCall: callUserDeleteApi(
        deleteSubusersApi({
          child_id: +userID,
          username: userDetails?.username,
        })
      ),
      successCallBack(data) {
        setIsDeleteOpen(false);
        router.push("/settings/users");
      },
    });
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // const handleChange = (permission, value) => {
  //   setPermissions((prev) => ({
  //     ...prev,
  //     [permission]: value,
  //   }));
  // };

  const renderRadioButton = (permission, value, label) => {
    const permissionModule = userDetails?.permissions?.find(
      (item) => item?.permission?.module == permission
    );

    return (
      <label className="custom-radio">
        <input
          type="radio"
          name={permission}
          // value={value}
          disabled
          checked={permissionModule?.permission?.access_level == value}
          // onChange={() => handleChange(permission, value)}
        />
        <span className="md:text-base text-[12px] whitespace-nowrap">
          {label}
        </span>
      </label>
    );
  };

  const handleDeleteOpen = () => {
    setIsDeleteOpen(true);
  };

  return (
    <div className="rounded-medium flex flex-col  bg-white shadow-sm px-4 sm:p-10">
      <DeleteModal
        handleConfirm={deleteSubUser}
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        content="Are you sure, you want to delete this user. Once the action is performed it can't be undone!"
        title="Are you Sure?"
        confirmLoading={isUserDeleteLoading}
        error={isUserDeleteError}
      />
      <h3 className="text-h3.5 font-semibold text-blackGrey-100 hidden md:block">
        User Details
      </h3>

      <LoadingApi loading={isUserDetailsLoading}>
        <div className="res-4-grid py-6 md:mt-4 border-light-gray border-b-2">
          <Details label="Profile ID" value={userID} />
          <Details label="First Name" value={userDetails?.first_name} />
          <Details label="Last Name" value={userDetails?.last_name} />
          <Details label="Email" value={userDetails?.email} />
          <Details
            label="Status"
            value={userDetails?.verified ? "Accepted" : "Pending"}
          />
        </div>

        <div className="grid grid-cols-4 gap-4 mt-8 mb-6">
          <div className="font-semibold text-button text-black-100">
            Permissions
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          {userDetails?.permissions.map((item, index) => (
            <div
              className="flex justify-between w-full min-w-max sm:grid sm:grid-cols-4 md:justify-between lg:grid-cols-5  gap-4 items-center py-5 border-light-gray border-b"
              key={item?.id}
            >
              <div className="min-w-20 md:col-span-1 lg:col-span-2 text-[14px] md:text-button  text-black-100 capitalize">
                {item?.permission?.module}
              </div>
              <div className="text-center md:col-span-1">
                {renderRadioButton(
                  item?.permission?.module?.toLowerCase(),
                  AccessLevelEnum.none,
                  "None"
                )}
              </div>
              <div className="text-center md:col-span-1">
                {renderRadioButton(
                  item?.permission?.module?.toLowerCase(),
                  AccessLevelEnum.read,
                  "Read Only"
                )}
              </div>
              <div className="text-center md:col-span-1">
                {renderRadioButton(
                  item?.permission?.module?.toLowerCase(),
                  AccessLevelEnum.full,
                  "Full Access"
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:flex gap-4 items-center mt-20 flex-wrap">
          <button
            className="border-0 py-3 text-center text-white bg-red-button rounded-medium sm:w-56 "
            onClick={handleDeleteOpen}
          >
            Delete
          </button>
          <button className="border-0 py-3 text-center text-white bg-green-button rounded-medium sm:w-56 ">
            Edit
          </button>
        </div>
      </LoadingApi>
      <ErrorApiText error={isUserDetailsError | isUserDeleteError} />
    </div>
  );
};

export default UserDetails;

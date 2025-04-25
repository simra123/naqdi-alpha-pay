"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Details from "@/components/common/Details";
import DeleteModal from "@/components/Modals/DeleteModal";
import { useApi } from "@/hooks/useApi";
import { AccessLevelEnum, ModalType, ModulesEnum } from "@/constants/types";
import { callApiHook } from "@/utils/apifuncs";
import {
  deleteSubAdminApi,
  deleteSubusersApi,
  getSubAdminDetailsApi,
  getSubuserDetailsApi,
} from "@/services/auth";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import CreateUserModal from "@/components/Modals/CreateUserModal";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Role } from "@/constants/roles";
import { hasMinAccess } from "@/utils/cookies";

const UserDetails = ({ params }) => {
  const userID = params?.id;
  const router = useRouter();
  const user = useLocalStorage("user");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
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
      apiCall: callUserDetailsApi(
        user?.role == Role.USER
          ? getSubuserDetailsApi({ id: userID })
          : getSubAdminDetailsApi({ id: userID })
      ),
      successCallBack: (response: any) => {
        setUserDetails(response);
      },
    });
  };

  const deleteSubUser = async () => {
    let deleteUser = {
      child_id: +userID,
      username: userDetails?.username,
    };
    await callApiHook({
      apiCall: callUserDeleteApi(
        user?.role == Role.USER
          ? deleteSubusersApi(deleteUser)
          : deleteSubAdminApi(deleteUser)
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
        <span className="text-[12px] md:text-base whitespace-nowrap">
          {label}
        </span>
      </label>
    );
  };

  const handleDeleteOpen = () => {
    setIsDeleteOpen(true);
  };

  return (
    <div className="flex flex-col bg-white shadow-sm sm:p-10 px-4 rounded-medium">
      <DeleteModal
        handleConfirm={deleteSubUser}
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        content="Are you sure, you want to delete this user. Once the action is performed it can't be undone!"
        title="Are you Sure?"
        confirmLoading={isUserDeleteLoading}
        error={isUserDeleteError}
      />
      <CreateUserModal
        isOpen={isEditOpen}
        type={ModalType.EDIT}
        refreshList={fetchUserDetails}
        toggleHandler={() => setIsEditOpen(false)}
        user_id={userID}
        userPermissions={userDetails?.permissions}
      />
      <h3 className="hidden md:block font-semibold text-blackGrey-100 text-h3.5">
        User Details
      </h3>

      <LoadingApi loading={isUserDetailsLoading}>
        <div className="res-4-grid md:mt-4 py-6 border-b-2 border-light-gray">
          <Details label="Profile ID" value={userID} />
          <Details label="First Name" value={userDetails?.first_name} />
          <Details label="Last Name" value={userDetails?.last_name} />
          <Details label="Email" value={userDetails?.email} />
          <Details label="Username" value={userDetails?.username} />
          <Details
            label="Status"
            value={userDetails?.verified ? "Accepted" : "Pending"}
          />
        </div>

        <div className="gap-4 grid grid-cols-4 mt-8 mb-6">
          <div className="font-semibold text-black-100 text-button">
            Permissions
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          {userDetails?.permissions.map(
            (item, index) =>
              item?.permission?.module != ModulesEnum.payout && (
                <div
                  className="flex justify-between md:justify-between items-center gap-4 sm:grid sm:grid-cols-4 lg:grid-cols-5 py-5 border-b border-light-gray w-full min-w-max"
                  key={item?.id}
                >
                  <div className="md:col-span-1 lg:col-span-2 min-w-20 text-[14px] text-black-100 md:text-button capitalize">
                    {item?.permission?.module}
                  </div>
                  <div className="md:col-span-1 text-center">
                    {renderRadioButton(
                      item?.permission?.module?.toLowerCase(),
                      AccessLevelEnum.none,
                      "None"
                    )}
                  </div>
                  <div className="md:col-span-1 text-center">
                    {renderRadioButton(
                      item?.permission?.module?.toLowerCase(),
                      AccessLevelEnum.read,
                      "Read Only"
                    )}
                  </div>
                  <div className="md:col-span-1 text-center">
                    {renderRadioButton(
                      item?.permission?.module?.toLowerCase(),
                      AccessLevelEnum.full,
                      "Full Access"
                    )}
                  </div>
                </div>
              )
          )}
        </div>

        {hasMinAccess(ModulesEnum.user, AccessLevelEnum.full) && (
          <div className="sm:flex flex-wrap items-center gap-4 grid grid-cols-2 mt-20">
            <button
              className="bg-red-button py-3 border-0 rounded-medium sm:w-56 text-white text-center"
              onClick={handleDeleteOpen}
            >
              Delete
            </button>
            <button
              className="bg-green-button py-3 border-0 rounded-medium sm:w-56 text-white text-center"
              onClick={() => setIsEditOpen(true)}
            >
              Edit
            </button>
          </div>
        )}
      </LoadingApi>
      <ErrorApiText error={isUserDetailsError | isUserDeleteError} />
    </div>
  );
};

export default UserDetails;

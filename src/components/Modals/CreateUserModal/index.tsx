import React, { useEffect, useState } from "react";
import Modal from "../Modal"; // Make sure to adjust the import path if necessary

import { useDispatch } from "react-redux";
import { useApi } from "@/hooks/useApi";

import { callApiHook } from "@/utils/apifuncs";
import { setNotification } from "@/store/slices/modal.Slice";
import IconField from "../../common/IconField";
import LoaderButton from "../../common/LoaderButton";
import ErrorApiText from "../../common/ErrorApiText";

import { Info, Lock } from "@mui/icons-material";

import useFormValidation from "@/hooks/useFormValidation";
import { ChangePassowordApi } from "@/services/auth";
import { UserSchema } from "@/models/Register";
import SwitchButton from "@/components/common/SwitchButton";
import IconSelectBox from "@/components/common/IconSelectBox";

interface Props {
  isOpen: boolean;
  toggleHandler: () => void;
}

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
};

const permissionOptions = [
  { label: "Read Only", value: "read-only" },
  { label: "Full Access", value: "full-access" },
];

const permissions = {
  integrations: null,
  payments: null,
  payouts: null,
  users: null,
  withdrawals: null,
};

const CreateUserModal = ({ isOpen, toggleHandler }: Props) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);

  const [selectedPermissions, setSelectedPermissions] = useState(permissions);

  const togglePermission =
    (name: string, permission?: "read-only" | "full-access") => () => {
      setSelectedPermissions((pre) => ({
        ...pre,
        [name]: selectedPermissions[name] ? null : permission,
      }));
    };

  const [isCreateUserLoading, isCreateUserError, callCreateUserApi] = useApi();

  const { errors, handleChange, handleSubmit, validateField, values } =
    useFormValidation(initialValues, UserSchema);

  const onSubmit = () => {
    setStep(2);
  };

  const handlePermissionChange = (event) => {
    const { value, name } = event?.target;

    setSelectedPermissions((pre) => ({ ...pre, [name]: value }));
  };

  const goToStep = (step: number) => () => {
    setStep(step);
  };

  // const onSubmit = async () => {
  //   await callApiHook({
  //     apiCall: callCreateUserApi(),
  //     successCallBack: () => {
  //       toggleHandler();
  //       dispatch(
  //         setNotification({
  //           message: "User created successfully",
  //           status: "success",
  //         })
  //       );
  //     },
  //   });
  // };

  useEffect(() => {
    if (isOpen) {
      setSelectedPermissions(permissions);
    }
  }, []);

  return (
    <Modal isOpen={isOpen}>
      <div className="modal_content_wrapper bg-white p-6 md:p-10 rounded-md shadow-lg w-[547px] max-w-[90%] my-4">
        <h2 className="text-h3.5 font-semibold mb-4">
          {step == 1 ? "Add User" : "Permissions"}{" "}
        </h2>
        {step == 1 ? (
          <form
            className="mt-8 flex flex-col gap-2"
            onSubmit={(e) =>
              handleSubmit(e, onSubmit, () =>
                console.log("Something went wrong")
              )
            }
          >
            <IconField
              label="First Name"
              error={errors.firstName}
              value={values.firstName}
              onChange={handleChange}
              onBlur={validateField}
              name="firstName"
              placeholder="Enter First Name"
            />

            <IconField
              label="Last Name"
              error={errors.lastName}
              value={values.lastName}
              onChange={handleChange}
              onBlur={validateField}
              name="lastName"
              placeholder="Enter Last Name"
            />

            <IconField
              label="Email"
              error={errors.email}
              value={values.email}
              onChange={handleChange}
              onBlur={validateField}
              name="email"
              placeholder="Enter Email"
            />

            <div className="flex flex-col justify-end mt-4">
              <LoaderButton
                type="submit"
                content={`Continue`}
                variant="contained"
                loading={isCreateUserLoading}
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
        ) : (
          <>
            <div className="flex flex-col gap-4 justify-end mt-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-base">Integrations</span>
                  <SwitchButton
                    handleToggle={togglePermission("integrations", "read-only")}
                    isOn={selectedPermissions.integrations}
                  />
                </div>
                {selectedPermissions?.integrations && (
                  <IconSelectBox
                    wrapperClassName="!m-0"
                    options={permissionOptions}
                    onChange={handlePermissionChange}
                    name="integrations"
                    value={selectedPermissions?.integrations}
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-base">Payments</span>
                  <SwitchButton
                    handleToggle={togglePermission("payments", "read-only")}
                    isOn={selectedPermissions.payments}
                  />
                </div>
                {selectedPermissions?.payments && (
                  <IconSelectBox
                    wrapperClassName="!m-0"
                    options={permissionOptions}
                    onChange={handlePermissionChange}
                    name="payments"
                    value={selectedPermissions?.payments}
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-base">Payouts</span>
                  <SwitchButton
                    handleToggle={togglePermission("payouts", "read-only")}
                    isOn={selectedPermissions.payouts}
                  />
                </div>
                {selectedPermissions?.payouts && (
                  <IconSelectBox
                    wrapperClassName="!m-0"
                    options={permissionOptions}
                    onChange={handlePermissionChange}
                    name="payouts"
                    value={selectedPermissions?.payouts}
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-base">Users</span>
                  <SwitchButton
                    handleToggle={togglePermission("users", "read-only")}
                    isOn={selectedPermissions.users}
                  />
                </div>
                {selectedPermissions?.users && (
                  <IconSelectBox
                    wrapperClassName="!m-0"
                    options={permissionOptions}
                    onChange={handlePermissionChange}
                    name="users"
                    value={selectedPermissions?.users}
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-base">Withdrawals</span>
                  <SwitchButton
                    handleToggle={togglePermission("withdrawals", "read-only")}
                    isOn={selectedPermissions.withdrawals}
                  />
                </div>
                {selectedPermissions?.withdrawals && (
                  <IconSelectBox
                    wrapperClassName="!m-0"
                    options={permissionOptions}
                    onChange={handlePermissionChange}
                    name="withdrawals"
                    value={selectedPermissions?.withdrawals}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-6">
              <LoaderButton
                content={`Create User`}
                variant="contained"
                loading={isCreateUserLoading}
              />

              <button
                type="button"
                className="text-black-100 px-4 py-2 mt-2"
                onClick={goToStep(1)}
              >
                Back
              </button>
            </div>
          </>
        )}

        <ErrorApiText error={isCreateUserError} />
      </div>
    </Modal>
  );
};

export default CreateUserModal;

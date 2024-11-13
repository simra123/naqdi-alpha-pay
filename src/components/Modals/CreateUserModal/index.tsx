import React, { useEffect, useState } from "react";
import Modal from "../Modal"; // Make sure to adjust the import path if necessary

import { useDispatch } from "react-redux";
import { useApi } from "@/hooks/useApi";

import IconField from "../../common/IconField";
import LoaderButton from "../../common/LoaderButton";
import ErrorApiText from "../../common/ErrorApiText";

import useFormValidation from "@/hooks/useFormValidation";

import { UserSchema } from "@/models/Register";
import SwitchButton from "@/components/common/SwitchButton";
import IconSelectBox from "@/components/common/IconSelectBox";
import { callApiHook } from "@/utils/apifuncs";
import { createSubuserApi } from "@/services/auth";
import { setNotification } from "@/store/slices/modal.Slice";
import { AccessLevelEnum, ModalType, ModulesEnum } from "@/constants/types";

interface Props {
  isOpen: boolean;
  toggleHandler: () => void;
  refreshList: () => void;
  type: ModalType;
  userPermissions?: any;
}

const initialValues = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
};

const permissionOptions = [
  { label: "Read Only", value: AccessLevelEnum.read },
  { label: "Full Access", value: AccessLevelEnum.full },
];

const permissions = {
  [ModulesEnum?.integration]: null,
  [ModulesEnum?.payment]: null,
  [ModulesEnum?.transaction]: null,
  [ModulesEnum?.user]: null,
  [ModulesEnum?.wallet]: null,
  [ModulesEnum?.withdrawal]: null,
};

const CreateUserModal = ({
  isOpen,
  toggleHandler,
  refreshList,
  type,
  userPermissions,
}: Props) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);

  const [selectedPermissions, setSelectedPermissions] = useState(permissions);

  const togglePermission =
    (name: ModulesEnum, permission?: AccessLevelEnum) => () => {
      setSelectedPermissions((pre) => ({
        ...pre,
        [name]: selectedPermissions[name] ? null : permission,
      }));
    };

  const [isCreateUserLoading, isCreateUserError, callCreateUserApi] = useApi();

  const {
    errors,
    handleChange,
    handleSubmit,
    validateField,
    values,
    setValues,
  } = useFormValidation(initialValues, UserSchema);

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

  const checkCondition = (condition) => {
    if (condition) {
      return condition;
    }
    return AccessLevelEnum.none;
  };

  const createSubUser = async () => {
    const requestBody = {
      first_name: values?.firstName,
      last_name: values?.lastName,
      username: values?.username,
      email: values?.email,
      password: values?.password,
      permissions: [
        {
          module: ModulesEnum.integration,
          access_level: checkCondition(
            selectedPermissions[ModulesEnum.integration]
          ),
        },
        {
          module: ModulesEnum.payment,
          access_level: checkCondition(
            selectedPermissions[ModulesEnum.payment]
          ),
        },
        {
          module: ModulesEnum.transaction,
          access_level: checkCondition(
            selectedPermissions[ModulesEnum.transaction]
          ),
        },
        {
          module: ModulesEnum.user,
          access_level: checkCondition(selectedPermissions[ModulesEnum.user]),
        },
        {
          module: ModulesEnum.wallet,
          access_level: checkCondition(selectedPermissions[ModulesEnum.wallet]),
        },
        {
          module: ModulesEnum.withdrawal,
          access_level: checkCondition(
            selectedPermissions[ModulesEnum.withdrawal]
          ),
        },
      ],
    };
    console.log(requestBody);
    await callApiHook({
      apiCall: callCreateUserApi(createSubuserApi(requestBody)),
      statusCode: 201,
      successCallBack: () => {
        refreshList();
        toggleHandler();
        setStep(1);
        setValues(initialValues);
        setSelectedPermissions(permissions);
        dispatch(
          setNotification({
            message: "User created successfully",
            status: "success",
          })
        );
      },
    });
  };

  useEffect(() => {
    if (type == ModalType.EDIT) {
      setStep(2);
      if (userPermissions) {
        let currentPermission: any = {};

        for (let i = 0; i < userPermissions.length; i++) {
          currentPermission[userPermissions[i].permission.module] =
            userPermissions[i].permission.access_level == AccessLevelEnum.none
              ? null
              : userPermissions[i].permission.access_level;
        }
        setSelectedPermissions(currentPermission);
      }
    }
  }, [type, userPermissions, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={toggleHandler}>
      <h2 className="text-h3.5 font-semibold mb-4">
        {step == 1 ? "Add User" : "Permissions"}
      </h2>
      {step == 1 ? (
        <form
          className="mt-8 flex flex-col gap-2"
          onSubmit={(e) =>
            handleSubmit(e, onSubmit, () => console.log("Something went wrong"))
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
            label="Username"
            error={errors.username}
            value={values.username}
            onChange={handleChange}
            onBlur={validateField}
            name="username"
            placeholder="Enter Username"
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

          <IconField
            label="Password"
            error={errors.password}
            value={values.password}
            onChange={handleChange}
            onBlur={validateField}
            name="password"
            type="password"
            placeholder="Enter Password"
          />

          <div className="flex flex-col justify-end mt-4">
            <LoaderButton
              type="submit"
              content={`Continue`}
              variant="contained"
              loading={isCreateUserLoading}
            />

            {/* <button
              type="button"
              className="text-black-100 px-4 py-2 mt-2"
              onClick={toggleHandler}
            >
              Cancel
            </button> */}
          </div>
        </form>
      ) : (
        <>
          <div className="flex flex-col gap-4 justify-end mt-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-base">Wallet</span>
                <SwitchButton
                  handleToggle={togglePermission(
                    ModulesEnum.wallet,
                    AccessLevelEnum.read
                  )}
                  isOn={selectedPermissions[ModulesEnum.wallet]}
                />
              </div>
              {selectedPermissions[ModulesEnum.wallet] && (
                <IconSelectBox
                  wrapperClassName="!m-0"
                  options={permissionOptions}
                  onChange={handlePermissionChange}
                  name={ModulesEnum.wallet}
                  value={selectedPermissions[ModulesEnum.wallet]}
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-base">Transaction</span>
                <SwitchButton
                  handleToggle={togglePermission(
                    ModulesEnum.transaction,
                    AccessLevelEnum.read
                  )}
                  isOn={selectedPermissions[ModulesEnum.transaction]}
                />
              </div>
              {selectedPermissions[ModulesEnum.transaction] && (
                <IconSelectBox
                  wrapperClassName="!m-0"
                  options={permissionOptions}
                  onChange={handlePermissionChange}
                  name={ModulesEnum.transaction}
                  value={selectedPermissions[ModulesEnum.transaction]}
                />
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-base">Integrations</span>
              <SwitchButton
                handleToggle={togglePermission(
                  ModulesEnum.integration,
                  AccessLevelEnum.read
                )}
                isOn={selectedPermissions[ModulesEnum.integration]}
              />
            </div>
            {selectedPermissions[ModulesEnum.integration] && (
              <IconSelectBox
                wrapperClassName="!m-0"
                options={permissionOptions}
                onChange={handlePermissionChange}
                name={ModulesEnum.integration}
                value={selectedPermissions[ModulesEnum.integration]}
              />
            )}

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-base">Payments</span>
                <SwitchButton
                  handleToggle={togglePermission(
                    ModulesEnum?.payment,
                    AccessLevelEnum.read
                  )}
                  isOn={selectedPermissions[ModulesEnum.payment]}
                />
              </div>
              {selectedPermissions[ModulesEnum.payment] && (
                <IconSelectBox
                  wrapperClassName="!m-0"
                  options={permissionOptions}
                  onChange={handlePermissionChange}
                  name={ModulesEnum.payment}
                  value={selectedPermissions[ModulesEnum.payment]}
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-base">Users</span>
                <SwitchButton
                  handleToggle={togglePermission(
                    ModulesEnum.user,
                    AccessLevelEnum.read
                  )}
                  isOn={selectedPermissions[ModulesEnum.user]}
                />
              </div>
              {selectedPermissions[ModulesEnum.user] && (
                <IconSelectBox
                  wrapperClassName="!m-0"
                  options={permissionOptions}
                  onChange={handlePermissionChange}
                  name={ModulesEnum.user}
                  value={selectedPermissions[ModulesEnum.user]}
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-base">Withdrawals</span>
                <SwitchButton
                  handleToggle={togglePermission(
                    ModulesEnum.withdrawal,
                    AccessLevelEnum.read
                  )}
                  isOn={selectedPermissions[ModulesEnum.withdrawal]}
                />
              </div>
              {selectedPermissions[ModulesEnum.withdrawal] && (
                <IconSelectBox
                  wrapperClassName="!m-0"
                  options={permissionOptions}
                  onChange={handlePermissionChange}
                  name={ModulesEnum.withdrawal}
                  value={selectedPermissions[ModulesEnum.withdrawal]}
                />
              )}
            </div>

            <div className="flex flex-col gap-1 mt-6">
              <LoaderButton
                content={type == ModalType.EDIT ? "Submit" : `Create User`}
                variant="contained"
                loading={isCreateUserLoading}
                onClick={
                  type == ModalType.EDIT
                    ? () => console.log("eiditng")
                    : createSubUser
                }
              />

              {type != ModalType.EDIT && (
                <button
                  type="button"
                  className="text-black-100 px-4 py-2 mt-2"
                  onClick={goToStep(1)}
                >
                  Back
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <ErrorApiText error={isCreateUserError} />
    </Modal>
  );
};

export default CreateUserModal;

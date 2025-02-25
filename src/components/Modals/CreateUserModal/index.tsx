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
import {
  createSubAdminApi,
  createSubuserApi,
  updateSubAdminApi,
  updateSubuserApi,
} from "@/services/auth";
import { setNotification } from "@/store/slices/modal.Slice";
import { AccessLevelEnum, ModalType, ModulesEnum } from "@/constants/types";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Role } from "@/constants/roles";

interface Props {
  isOpen: boolean;
  toggleHandler: () => void;
  refreshList: () => void;
  type: ModalType;
  userPermissions?: any;
  user_id?: number | string;
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

const subUserPermissions = {
  [ModulesEnum?.integration]: null,
  [ModulesEnum?.payment]: null,
  [ModulesEnum?.transaction]: null,
  [ModulesEnum?.user]: null,
  [ModulesEnum?.wallet]: null,
  [ModulesEnum?.withdrawal]: null,
};
const subAdminPermissions = {
  [ModulesEnum?.payment]: null,
  [ModulesEnum?.transaction]: null,
  [ModulesEnum?.user]: null,
  [ModulesEnum?.wallet]: null,
  [ModulesEnum?.withdrawal]: null,
  [ModulesEnum?.kyc]: null,
  [ModulesEnum?.merchant]: null,
  [ModulesEnum.newsletter]: null,
};

const CreateUserModal = ({
  isOpen,
  toggleHandler,
  refreshList,
  type,
  userPermissions,
  user_id,
}: Props) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const user = useLocalStorage("user");
  let permissions =
    user?.role == Role.ADMIN ? subAdminPermissions : subUserPermissions;

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
    if (user?.role == Role.ADMIN) {
      requestBody?.permissions?.shift();
      requestBody.permissions.push(
        {
          module: ModulesEnum.kyc,
          access_level: checkCondition(selectedPermissions[ModulesEnum.kyc]),
        },
        {
          module: ModulesEnum.merchant,
          access_level: checkCondition(
            selectedPermissions[ModulesEnum.merchant]
          ),
        }
      );
    }

    await callApiHook({
      apiCall: callCreateUserApi(
        user?.role == Role.USER
          ? createSubuserApi(requestBody)
          : createSubAdminApi(requestBody)
      ),
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

  const updateSubUser = async () => {
    let mappedPermissions = userPermissions?.map((perm) => {
      if (
        selectedPermissions[perm?.permission?.module] ||
        selectedPermissions[perm?.permission?.module] === null
      ) {
        let currentAccessLevel = selectedPermissions[perm?.permission?.module];
        return {
          ...perm,
          permission: {
            ...perm?.permission,
            access_level: currentAccessLevel || "none",
          },
        };
      }
    });

    await callApiHook({
      apiCall: callCreateUserApi(
        user?.role == Role.USER
          ? updateSubuserApi({
              user_permission: mappedPermissions,
              user_id: +user_id,
            })
          : updateSubAdminApi({
              user_permission: mappedPermissions,
              user_id: +user_id,
            })
      ),
      statusCode: 200,
      successCallBack: () => {
        refreshList();
        toggleHandler();
        dispatch(
          setNotification({
            message: "User updated successfully",
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
            {user?.role == Role.ADMIN && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-base">Merchant</span>
                  <SwitchButton
                    handleToggle={togglePermission(
                      ModulesEnum.merchant,
                      AccessLevelEnum.read
                    )}
                    isOn={selectedPermissions[ModulesEnum.merchant]}
                  />
                </div>
                {selectedPermissions[ModulesEnum.merchant] && (
                  <IconSelectBox
                    wrapperClassName="!m-0"
                    options={permissionOptions}
                    onChange={handlePermissionChange}
                    name={ModulesEnum.merchant}
                    value={selectedPermissions[ModulesEnum.merchant]}
                  />
                )}
              </div>
            )}
            {user?.role == Role.ADMIN && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-base">KYC</span>
                  <SwitchButton
                    handleToggle={togglePermission(
                      ModulesEnum.kyc,
                      AccessLevelEnum.read
                    )}
                    isOn={selectedPermissions[ModulesEnum.kyc]}
                  />
                </div>
                {selectedPermissions[ModulesEnum.kyc] && (
                  <IconSelectBox
                    wrapperClassName="!m-0"
                    options={permissionOptions}
                    onChange={handlePermissionChange}
                    name={ModulesEnum.kyc}
                    value={selectedPermissions[ModulesEnum.kyc]}
                  />
                )}
              </div>
            )}
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
            {user?.role == Role.USER && (
              <>
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
              </>
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
            {user?.role == Role.ADMIN && (
              <>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-base">NewsLetter</span>
                  <SwitchButton
                    handleToggle={togglePermission(
                      ModulesEnum.newsletter,
                      AccessLevelEnum.read
                    )}
                    isOn={selectedPermissions[ModulesEnum.newsletter]}
                  />
                </div>
                {selectedPermissions[ModulesEnum.newsletter] && (
                  <IconSelectBox
                    wrapperClassName="!m-0"
                    options={permissionOptions}
                    onChange={handlePermissionChange}
                    name={ModulesEnum.newsletter}
                    value={selectedPermissions[ModulesEnum.newsletter]}
                  />
                )}
              </>
            )}

            <div className="flex flex-col gap-1 mt-6">
              <LoaderButton
                content={type == ModalType.EDIT ? "Submit" : `Create User`}
                variant="contained"
                loading={isCreateUserLoading}
                onClick={type == ModalType.EDIT ? updateSubUser : createSubUser}
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

"use client";
import React, { useEffect, useState } from "react";
import { availableWallets_table_columns } from "../../columns";
import { Role, Withdrawal_Type } from "@/constants/roles";
import useLocalStorage from "@/hooks/useLocalStorage";
import LoaderButton from "@/components/common/LoaderButton";
import ConfirmationModal from "@/components/Modals/ConfirmationModal";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import { getWithdrawalDetilsApi } from "@/services/withdrawal";
import {
  getWithdrawalWalletsApi,
  withdrawalApproveAdminApi,
} from "@/services/admin/withdrawal";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import { useDispatch } from "react-redux";
import { setNotification } from "@/store/slices/modal.Slice";
import { useRouter } from "next/navigation";
import moment from "moment";
import Details from "@/components/common/Details";
import RenderRoleBased from "@/components/common/RenderRoleBased";
import {
  CalenderIcon,
  FolderIcon,
  MerchantDetailIcon,
  PaymentIcon,
  StatusIcon,
} from "@/assets/Svgs";
import CustomTable from "@/components/common/CustomTable";
import ReasonModal from "@/components/Modals/WithdrawReasonModal";
import Chip from "@/components/common/Chip";
import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";
import { showExplorerDetailsByChain } from "@/utils/block-explorers";
import { roundToPrecision } from "@/utils/math";
import { FiRefreshCw } from "react-icons/fi";
import { getPermission } from "@/utils/cookies";
import { Tooltip } from "react-tooltip";
import useFirstRenderEffect from "@/hooks/useFirstRenderEffect";
import { ExternalWithdrawal } from "@/models/externalWithdrawal";
import ExternalWithdrawalModal from "@/components/Modals/ExternalWithdrawalModal";
import { blockchain_units } from "@/constants/blockchains";

const transactionsList_table_columns: TableColumns = [
  {
    field: "id",
    headerName: "ID",
    dataValidator(value, row: { withdraw_transaction_uuid: string }) {
      return row?.withdraw_transaction_uuid;
    },
  },
  {
    field: "createdAt",
    headerName: "Date",
    dataValidator(value) {
      return moment(value).format("DD-MM-YYYY : hh:mm A");
    },
  },
  {
    field: "updatedAt",
    headerName: "Updated Date",
    dataValidator(value) {
      return moment(value).format("DD-MM-YYYY : hh:mm A");
    },
  },
  { field: "blockchain", headerName: "Blockchain" },
  { field: "unit", headerName: "Currency" },
  { field: "amount", headerName: "Amount" },
  {
    field: "sender_address",
    headerName: "Wallet Address",
    copyable: true,
    link(row: { blockchain: string; sender_address: string }) {
      return showExplorerDetailsByChain({
        env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
        blockchain: row?.blockchain,
        type: "address",
        address: row?.sender_address,
      });
    },
  },
  {
    field: "transaction_hash",
    headerName: "Transaction Hash",
    copyable: true,
    link(row: { blockchain: string; transaction_hash: string }) {
      return showExplorerDetailsByChain({
        env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
        blockchain: row?.blockchain,
        type: "hash",
        hash: row?.transaction_hash,
      });
    },
  },
  {
    field: "status",
    headerName: "Status",
    dataValidator(value) {
      return <Chip status={value} />;
    },
  },
];

const WithdrawalDetails = ({ params }) => {
  let isMounted = true;
  const user = useLocalStorage("user");
  const dispatch = useDispatch();
  const router = useRouter();
  const [currentWalletsPage, setCurrentWalletsPage] = useState(1);
  const [totalWallets, setTotalWallets] = useState(0);
  const withdraw_id = +params?.id;

  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedWallets, setSelectedWallets] = useState([]);

  const [withdrawalType, setWithdrawalType] = useState(
    Withdrawal_Type.INTERNAL
  );

  const [wallets, setWallets] = useState([]);
  const [isRejectOpen, setRejectOpen] = useState(false);

  const [withdrawalDetails, setwithdrawalDetails]: any = useState({});
  const [
    isWithdrawalDetailsLoading,
    isWithdrawalDetailsError,
    callWithdrawalDetailsApi,
  ] = useApi({ initailLoading: true });

  const [
    isWithdrawalWalletsLoading,
    isWithdrawalWalletsError,
    callWithdrawalWalletsApi,
  ] = useApi({ initailLoading: true });

  const [
    isApproveWithdrawalLoading,
    isApproveWithdrawalError,
    callApproveWithdrawalApi,
  ] = useApi();

  const handleApprove = async () => {
    const addresses = selectedWallets?.map(
      (item) => item?.wallet_address || item?.address
    );

    const internalData = {
      withdraw_id: withdraw_id,
      addresses,
    };

    await callApiHook({
      apiCall: callApproveWithdrawalApi(
        withdrawalApproveAdminApi(internalData)
      ),
      successCallBack: (response: any) => {
        dispatch(
          setNotification({
            message: "Withdrawal Request Approved Successfully",
            status: "success",
          })
        );
        router.push("/withdrawals");
      },
    });
  };

  const rejectModalToggler = () => {
    setRejectOpen(!isRejectOpen);
  };

  const getWithdrawalDetails = async () => {
    await callApiHook({
      apiCall: callWithdrawalDetailsApi(
        getWithdrawalDetilsApi({ withdraw_id })
      ),
      successCallBack: (response: any) => {
        setwithdrawalDetails(response);
      },
    });
  };

  const getWithdrawalWallets = async () => {
    await callApiHook({
      apiCall: callWithdrawalWalletsApi(
        getWithdrawalWalletsApi(
          { withdraw_id },
          { page: currentWalletsPage, limit: 5 }
        )
      ),
      successCallBack: (response: any) => {
        setTotalWallets(response?.totalItems);
        setWallets((wals) => [...wals, ...response?.wallets]);
        setCurrentWalletsPage((page) => page + 1);
      },
    });
  };

  useEffect(() => {
    getWithdrawalDetails();
  }, []);

  useFirstRenderEffect(() => {
    if (user?.role == Role.ADMIN) {
      getWithdrawalWallets();
    }
  });

  const handleWithdrawalType = (type: Withdrawal_Type) => () => {
    setWithdrawalType(type);
  };

  const handleConfirm = () => {
    handleApprove();
    toggleConfirmModal();
  };

  const toggleConfirmModal = () => {
    setConfirmModal(!confirmModal);
  };

  return (
    <LoadingApi loading={isWithdrawalDetailsLoading}>
      <ExternalWithdrawalModal
        isOpen={withdrawalType == Withdrawal_Type.External}
        toggleHandler={() => setWithdrawalType(Withdrawal_Type.INTERNAL)}
        refreshHandler={getWithdrawalDetails}
        withdrawId={withdraw_id}
        blockchain={
          blockchain_units[withdrawalDetails?.blockchain?.toLowerCase()]
        }
      />
      <ReasonModal
        isOpen={isRejectOpen}
        toggleHandler={rejectModalToggler}
        withdrawId={withdraw_id}
      />
      <div className="flex flex-col rounded-medium">
        <h3 className="font-semibold text-blackGrey-100 text-h3.5">
          Withdrawal Details
        </h3>

        <ConfirmationModal
          handleClose={toggleConfirmModal}
          handleConfirm={handleConfirm}
          isOpen={confirmModal}
          confirmLoading={isApproveWithdrawalLoading}
          error={isApproveWithdrawalError}
          title="Withdrawal Confirmation"
        />

        <div className="flex items-center gap-2 mt-8 py-4 border-b border-light-gray">
          <FolderIcon />
          <h5 className="font-semibold text-h5 text-purple-500">General</h5>
        </div>
        <div className="res-2-grid py-6">
          <Details label="ID" value={withdrawalDetails?.withdrawal_uuid} />
          <Details label="Blockchain" value={withdrawalDetails?.blockchain} />

          <Details
            label={`${withdrawalDetails?.unit} ${
              withdrawalDetails?.standard
                ? `(${withdrawalDetails?.standard})`
                : ""
            } Wallet Address`}
            value={withdrawalDetails?.recipient_address}
            copyable
            link={showExplorerDetailsByChain({
              env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
              blockchain: withdrawalDetails?.blockchain,
              type: "address",
              address: withdrawalDetails?.recipient_address,
            })}
          />
        </div>

        <RenderRoleBased allowedRoles={[Role.ADMIN]} user={user}>
          <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
            <MerchantDetailIcon />
            <h5 className="font-semibold text-h5 text-purple-500">Merchant</h5>
          </div>
          <div className="res-2-grid !grid-cols-1 lg:!grid-cols-2 py-6">
            <Details
              label="ID"
              value={withdrawalDetails?.user?.id}
              link={`/merchants/details/${withdrawalDetails?.user?.id}`}
              target="_self"
            />
            <Details
              label="First Name"
              value={withdrawalDetails?.user?.first_name}
            />
            <Details
              label="Last Name"
              value={withdrawalDetails?.user?.last_name}
            />
            <Details
              label="Username"
              value={withdrawalDetails?.user?.username}
            />
            <Details label="Email" value={withdrawalDetails?.user?.email} />
            <Details label="Role" value={withdrawalDetails?.user?.role} />
            <Details
              label="User Type"
              value={withdrawalDetails?.user?.user_type}
            />
            <Details
              label="Created Date"
              value={moment(withdrawalDetails?.user?.created_at).format(
                "DD-MM-YYYY"
              )}
            />
            <Details
              label="Updated Date"
              value={moment(withdrawalDetails?.user?.updated_at).format(
                "DD-MM-YYYY"
              )}
            />
          </div>
        </RenderRoleBased>

        <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
          <CalenderIcon />
          <h5 className="font-semibold text-h5 text-purple-500">Dates</h5>
        </div>

        <div className="res-2-grid py-6">
          <Details
            label="Created Date"
            value={moment(withdrawalDetails?.created_at).format(
              "DD-MM-YYYY : hh:mm A"
            )}
          />
          <Details
            label="Updated Date"
            value={moment(withdrawalDetails?.updated_at).format(
              "DD-MM-YYYY : hh:mm A"
            )}
          />
        </div>
        <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
          <PaymentIcon active={false} />
          <h5 className="font-semibold text-h5 text-purple-500">Withdrawals</h5>
        </div>

        <div className="res-2-grid py-6">
          <Details
            label="Requested Amount"
            value={`${withdrawalDetails?.total_requested_amount} ${withdrawalDetails?.unit}`}
          />
          <Details
            label="Fee"
            value={`${roundToPrecision(
              +withdrawalDetails?.alphaspay_fee,
              10
            )} ${withdrawalDetails?.unit}`}
          />
          <Details
            label="Net Amount"
            value={`${roundToPrecision(
              withdrawalDetails?.requested_amount,
              10
            )} ${withdrawalDetails?.unit}`}
          />
        </div>

        <div className="flex items-center gap-2 mt-2 py-4 border-b border-light-gray">
          <StatusIcon />
          <h5 className="font-semibold text-h5 text-purple-500">Status</h5>
        </div>

        <div className="res-2-grid py-6">
          <Details
            label="Withdrawal Status"
            value={withdrawalDetails?.status}
          />
        </div>

        <h4 className="my-5 font-semibold text-button">Notes</h4>

        <div className="p-4 border border-light-gray rounded-large w-full min-h-36 font-medium text-gray-400">
          {withdrawalDetails?.notes}
        </div>
        {withdrawalDetails?.status == "reject" && withdrawalDetails?.reason && (
          <>
            <h4 className="my-5 font-semibold text-button">Rejection Reason</h4>

            <div className="p-4 border border-light-gray rounded-large w-full min-h-36 font-medium text-gray-400">
              {withdrawalDetails?.reason}
            </div>
          </>
        )}
        <ErrorApiText error={isWithdrawalDetailsError} />
      </div>

      <RenderRoleBased allowedRoles={[Role.ADMIN]} user={user}>
        {/* <div className="flex flex-col bg-white shadow-sm mt-8 py-10 rounded-medium">
          <h3 className="font-semibold text-blackGrey-100 text-h3.5">
            User Details
          </h3>

          <div className="flex items-center gap-2 mt-8 py-4 border-b border-light-gray">
            <FolderIcon />
            <h5 className="font-semibold text-h5 text-purple-500">General</h5>
          </div>
          <div className="res-2-grid py-6">
            <Details
              label="First Name"
              value={withdrawalDetails?.user?.first_name}
            />

            <Details
              label="Last Name"
              value={withdrawalDetails?.user?.last_name}
            />
          </div>

          <div className="flex items-center gap-2 mt-8 py-4 border-b border-light-gray">
            <ContactMailOutlined className="text-purple-500" />
            <h5 className="font-semibold text-h5 text-purple-500">Contact</h5>
          </div>
          <div className="res-2-grid py-6">
            <Details
              label="First Name"
              value={withdrawalDetails?.user?.email}
            />

            <Details
              label="Last Name"
              value={withdrawalDetails?.user?.userDetails?.phone_number}
            />
          </div>
        </div> */}
        <div className="mt-8"></div>

        {withdrawalDetails?.status == "pending" &&
          getPermission(ModulesEnum.withdrawal)?.access_level ==
            AccessLevelEnum.full && (
            <>
              {/* <LoadingApi loading={isWithdrawalWalletsLoading}> */}
              <div className="flex flex-col bg-white shadow-sm p-10 rounded-medium">
                <h3 className="font-semibold text-blackGrey-100 text-h3.5">
                  Withdraw
                </h3>

                <div className="gap-2 grid grid-cols-2 bg-light-gray mt-12 mb-10 p-2 px-5 rounded-large w-full">
                  <button
                    className={`w-full  ${
                      withdrawalType == Withdrawal_Type.INTERNAL
                        ? "bg-purple-gradient p-3 font-bold text-white rounded-large"
                        : "font-medium text-custom-title-gray"
                    }`}
                    onClick={handleWithdrawalType(Withdrawal_Type.INTERNAL)}
                  >
                    Internal
                  </button>
                  <button
                    id="disabled-auto-withdrawal"
                    className={`w-full rounded-large  ${
                      withdrawalType == Withdrawal_Type.External
                        ? "bg-purple-gradient p-3 font-bold text-white rounded-large"
                        : "font-medium text-custom-title-gray"
                    }`}
                    onClick={handleWithdrawalType(Withdrawal_Type.External)}
                  >
                    External
                  </button>
                  {/* <Tooltip
                    content="We are not providing automatic withdrawals at the moment."
                    className="!bg-purple-500"
                    anchorSelect="#disabled-auto-withdrawal"
                  /> */}
                </div>

                <CustomTable
                  tableWrapper={false}
                  initialPageSize={10000}
                  columns={availableWallets_table_columns}
                  rows={wallets}
                  selectable={withdrawalType == Withdrawal_Type.INTERNAL}
                  selectedRows={selectedWallets}
                  setSelectedRows={setSelectedWallets}
                  actions={true}
                />

                {Withdrawal_Type.INTERNAL == withdrawalType &&
                  wallets?.length < totalWallets && (
                    <>
                      <div className="hidden sm:block mx-auto mt-8 w-[300px] max-w-full">
                        <LoaderButton
                          content={"Load More Wallets"}
                          variant="contained"
                          loading={isWithdrawalWalletsLoading}
                          onClick={getWithdrawalWallets}
                        />
                      </div>
                      <LoaderButton
                        content={<FiRefreshCw />}
                        variant="outlined"
                        className="sm:hidden mt-8 ml-auto !p-2 w-max text-xl"
                        loading={isWithdrawalWalletsLoading}
                        onClick={getWithdrawalWallets}
                      />
                    </>
                  )}

                <ErrorApiText error={isApproveWithdrawalError} />

                <div className="sm:flex flex-wrap items-center gap-4 grid grid-cols-2 mt-14">
                  <LoaderButton
                    content={"Reject"}
                    color="error"
                    onClick={rejectModalToggler}
                    variant="error"
                  />
                  {withdrawalType == Withdrawal_Type.INTERNAL && (
                    <LoaderButton
                      variant="text"
                      color="success"
                      onClick={toggleConfirmModal}
                      content={"Approve"}
                    />
                  )}
                </div>
              </div>
              {/* </LoadingApi> */}

              <ErrorApiText error={isWithdrawalWalletsError} />
            </>
          )}
      </RenderRoleBased>

      {withdrawalDetails?.status == "confirm" && (
        <div className="mt-8">
          <CustomTable
            columns={transactionsList_table_columns}
            rows={withdrawalDetails?.withdrawalTransactions?.map((item) => {
              return { ...item, blockchain: withdrawalDetails?.blockchain };
            })}
            actions={
              <h3 className="mb-8 font-semibold text-blackGrey-100 text-h3.5">
                Related Transactions
              </h3>
            }
            rowClickHandler={(row: any) =>
              router.push(`/transactions/details/${row?.id}?type=Withdrawal`)
            }
            columnClassName="max-w-[200px]"
          />
        </div>
      )}
    </LoadingApi>
  );
};

export default WithdrawalDetails;

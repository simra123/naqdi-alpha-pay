"use client";
import React, { useEffect, useState } from "react";
import { availableWallets_table_columns } from "../../columns";
import { Role, Withdrawal_Type } from "@/constants/roles";
import useLocalStorage from "@/hooks/useLocalStorage";
import { ContactMailOutlined } from "@mui/icons-material";
import LoaderButton from "@/components/common/LoaderButton";
import ConfirmationModal from "@/components/Modals/ConfirmationModal";
import { useApi } from "@/hooks/useApi";
import { callApiHook } from "@/utils/apifuncs";
import {
  getWithdrawalDetilsApi,
  getWithdrawalWalletsApi,
  withdrawalApproveAdminApi,
  withdrawalRejectAdminApi,
} from "@/services/withdrawal";
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

  const [withdrawalType, setWithdrawalType] = useState(Withdrawal_Type.MANUAL);

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

    const manualData = {
      addresses,
    };

    const AutomaticData = {
      withdraw_id: withdraw_id,
      withdrawal_mode: withdrawalType,
    };

    const requestData =
      withdrawalType == Withdrawal_Type.AUTOMATIC
        ? AutomaticData
        : { ...manualData, ...AutomaticData };

    await callApiHook({
      apiCall: callApproveWithdrawalApi(withdrawalApproveAdminApi(requestData)),
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

  console.log(selectedWallets, "Selected Walelts");

  return (
    <LoadingApi loading={isWithdrawalDetailsLoading}>
      <ReasonModal
        isOpen={isRejectOpen}
        toggleHandler={rejectModalToggler}
        withdrawId={withdraw_id}
      />
      <div className="rounded-medium shadow-sm flex flex-col  bg-white p-10">
        <h3 className="text-h3.5 font-semibold text-blackGrey-100 ">
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

        <div className="flex items-center gap-2 mt-8 border-b border-light-gray py-4">
          <FolderIcon />
          <h5 className="text-purple-100 text-h5 font-semibold">General</h5>
        </div>
        <div className="res-2-grid py-6">
          <Details label="Blockchain" value={withdrawalDetails?.blockchain} />

          <Details label="ID" value={withdrawalDetails?.withdrawal_uuid} />
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

        <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
          <CalenderIcon />
          <h5 className="text-purple-100 text-h5 font-semibold">Dates</h5>
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
        <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
          <PaymentIcon active={false} />
          <h5 className="text-purple-100 text-h5 font-semibold">Withdrawals</h5>
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

        <div className="flex items-center gap-2 mt-2 border-b border-light-gray py-4">
          <StatusIcon />
          <h5 className="text-purple-100 text-h5 font-semibold">Status</h5>
        </div>

        <div className="res-2-grid py-6">
          <Details
            label="Withdrawal Status"
            value={withdrawalDetails?.status}
          />
        </div>

        <h4 className="text-button font-semibold my-5">Notes</h4>

        <div className="border border-light-gray p-4 text-gray-400 font-medium w-full min-h-36 rounded-large">
          {withdrawalDetails?.notes}
        </div>
        {withdrawalDetails?.status == "reject" && withdrawalDetails?.reason && (
          <>
            <h4 className="text-button font-semibold my-5">Rejection Reason</h4>

            <div className="border border-light-gray p-4 text-gray-400 font-medium w-full min-h-36 rounded-large">
              {withdrawalDetails?.reason}
            </div>
          </>
        )}
        <ErrorApiText error={isWithdrawalDetailsError} />
      </div>

      <RenderRoleBased allowedRoles={[Role.ADMIN]} user={user}>
        <div className="rounded-medium shadow-sm flex flex-col  bg-white p-10 mt-8">
          <h3 className="text-h3.5 font-semibold text-blackGrey-100 ">
            User Details
          </h3>

          <div className="flex items-center gap-2 mt-8 border-b border-light-gray py-4">
            <FolderIcon />
            <h5 className="text-purple-100 text-h5 font-semibold">General</h5>
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

          <div className="flex items-center gap-2 mt-8 border-b border-light-gray py-4">
            <ContactMailOutlined className="text-purple-100" />
            <h5 className="text-purple-100 text-h5 font-semibold">Contact</h5>
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
        </div>
        <div className="mt-8"></div>

        {withdrawalDetails?.status == "pending" &&
          getPermission(ModulesEnum.withdrawal)?.access_level ==
            AccessLevelEnum.full && (
            <>
              {/* <LoadingApi loading={isWithdrawalWalletsLoading}> */}
              <div className="rounded-medium shadow-sm flex flex-col  bg-white p-10">
                <h3 className="text-h3.5 font-semibold text-blackGrey-100 ">
                  Withdraw
                </h3>

                <div className="p-2 w-full bg-light-gray grid grid-cols-2 px-5 rounded-large gap-2 mt-12 mb-10">
                  <button
                    className={`w-full  ${
                      withdrawalType == Withdrawal_Type.MANUAL
                        ? "bg-purple-100 p-3 font-bold text-white rounded-large"
                        : "font-medium text-custom-title-gray"
                    }`}
                    onClick={handleWithdrawalType(Withdrawal_Type.MANUAL)}
                  >
                    Manual
                  </button>
                  <button
                    id="disabled-auto-withdrawal"
                    className={`w-full rounded-large  ${
                      withdrawalType != Withdrawal_Type.MANUAL
                        ? "bg-purple-100 p-3 font-bold text-white rounded-large"
                        : "font-medium text-custom-title-gray"
                    }`}
                    // onClick={handleWithdrawalType(Withdrawal_Type.AUTOMATIC)}
                    disabled
                  >
                    Automatic
                  </button>
                  <Tooltip
                    content="We are not providing automatic withdrawals at the moment."
                    className="!bg-purple-500"
                    anchorSelect="#disabled-auto-withdrawal"
                  />
                </div>

                <CustomTable
                  tableWrapper={false}
                  initialPageSize={10000}
                  columns={availableWallets_table_columns}
                  rows={wallets}
                  selectable={withdrawalType == Withdrawal_Type.MANUAL}
                  selectedRows={selectedWallets}
                  setSelectedRows={setSelectedWallets}
                  actions={true}
                />

                {Withdrawal_Type.MANUAL == withdrawalType &&
                  wallets?.length < totalWallets && (
                    <>
                      <div className="mt-8 max-w-full w-[300px] mx-auto hidden sm:block">
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
                        className="sm:hidden text-xl !p-2 w-max ml-auto mt-8"
                        loading={isWithdrawalWalletsLoading}
                        onClick={getWithdrawalWallets}
                      />
                    </>
                  )}

                <ErrorApiText error={isApproveWithdrawalError} />

                <div className="grid grid-cols-2 sm:flex gap-4 items-center mt-14 flex-wrap">
                  <LoaderButton
                    content={"Reject"}
                    color="error"
                    onClick={rejectModalToggler}
                    variant="error"
                  />

                  <LoaderButton
                    variant="text"
                    color="success"
                    onClick={toggleConfirmModal}
                    content={"Approve"}
                  />
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
              <h3 className="text-h3.5 font-semibold text-blackGrey-100 mb-8">
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

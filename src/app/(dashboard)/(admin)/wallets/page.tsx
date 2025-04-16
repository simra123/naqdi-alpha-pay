"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ErrorApiText from "@/components/common/ErrorApiText";

import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import { useApi } from "@/hooks/useApi";
import { TableColumns, WalletType } from "@/constants/types";

import CustomTable from "@/components/common/CustomTable";
import { generateCSVApi } from "@/services/common";
import { getAllWalletsListByAdminApi } from "@/services/admin/wallet";
import moment from "moment";
import { showExplorerDetailsByChain } from "@/utils/block-explorers";
import GasPaymentModal from "@/components/Modals/GasPaymentModal";

const Wallets = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>();
  const [paymentWallet, setPaymentWallet] = useState({
    walletType: null,
    walletAddress: null,
    blockchain: null,
  });
  const [wallets, setWallets] = useState([]);
  const [isWalletsLoading, isWalletsError, callWalletsApi] = useApi({
    initailLoading: true,
  });
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();

  const getAllWalletsByAdmin = async () => {
    await callApiHook({
      apiCall: callWalletsApi(getAllWalletsListByAdminApi()),
      successCallBack: (response) => {
        let wallets = response?.map((wallet) => {
          return {
            wallet_uuid: wallet?.wallet_uuid || wallet?.id,
            created_at: moment(wallet?.created_at).format("DD-MM-YYYY HH:MM A"),
            updated_at: moment(wallet?.updated_at).format("DD-MM-YYYY HH:MM A"),
            blockchain: wallet?.blockchain,
            wallet_address: wallet?.wallet_address || wallet?.address,
            wallet_type: wallet?.status
              ? WalletType.Virtual
              : WalletType.Static,
            amount: wallet?.amount,
          };
        });
        setWallets(wallets);
      },
    });
  };

  const ExportCSVHandler = async () => {
    await callApiHook({
      apiCall: callCSVApi(generateCSVApi(wallets)),
      successCallBack: (response: any) => {
        downloadCSV(response, "wallets.csv");
      },
    });
  };

  useEffect(() => {
    getAllWalletsByAdmin();
  }, []);

  const handlePaymentModal = async (
    event: any,
    { walletType, walletAddress, blockchain }
  ) => {
    event.stopPropagation();


    setPaymentWallet({
      walletAddress,
      blockchain,
      walletType,
    });
    setIsOpen(() => true);
  };

  const closeFeePayModal = () => {
    setPaymentWallet({
      blockchain: null,
      walletAddress: null,
      walletType: null,
    });
    setIsOpen(false);
  };

  const wallets_table_columns = useCallback((): TableColumns => {

    return [
      {
        field: "wallet_uuid",
        headerName: "ID",
        dataValidator(value, row: { wallet_uuid: string; id: string }) {
          return row?.wallet_uuid || row?.id;
        },
      },
      {
        field: "created_at",
        headerName: "Created",
      },
      {
        field: "updated_at",
        headerName: "Updated",
      },
      { field: "blockchain", headerName: "Blockchain" },
      {
        field: "wallet_address",
        headerName: "Wallet Address",
        copyable: true,
        link: (row: {
          blockchain: string;
          wallet_address: string;
          address: string;
        }) => {
          return showExplorerDetailsByChain({
            env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
            blockchain: row?.blockchain,
            type: "address",
            address: row?.wallet_address || row?.address,
          });
        },
      },
      { field: "amount", headerName: "Amount" },
      {
        field: "wallet_type",
        headerName: "Wallet Type",
        sortable: true,
      },
      {
        field: "acrion",
        headerName: "Action",
        dataValidator: (
          _value,
          row: {
            wallet_address: string;
            address: string;
            wallet_type: string;
            blockchain: string;
          }
        ) => {
          return (
            <button
              onClick={(event) =>
                handlePaymentModal(event, {
                  walletAddress: row?.wallet_address || row?.address,
                  walletType: row?.wallet_type,
                  blockchain: row?.blockchain,
                })
              }
              className={`px-7 rounded-medium py-1 bg-purple-80 text-white`}
            >
              Pay
            </button>
          );
        },
      },
    ];
  }, []);

  return (
    <>
      <GasPaymentModal
        isOpen={isOpen}
        closeModal={closeFeePayModal}
        blockchain={paymentWallet?.blockchain}
        walletAddress={paymentWallet?.walletAddress}
        walletType={paymentWallet?.walletType}
      />

      <h3 className="hidden md:block mb-8 font-semibold text-blackGrey-100 text-h3">
        Wallets
      </h3>

      {/* Table Actions Below */}

      <div>
        <CustomTable
          loading={isWalletsLoading}
          columns={wallets_table_columns()}
          rows={wallets}
          csv={{
            handler: ExportCSVHandler,
            loading: isCSVLoading,
            error: isCSVError,
          }}
          initialPageSize={10}
          pagination
          columnClassName="max-w-[250px]"
        />

        <ErrorApiText error={isWalletsError} />
      </div>
    </>
  );
};

export default Wallets;

"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { Role } from "@/constants/roles";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import {
  getAllPaymentsApi,
  getAllPaymentsByAdminApi,
} from "@/services/payments";
import useLocalStorage from "@/hooks/useLocalStorage";
import LoadingApi from "@/components/common/LoadindApi";
import ErrorApiText from "@/components/common/ErrorApiText";
import moment from "moment";
import { generateCSVApi } from "@/services/common";
import CustomTable from "@/components/common/CustomTable";
import { capitalize } from "@/utils/dataFormatters";
import { KeyboardArrowRight } from "@mui/icons-material";
import Chip from "@/components/common/Chip";
import DateField from "@/components/common/DateField";
import { AccessLevelEnum, ModulesEnum, TableColumns } from "@/constants/types";
import { roundToPrecision } from "@/utils/math";
import { showExplorerDetailsByChain } from "@/utils/block-explorers";
import PermissionAccess from "@/middleware/PermissionAccess";

const unpaidStatuses = ["Pending", "Cancel", "New"];

const paymentsList_table_columns: TableColumns = [
  {
    field: "payment_uuid",
    headerName: "ID",
  },
  {
    field: "createdAt",
    headerName: "Created At",
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
  },
  {
    field: "blockchain",
    headerName: "Blockchain",
  },

  {
    field: "recieverAddress",
    headerName: "Reciever Wallet Address",
    copyable: true,
    link: (row: { blockchain: string; recieverAddress: string }) => {
      return showExplorerDetailsByChain({
        env: process?.env?.NEXT_PUBLIC_ENVIRONMENT,
        blockchain: row?.blockchain,
        type: "address",
        address: row?.recieverAddress,
      });
    },
  },
  {
    field: "requestedPaymentAmount",
    headerName: "Requested Payment Amount",
  },
  {
    field: "amountToPay",
    headerName: "Amount to Pay",
  },
  {
    field: "amountPaid",
    headerName: "Amount Paid",
  },
  {
    field: "paid",
    headerName: "Paid",
  },
  {
    field: "status",
    headerName: "Status",

    dataValidator: (value) => {
      return <Chip status={value} />;
    },
  },
];

const Payments = () => {
  const router = useRouter();
  const user = useLocalStorage("user");
  const [paymentsList, setPaymentsList] = useState([]);

  const [isPaymentLoading, isPaymentError, callPaymentApi] = useApi({
    initailLoading: true,
  });
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();

  const getPayments = async () => {
    // if (user?.role == Role.USER) {

    let paymentCall =
      user?.role == Role.USER ? getAllPaymentsApi : getAllPaymentsByAdminApi;

    await callApiHook({
      apiCall: callPaymentApi(paymentCall()),
      successCallBack: (response: any) => {
        const tableData = response.map((item) => {
          return {
            id: item?.id,
            payment_uuid: item?.payment_uuid,
            blockchain: item?.wallet?.blockchain,
            createdAt: moment(item?.created_at).format("DD-MM-YYYY : hh:mm A"),
            updatedAt: moment(item?.updated_at).format("DD-MM-YYYY : hh:mm A"),
            senderAddress: item?.paymentTransaction?.sender_address,
            recieverAddress: item?.wallet?.address,
            requestedPaymentAmount: `${item?.requested_amount} ${item?.requested_currency}`,
            amountToPay: `${roundToPrecision(
              item?.payment_currency_amount,
              6
            )} ${item?.payment_currency}`,
            amountPaid:
              roundToPrecision(
                item?.paymentTransaction?.reduce((acc, transaction) => {
                  return acc + parseFloat(transaction.transaction_amount);
                }, 0),
                6
              ) +
              " " +
              item?.payment_currency,
            paid: unpaidStatuses.some((status) => status == item?.status)
              ? "No"
              : "Yes",
            status: item?.status,
          };
        });
        setPaymentsList(tableData);
      },
    });
    // }
  };

  const ExportCSVHandler = async () => {
    await callApiHook({
      apiCall: callCSVApi(generateCSVApi(paymentsList)),
      successCallBack: (response: any) => {
        downloadCSV(response, "payments.csv");
      },
    });
  };

  useEffect(() => {
    getPayments();
  }, []);

  return (
    <>
      <h3 className="text-h3 font-semibold text-blackGrey-100 mb-8 md:block hidden">
        Payments
      </h3>

      {/* Table Actions Below */}

      <div>
        <CustomTable
          columns={paymentsList_table_columns}
          Filters={Filters}
          rows={paymentsList}
          csv={{
            handler: ExportCSVHandler,
            loading: isCSVLoading,
            error: isCSVError,
          }}
          initialPageSize={10}
          rowClickHandler={(row: any) =>
            router.push(`payments/details/${row?.id}`)
          }
          pagination
          columnClassName="max-w-[250px]"
          loading={isPaymentLoading}
        />

        <ErrorApiText error={isPaymentError} />
      </div>
    </>
  );
};

export default PermissionAccess(
  Payments,
  ModulesEnum.payment,
  AccessLevelEnum.read
);

interface FilterProps {
  date?: boolean;
  status?: boolean;
  amount?: boolean;
}

const Filters = ({ data, setData, isOpen, setIsOpen }) => {
  const filtersRef = useRef(null);

  const [openFilters, setOpenFilters] = useState<FilterProps>({
    date: false,
    status: false,
    amount: false,
  });

  const [filtersChecked, setFiltersChecked] = useState<FilterProps>({
    date: false,
    status: false,
    amount: false,
  });

  const [values, setValues] = useState({
    date: { start: "", end: "" },
    status: "",
    amount: "",
  });

  // Close filtersChecked when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target) &&
        !event.target?.classList.contains("filterBtn") &&
        !event.target?.closest(".filterBtn")
      ) {
        // Close all filtersChecked
        setOpenFilters({
          date: false,
          status: false,
          amount: false,
        });
        setIsOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const applyFilters = (
    e?: any,
    updatedValues?: any,
    updateCheckedState: boolean = true
  ) => {
    e?.stopPropagation();
    let results = data;

    if (updatedValues?.date?.start && updatedValues?.date?.end) {
      updateCheckedState &&
        !filtersChecked?.date &&
        setFiltersChecked({ ...filtersChecked, date: true });
      // const start = new Date(updatedValues.date.start);
      // const end = new Date(updatedValues.date.end);
      // results = results.filter((item) => {
      //   const itemDate = new Date(item.created_at);
      //   return itemDate >= start && itemDate <= end;
      // });
    }

    if (updatedValues?.status) {
      updateCheckedState &&
        !filtersChecked?.status &&
        setFiltersChecked({ ...filtersChecked, status: true });
      results = results.filter(
        (item) => capitalize(item.status) === updatedValues.status
      );
    }

    if (updatedValues?.amount) {
      updateCheckedState &&
        !filtersChecked?.amount &&
        setFiltersChecked({ ...filtersChecked, amount: true });
      results = results.filter(
        (item) =>
          parseFloat(item.requested_amount) === parseFloat(updatedValues.amount)
      );
    }

    setData(results);
  };

  const toggleFiltersDisplay = (e, name) => {
    e.stopPropagation();
    setOpenFilters({ [name]: !openFilters[name] });
  };

  const handleFiltersChecked = (event) => {
    const { name, checked } = event.target;

    setFiltersChecked({ ...filtersChecked, [name]: checked });

    if (!checked) {
      setValues((prevValues) => {
        let updatedValues: any;
        if (name == "date") {
          updatedValues = { ...prevValues, [name]: { start: "", end: "" } };
        } else {
          updatedValues = { ...prevValues, [name]: "" };
        }
        applyFilters(event, updatedValues, false);
        return updatedValues;
      });
    }
  };

  const handleFilterValueChange = (e) => {
    const { name, value } = e.target;

    const splitted = name.split(".");

    if (splitted.length <= 1) {
      return setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }

    setValues((prevValues) => {
      const updatedValues = { ...prevValues };
      let currentLevel = updatedValues;

      for (let i = 0; i < splitted.length - 1; i++) {
        const key = splitted[i];
        if (!currentLevel[key]) {
          currentLevel[key] = {};
        }
        currentLevel = currentLevel[key];
      }

      currentLevel[splitted[splitted.length - 1]] = value;

      return updatedValues;
    });
  };

  return (
    <div
      ref={filtersRef}
      className={`p-2 bg-white rounded-medium shadow absolute right-2 top-14 min-w-60 ${
        !isOpen && "hidden"
      }`}
    >
      <DateFilter
        isOpen={openFilters.date}
        filterChecked={filtersChecked.date}
        values={values}
        toggleFiltersDisplay={toggleFiltersDisplay}
        handleFiltersChecked={handleFiltersChecked}
        handleFilterValueChange={handleFilterValueChange}
        applyFilters={applyFilters}
      />

      <StatusFilter
        isOpen={openFilters.status}
        filterChecked={filtersChecked.status}
        values={values}
        toggleFiltersDisplay={toggleFiltersDisplay}
        handleFiltersChecked={handleFiltersChecked}
        handleFilterValueChange={handleFilterValueChange}
        applyFilters={applyFilters}
        statusList={[
          { label: "Complete", value: "Complete" },
          { label: "Incomplete", value: "Incomplete" },
          { label: "Overpay", value: "Overpay" },
          { label: "Cancel", value: "Cancel" },
        ]}
      />

      <AmountFilter
        isOpen={openFilters.amount}
        filterChecked={filtersChecked.amount}
        values={values}
        toggleFiltersDisplay={toggleFiltersDisplay}
        handleFiltersChecked={handleFiltersChecked}
        handleFilterValueChange={handleFilterValueChange}
        applyFilters={applyFilters}
      />
    </div>
  );
};

const AmountFilter = ({
  isOpen,
  filterChecked,
  values,
  toggleFiltersDisplay,
  handleFiltersChecked,
  handleFilterValueChange,
  applyFilters,
}) => (
  <div
    onClick={(e) => toggleFiltersDisplay(e, "amount")}
    className="flex gap-1 items-center justify-between custom-checkbox p-3 hover:bg-light-blue rounded-b-small"
  >
    <div className="flex items-center relative">
      <label className="custom-checkbox">
        <input
          type="checkbox"
          checked={filterChecked}
          name="amount"
          onChange={handleFiltersChecked}
        />
        <span className="checkmark"></span>
        <span className="ml-8 text-[18px]">Amount</span>
      </label>
    </div>
    <KeyboardArrowRight />
    {isOpen && (
      <div
        className="bg-white shadow-md absolute px-6 py-4 rounded-medium  -left-[108%] flex gap-2 flex-col min-w-52"
        onClick={(event) => event.stopPropagation()}
      >
        <input
          type="number"
          name="amount"
          className="outline-none border border-light-gray rounded-medium focus:border-purple-100 p-2"
          value={values.amount}
          onChange={handleFilterValueChange}
          placeholder="Enter Amount"
        />
        <button
          className={`px-4 py-2 text-white bg-purple-100 rounded-medium mt-3`}
          onClick={(event) => applyFilters(event, values)}
        >
          Apply
        </button>
      </div>
    )}
  </div>
);

interface FitlerProps {
  isOpen: boolean;
  filterChecked: boolean;
  values: any;
  toggleFiltersDisplay: any;
  handleFiltersChecked: any;
  handleFilterValueChange: any;
  applyFilters: any;
  statusList: { label: string; value: string }[];
}

const StatusFilter = ({
  isOpen,
  filterChecked,
  values,
  toggleFiltersDisplay,
  handleFiltersChecked,
  handleFilterValueChange,
  applyFilters,
  statusList,
}: FitlerProps) => (
  <div
    onClick={(e) => toggleFiltersDisplay(e, "status")}
    className="flex gap-1 items-center justify-between custom-checkbox p-3 hover:bg-light-blue border-b border-slate-200"
  >
    <div className="flex items-center relative">
      <label className="custom-checkbox">
        <input
          type="checkbox"
          checked={filterChecked}
          name="status"
          onChange={handleFiltersChecked}
        />
        <span className="checkmark"></span>
        <span className="ml-8 text-[18px]">Status</span>
      </label>
    </div>
    <KeyboardArrowRight />
    {isOpen && (
      <div
        className="bg-white shadow-md absolute p-1 rounded-medium -left-full flex flex-col min-w-52"
        onClick={(event) => event.stopPropagation()}
      >
        {statusList?.map((option, index) => (
          <div
            key={option.value}
            onClick={(event) => {
              handleFilterValueChange({
                target: { value: option.value, name: "status" },
              });
              applyFilters(event, { ...values, status: option.value });
            }}
            className={`p-3 cursor-pointer border-b ${
              index == 0
                ? "rounded-t-md"
                : index == statusList?.length - 1 && "rounded-b-md !border-b-0"
            } ${
              values?.status === option.value
                ? "bg-purple-light-purple text-purple-100 font-medium"
                : "hover:bg-purple-light-purple hover:text-black-100"
            }`}
          >
            {option?.label}
          </div>
        ))}
      </div>
    )}
  </div>
);

const DateFilter = ({
  isOpen,
  filterChecked,
  values,
  toggleFiltersDisplay,
  handleFiltersChecked,
  handleFilterValueChange,
  applyFilters,
}) => (
  <div
    onClick={(e) => toggleFiltersDisplay(e, "date")}
    className="flex gap-1 relative items-center justify-between custom-checkbox p-3 hover:bg-light-blue rounded-t-small border-b border-slate-200"
  >
    <div className="flex items-center relative">
      <label className="custom-checkbox">
        <input
          type="checkbox"
          checked={filterChecked}
          name="date"
          onChange={handleFiltersChecked}
        />
        <span className="checkmark"></span>
        <span className="ml-8 text-[18px]">Date</span>
      </label>
    </div>
    <KeyboardArrowRight />
    {isOpen && (
      <div
        className="bg-white shadow-md absolute px-6 py-4 rounded-medium  -left-[113%] flex gap-2 flex-col min-w-52"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Replace the input fields with the DateField component */}
        <DateField
          name="date.start"
          value={values.date.start}
          date={values.date.start}
          handleChange={(date) =>
            handleFilterValueChange({
              target: { name: "date.start", value: date },
            })
          }
        />
        <DateField
          name="date.end"
          value={values.date.end}
          date={values.date.end}
          handleChange={(date) =>
            handleFilterValueChange({
              target: { name: "date.end", value: date },
            })
          }
        />
        <button
          className={`px-4 py-2 text-white bg-purple-100 rounded-medium mt-3`}
          onClick={(event) => applyFilters(event, values)}
        >
          Apply
        </button>
      </div>
    )}
  </div>
);

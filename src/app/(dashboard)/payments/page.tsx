"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { Role } from "@/constants/roles";
import { callApiHook, downloadCSV } from "@/utils/apifuncs";
import { getAllPaymentsApi } from "@/services/payments";
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

const unpaidStatuses = ["Pending", "Cancel", "New"];

const paymentsList_table_columns = [
  {
    field: "id",
    headerName: "ID",

    sortable: true,
  },
  {
    field: "createdAt",
    headerName: "Created At",

    sortable: true,
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    filterable: false,
    sortable: true,
  },
  // {
  //   field: "senderAddress",
  //   headerName: "Sender Wallet Address",
  //   filterable: false,
  //   sortable: true,
  // },
  {
    field: "recieverAddress",
    headerName: "Reciever Wallet Address",
    filterable: false,
    sortable: true,
  },
  {
    field: "requestedPaymentAmount",
    headerName: "Requested Payment Amount",
    sortable: true,
  },
  {
    field: "amountPaid",
    headerName: "Amount Paid",

    filterable: false,
    sortable: true,
  },
  {
    field: "paid",
    headerName: "Paid",

    sortable: true,
  },
  {
    field: "status",
    headerName: "Status",

    sortable: true,

    dataValidator: (value) => {
      return <Chip status={value} />;
    },
  },
];

const Payments = () => {
  const router = useRouter();
  const user = useLocalStorage("user");
  const [paymentsList, setPaymentsList] = useState([]);

  const [isPaymentLoading, isPaymentError, callPaymentApi] = useApi(true);
  const [isCSVLoading, isCSVError, callCSVApi] = useApi();

  const getPayments = async () => {
    if (user?.role == Role.USER) {
      await callApiHook({
        apiCall: callPaymentApi(getAllPaymentsApi()),
        successCallBack: (response: any) => {
          const tableData = response.map((item) => {
            return {
              id: item?.id,
              createdAt: moment(item?.created_at).format(
                "DD-MM-YYYY : hh:mm A"
              ),
              updatedAt: moment(item?.updated_at).format(
                "DD-MM-YYYY : hh:mm A"
              ),
              senderAddress: item?.paymentTransaction?.sender_address,
              recieverAddress: item?.wallet?.address,
              requestedPaymentAmount: `${item?.requested_amount} ${item?.requested_currency}`,
              amountPaid: `${item?.payment_currency_amount} ${item?.payment_currency}`,
              paid: unpaidStatuses.some((status) => status == item?.status)
                ? "No"
                : "Yes",
              status: item?.status,
            };
          });
          setPaymentsList(tableData);
        },
      });
    }
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
        <LoadingApi loading={isPaymentLoading}>
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
          />
        </LoadingApi>
        <ErrorApiText error={isPaymentError} />
      </div>
    </>
  );
};

export default Payments;

const Filters = ({ data, setData, isOpen, setIsOpen }) => {
  const filtersRef = useRef(null);

  const [openFilters, setOpenFilters]: any = useState({
    date: false,
    status: false,
    amount: false,
  });

  const [filters, setFilters] = useState({
    date: false,
    status: false,
    amount: false,
  });

  const [filterValues, setFilterValues]: any = useState({
    date: { start: "", end: "" },
    status: false,
    amount: false,
  });

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      console.log();
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target) &&
        !event.target?.classList.contains("filterBtn") &&
        !event.target?.closest(".filterBtn")
      ) {
        // Close all filters
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

  const applyFilters = (e?: any, updatedValues?: any, name?: string) => {
    e?.stopPropagation();
    let results = data;

    if (updatedValues.date.start && updatedValues.date.end) {
      setFilters({ ...filters, date: true });
      const start = new Date(updatedValues.date.start);
      const end = new Date(updatedValues.date.end);
      results = results.filter((item) => {
        const itemDate = new Date(item.created_at);
        return itemDate >= start && itemDate <= end;
      });
    }

    if (updatedValues.status) {
      console.log("Setting up Status Filters");

      setFilters({ ...filters, status: true });
      results = results.filter(
        (item) => capitalize(item.status) === updatedValues.status
      );
    }

    if (updatedValues.amount) {
      setFilters({ ...filters, amount: true });
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

    if (!checked) {
      // Uncheck the filter and reset its value
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: false,
      }));

      setFilterValues((prevValues) => {
        const updatedValues = {
          ...prevValues,
          [name]: name === "date" ? { start: "", end: "" } : false, // Reset filter value
        };
        applyFilters(event, updatedValues); // Apply filters with updated values
        return updatedValues;
      });
    } else {
      // Check the filter without modifying the values yet
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: true,
      }));
    }
  };

  const handleFilterValueChange = (e) => {
    const { name, value } = e.target;

    const splitted = name.split(".");

    if (splitted.length <= 1) {
      return setFilterValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }

    setFilterValues((prevValues) => {
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
        filterChecked={filters.date}
        filterValues={filterValues}
        toggleFiltersDisplay={toggleFiltersDisplay}
        handleFiltersChecked={handleFiltersChecked}
        handleFilterValueChange={handleFilterValueChange}
        applyFilters={applyFilters}
      />

      <StatusFilter
        isOpen={openFilters.status}
        filterChecked={filters.status}
        filterValues={filterValues}
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
        filterChecked={filters.amount}
        filterValues={filterValues}
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
  filterValues,
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
          value={filterValues.amount}
          onChange={handleFilterValueChange}
          placeholder="Enter Amount"
        />
        <button
          className={`px-4 py-2 text-white bg-purple-100 rounded-medium mt-3`}
          onClick={(event) => applyFilters(event, filterValues)}
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
  filterValues: any;
  toggleFiltersDisplay: any;
  handleFiltersChecked: any;
  handleFilterValueChange: any;
  applyFilters: any;
  statusList: { label: string; value: string }[];
}

const StatusFilter = ({
  isOpen,
  filterChecked,
  filterValues,
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
              applyFilters(event, { ...filterValues, status: option.value });
            }}
            className={`p-3 cursor-pointer border-b ${
              index == 0
                ? "rounded-t-md"
                : index == statusList?.length - 1 && "rounded-b-md !border-b-0"
            } ${
              filterValues?.status === option.value
                ? "bg-light-purple text-purple-100 font-medium"
                : "hover:bg-light-purple hover:text-black-100"
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
  filterValues,
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
          value={filterValues.date.start}
          date={filterValues.date.start}
          handleChange={(date) =>
            handleFilterValueChange({
              target: { name: "date.start", value: date },
            })
          }
        />
        <DateField
          name="date.end"
          value={filterValues.date.end}
          date={filterValues.date.end}
          handleChange={(date) =>
            handleFilterValueChange({
              target: { name: "date.end", value: date },
            })
          }
        />
        <button
          className={`px-4 py-2 text-white bg-purple-100 rounded-medium mt-3`}
          onClick={(event) => applyFilters(event, filterValues)}
        >
          Apply
        </button>
      </div>
    )}
  </div>
);

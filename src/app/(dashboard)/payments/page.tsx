"use client";
import React, { useEffect, useState } from "react";
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
import { log } from "console";

const unpaidStatuses = ["Pending", "Cancel", "New"];

export const paymentsList_table_columns = [
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
      return <PaymentStatusChip status={value} />;
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
      <h3 className="text-h3 font-semibold text-blackGrey-100 mb-8">
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
          />
        </LoadingApi>
        <ErrorApiText error={isPaymentError} />
      </div>
    </>
  );
};

export default Payments;

const PaymentStatusChip = ({ status }) => {
  let statusColor: string, statusBg: string;

  if (capitalize(status) == "New") {
    statusColor = "red";
    statusBg = "bg-light-gray";
  }
  if (capitalize(status) == "Pending") {
    statusColor = "red";
    statusBg = "bg-light-gray";
  }
  if (capitalize(status) == "Cancel") {
    statusColor = "text-red-chip";
    statusBg = "bg-chip-red";
  }
  if (capitalize(status) == "Complete") {
    statusColor = "text-green-chip";
    statusBg = "bg-chip-green";
  }

  if (capitalize(status) == "Overpay") {
    statusColor = "text-blue-chip";
    statusBg = "bg-chip-blue";
  }

  if (capitalize(status) == "Incomplete") {
    statusColor = "red";
    statusBg = "bg-light-gray";
  }

  return (
    <p
      className={`${statusColor} ${statusBg}  p-2 min-w-20 max-w-24 text-center text-[14px] font-semibold px-3 rounded-medium`}
    >
      {capitalize(status)}
    </p>
  );
};

const Filters = ({ data, setData }) => {
  console.log(data);

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

  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");

  const applyFilters = () => {
    let results = data;

    if (filters.date && dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      results = results.filter((item) => {
        const itemDate = new Date(item.created_at);
        return itemDate >= start && itemDate <= end;
      });
    }

    console.log(filters, statusFilter);

    if (filters.status && statusFilter) {
      results = results.filter(
        (item) => capitalize(item.status) === statusFilter
      );
    }

    if (filters.amount && amountFilter) {
      results = results.filter(
        (item) => parseFloat(item.requested_amount) === parseFloat(amountFilter)
      );
    }

    setData(results);
  };

  const toggleFilters = (name) => {
    setOpenFilters({ [name]: true });
  };

  return (
    <div className="p-2 bg-white rounded-medium shadow absolute right-2 top-14 min-w-60">
      <div
        onClick={() => toggleFilters("date")}
        className="flex gap-1 relative items-center justify-between custom-checkbox p-3 hover:bg-light-blue rounded-t-small border-b border-slate-200"
      >
        <div className="flex items-center relative">
          <label className="custom-checkbox">
            <input
              type="checkbox"
              checked={filters.date}
              onChange={() => setFilters({ ...filters, date: !filters.date })}
            />
            <span className="checkmark"></span>
            <span className="ml-8 text-[18px]">Date</span>
          </label>
        </div>
        <KeyboardArrowRight />
        {openFilters.date && (
          <div className="bg-white absolute p-2 rounded-medium -left-full flex flex-col min-w-52 ">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
            />
            <button
              className="px-4 py-2 text-white bg-purple-500 rounded"
              onClick={applyFilters}
            >
              Apply
            </button>
          </div>
        )}
      </div>
      <div
        onClick={() => toggleFilters("status")}
        className="flex gap-1 items-center justify-between custom-checkbox p-3 hover:bg-light-blue border-b border-slate-200"
      >
        <div className="flex items-center relative">
          <label className="custom-checkbox">
            <input
              type="checkbox"
              checked={filters.status}
              onChange={() =>
                setFilters({ ...filters, status: !filters.status })
              }
            />
            <span className="checkmark"></span>
            <span className="ml-8 text-[18px]">Status</span>
          </label>
        </div>
        <KeyboardArrowRight />
        {openFilters.status && (
          <div className="bg-white absolute p-2 rounded-medium -left-full flex flex-col min-w-52 ">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Cancel">Cancel</option>
              <option value="Complete">Complete</option>
              <option value="Overpay">Overpay</option>
            </select>
            <button
              className="px-4 py-2 mt-2 text-white bg-purple-500 rounded"
              onClick={applyFilters}
            >
              Apply
            </button>
          </div>
        )}
      </div>
      <div
        onClick={() => toggleFilters("amount")}
        className="flex gap-1 items-center justify-between custom-checkbox p-3 hover:bg-light-blue rounded-b-small"
      >
        <div className="flex items-center relative">
          <label className="custom-checkbox">
            <input type="checkbox" />
            <span className="checkmark"></span>
            <span className="ml-8 text-[18px]">Amount</span>
          </label>
        </div>
        <KeyboardArrowRight />{" "}
        {openFilters.amount && (
          <div className="bg-white absolute p-2 rounded-medium -left-16">
            <input
              type="number"
              value={amountFilter}
              onChange={(e) => setAmountFilter(e.target.value)}
              placeholder="Enter Amount"
            />
            <button
              className="px-4 py-2 text-white bg-purple-500 rounded"
              onClick={applyFilters}
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const DateFilter = () => (
  <div>
    <input type="date" className="p-2 border rounded" />
  </div>
);

const StatusFilter = () => (
  <div className="flex flex-col">
    <button className="text-sm text-purple-500">Cancel</button>
    <button className="text-sm text-purple-500">Complete</button>
    <button className="text-sm text-purple-500">Overpay</button>
  </div>
);

const AmountFilter = () => (
  <div>
    <input
      type="number"
      placeholder="Enter Amount"
      className="p-2 border rounded"
    />
  </div>
);

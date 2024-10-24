import React, { useState, useEffect, useRef } from "react";
import FilterDropdown from "./FilterDropdown";
import {
  ArrowUpward,
  ArrowDownward,
  Search,
  Tune,
  NavigateNext,
  LastPage,
  NavigateBefore,
  FirstPage,
  Add,
  ContentCopy,
} from "@mui/icons-material"; // Import MUI icons
import LoaderButton from "../LoaderButton";
import IconField from "../IconField";
import IconButton from "../IconButton";
import LoadingApi from "../LoadindApi";
import Loader from "../Loader";
import RenderRoleBased from "../RenderRoleBased";
import { Role } from "@/constants/roles";
import useLocalStorage from "@/hooks/useLocalStorage";
import { TableColumns } from "@/constants/types";

interface TableProps {
  columns: TableColumns;
  rows: any[];
  initialPageSize?: number;
  equalColumns?: boolean;
  rowClickHandler?: (row: object) => void;
  csv?: { loading: boolean; error?: string | boolean; handler: () => void };
  pdf?: { loading: boolean; error?: string | boolean; handler: () => void };
  Filters?: any;
  actions?: any;
  pagination?: boolean;
  columnClassName?: string;
  loading?: boolean;
  tableWrapper?: boolean;
  selectable?: boolean; // Default to false
  selectedRows?: any[] | null;
  setSelectedRows?: any;
  createHandler?: any;
}

const CustomTable = ({
  columns,
  rows,
  initialPageSize = 10,
  equalColumns,
  rowClickHandler,
  csv,
  pdf,
  Filters,
  actions,
  pagination,
  columnClassName,
  loading,
  tableWrapper = true,
  selectable,
  selectedRows,
  setSelectedRows,
  createHandler,
}: TableProps) => {
  const [filtersOpen, setFiltersOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRows, setCurrentRows] = useState(rows);
  const [sortConfig, setSortConfig] = useState(null);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [columnWidths, setColumnWidths]: any = useState();
  const [selectAll, setSelectAll] = useState(false); // Track select all checkbox state
  const tableRef = useRef(null);
  const totalPages = Math.ceil(rows?.length / pageSize);

  useEffect(() => {
    if (selectable) {
      setSelectAll(
        currentRows?.length > 0 &&
          currentRows.every((row) => selectedRows.includes(row))
      );
    }
  }, [currentRows, selectedRows, selectable]);

  const handleRowSelection = (row: any) => {
    if (selectable) {
      if (selectedRows.includes(row)) {
        setSelectedRows(selectedRows.filter((r) => r !== row));
      } else {
        setSelectedRows([...selectedRows, row]);
      }
    }
  };

  const handleSelectAll = () => {
    if (selectable) {
      if (selectAll) {
        setSelectedRows([]);
      } else {
        setSelectedRows(currentRows);
      }
      setSelectAll(!selectAll);
    }
  };

  useEffect(() => {
    if (equalColumns) {
      setColumnWidths(`${100 / columns?.length}%`);
    } else {
      setColumnWidths("auto");
    }
  }, [columns, equalColumns]);

  useEffect(() => {
    const filteredRows = searchQuery
      ? rows.filter((row) =>
          columns.some((column) =>
            row[column.field]
              .toString()
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
        )
      : rows;

    const sortedRows = sortConfig
      ? filteredRows.sort((a, b) => {
          if (sortConfig.direction === "ascending") {
            if (a[sortConfig.key] < b[sortConfig.key]) return -1;
            if (a[sortConfig.key] > b[sortConfig.key]) return 1;
          } else if (sortConfig.direction === "descending") {
            if (a[sortConfig.key] < b[sortConfig.key]) return 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return -1;
          }
          return 0;
        })
      : filteredRows;

    setCurrentRows(
      sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    );
  }, [searchQuery, rows, sortConfig, currentPage, pageSize]);

  const handleSort = (column) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === column.field &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    } else if (
      sortConfig &&
      sortConfig.key === column.field &&
      sortConfig.direction === "descending"
    ) {
      direction = "ascending"; // Toggle between ascending and descending
    }
    setSortConfig({ key: column.field, direction });
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div
      className={
        tableWrapper &&
        `rounded-medium flex flex-col justify-between md:shadow-sm sm:bg-white sm:p-6 md:p-10 ${
          pagination
            ? "min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-240px)]"
            : "pb-8 sm:pb-12"
        } `
      }
      ref={tableRef}
    >
      <div>
        {/* Table Actions defined here */}

        {!actions ? (
          <div className="flex items-center justify-between mb-6">
            <div className="left-actions flex items-center gap-3">
              {pdf?.handler && (
                <LoaderButton
                  content={"Export PDF"}
                  variant={"outlined"}
                  onClick={pdf.handler}
                  loading={pdf.loading}
                />
              )}
              {csv?.handler && rows?.length > 0 && (
                <LoaderButton
                  content={"Export CSV"}
                  variant={"outlined"}
                  onClick={csv.handler}
                  loading={csv.loading}
                />
              )}
            </div>
            <div className="right-actions flex items-center gap-3">
              <IconField
                onChange={(event) => setSearchQuery(event.target.value)}
                value={searchQuery}
                icon={Search}
                wrapperClassName="!mb-0 !w-[250px] max-w-full lg:block hidden"
                inputClassName="py-3"
              />
              <button className="bg-none bg-transparent block lg:hidden outline-0 border-0 rounded-full transition-all w-12 h-12 hover:bg-white hover:shadow-md p-3">
                <Search />
              </button>
              <div className="relative filterBtn">
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="bg-none bg-transparent outline-0 border-0 rounded-full transition-all w-12 h-12 hover:bg-white hover:shadow-md p-3"
                >
                  <Tune />
                </button>

                {Filters && (
                  <Filters
                    data={rows}
                    setData={setCurrentRows}
                    isOpen={filtersOpen}
                    setIsOpen={setFiltersOpen}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          actions
        )}
        <div
          className={`overflow-x-auto ${
            pagination && "min-h-[calc(100vh-350px)]"
          } sm:min-h-max bg-white p-3 sm:p-0 rounded-medium sm:rounded-none shadow-sm sm:shadow-none`}
        >
          <table className="w-full text-caption sm:text-p16">
            {/* Table Headers Below */}
            <thead className="text-gray-700 font-medium bg-table-header">
              <tr>
                {selectable && (
                  <th className="py-3 px-6 text-left">
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                      <span className="checkmark !static block"></span>
                    </label>
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.field}
                    style={{ width: equalColumns ? columnWidths : "auto" }}
                    className={`py-3 px-6 cursor-pointer text-left ${columnClassName} text-nowrap overflow-hidden text-ellipsis`}
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-nowrap text-ellipsis overflow-hidden">
                        {column.headerName}
                      </span>

                      {sortConfig?.key === column.field && (
                        <span className="ml-2">
                          {sortConfig.direction === "ascending" ? (
                            <ArrowUpward />
                          ) : (
                            <ArrowDownward />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Rows Mapped Below */}

            <tbody className="capitalize">
              {currentRows.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => rowClickHandler && rowClickHandler(row)}
                  className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                >
                  {selectable && (
                    <td className="py-4 px-6">
                      <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row)}
                          onChange={() => handleRowSelection(row)}
                        />
                        <span className="checkmark !static block"></span>
                      </label>
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.field}
                      className={`${
                        column.dataValidator ? "py-4" : "py-6"
                      } px-6 font-semibold ${columnClassName} text-nowrap overflow-hidden text-ellipsis`}
                    >
                      {column.dataValidator ? (
                        <CopyButtonColumn
                          value={column.dataValidator(row[column.field], row)}
                          copyable={column.copyable}
                        />
                      ) : row[column.field] ? (
                        <CopyButtonColumn
                          value={row[column.field]}
                          copyable={column.copyable}
                        />
                      ) : (
                        "_"
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {loading && (
            <Loader bg wrapperClassName="w-full flex justify-center my-8" />
          )}
          {!loading && currentRows?.length < 1 && (
            <div className="bg-white border-b p-4 text-custom-title-gray  font-semibold text-p120 text-center ">
              No Data!!
            </div>
          )}
        </div>
      </div>
      {pagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChangePage={handleChangePage}
          pageSize={pageSize}
          createHandler={createHandler}
          setPageSize={setPageSize}
        />
      )}
    </div>
  );
};

const CopyButtonColumn = ({
  value,
  copyable,
}: {
  value: string;
  copyable: boolean;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text: string) => async (event) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 1000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap max-w-max">
        {isCopied ? "Copied" : value}
      </span>
      {copyable && (
        <button
          onClick={copyToClipboard(value)}
          className="bg-transparent border-0 outline-0 text-[14px] hover:bg-purple-10 active:bg-purple-20 transition-all w-8 h-8 aspect-square rounded-full p-1 flex-shrink-0"
        >
          <ContentCopy className="text-[12px]" />
        </button>
      )}
    </div>
  );
};


const Pagination = ({
  currentPage,
  totalPages,
  onChangePage,
  pageSize,
  setPageSize,
  createHandler,
}) => {
  const user = useLocalStorage("user");
  return (
    <div className="flex justify-center sm:justify-between items-center mt-4 relative">
      {/* Pages Indicator */}
      <span className="text-sm text-blackGrey-50 min-w-20 font-medium hidden sm:block">{`${
        (currentPage - 1) * pageSize + 1
      } - ${currentPage * pageSize} of ${totalPages * pageSize}`}</span>

      {/* Pages Navigation */}
      <div className="relative w-full">
        <div className="flex space-x-2 w-fit mx-auto bg-white p-2 rounded-sm shadow-sm sm:shadow-none sm:p-0">
          <IconButton
            className={
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-blue-500 hover:text-white"
            }
            onClick={() => onChangePage(1)}
            disabled={currentPage === 1}
          >
            <FirstPage />
          </IconButton>
          <IconButton
            className={
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-blue-500 hover:text-white"
            }
            onClick={() => onChangePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <NavigateBefore />
          </IconButton>
          {Array.from({ length: totalPages }, (_, i) => (
            <IconButton
              key={i + 1}
              className={
                currentPage === i + 1 &&
                "text-black-100 font-bold bg-light-gray"
              }
              onClick={() => onChangePage(i + 1)}
            >
              {i + 1}
            </IconButton>
          ))}
          <IconButton
            className={
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-blue-500 hover:text-white"
            }
            onClick={() => onChangePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <NavigateNext />
          </IconButton>
          <IconButton
            className={
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-blue-500 hover:text-white"
            }
            onClick={() => onChangePage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <LastPage />
          </IconButton>
        </div>
        {createHandler && (
          <RenderRoleBased allowedRoles={[Role.USER]} user={user}>
            <LoaderButton
              content={<Add className="!text-h2" />}
              className="!p-1 !rounded-full !w-fit absolute -top-8 right-4  sm:hidden"
              variant="contained"
              onClick={createHandler}
            />
          </RenderRoleBased>
        )}
      </div>

      {/* Page Change Dropdown below */}

      <div className="hidden sm:block">
        <label htmlFor="page-size" className="text-sm mr-2 text-blackGrey-50">
          Page Size
        </label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(e) => setPageSize(parseInt(e.target.value))}
          className="p-1 border-b cursor-pointer outline-none"
        >
          {[5, 10, 20, 30, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      {createHandler && (
        <RenderRoleBased allowedRoles={[Role.USER]} user={user}>
          <LoaderButton
            content={<Add className="!text-h2" />}
            className="!p-1 !rounded-full !w-fit absolute -top-10 right-2 hidden sm:block md:hidden"
            variant="contained"
            onClick={createHandler}
          />
        </RenderRoleBased>
      )}
    </div>
  );
};

export default CustomTable;

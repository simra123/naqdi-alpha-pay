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
} from "@mui/icons-material"; // Import MUI icons
import LoaderButton from "../LoaderButton";
import IconField from "../IconField";
import IconButton from "../IconButton";

interface TableProps {
  columns: any[];
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
}: TableProps) => {
  const [filtersOpen, setFiltersOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRows, setCurrentRows] = useState(rows);
  const [sortConfig, setSortConfig] = useState(null);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [columnWidths, setColumnWidths]: any = useState();
  const tableRef = useRef(null);
  const totalPages = Math.ceil(rows.length / pageSize);

  useEffect(() => {
    if (equalColumns) {
      setColumnWidths(`${100 / columns.length}%`);
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
      className={`rounded-medium flex flex-col justify-between md:shadow-sm sm:bg-white sm:p-6 md:p-10 ${
        pagination ? "min-h-[calc(100vh-240px)]" : "pb-8 sm:pb-12"
      } `}
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
              {csv?.handler && (
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
              <button
                onClick={() => console.log("searching")}
                className="bg-none bg-transparent block lg:hidden outline-0 border-0 rounded-full transition-all w-12 h-12 hover:bg-white hover:shadow-md p-3"
              >
                <Search />
              </button>
              <div className="relative">
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
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          actions
        )}
        <div className="overflow-x-auto bg-white p-3 sm:p-0 rounded-medium sm:rounded-none shadow-sm sm:shadow-none">
          <table className="w-full text-caption sm:text-p16">
            {/* Table Headers Below */}
            <thead className="text-gray-700 font-medium bg-table-header">
              <tr>
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
            <tbody>
              {currentRows.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => rowClickHandler && rowClickHandler(row)}
                  className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                >
                  {columns.map((column) => (
                    <td
                      key={column.field}
                      className={`${
                        column.dataValidator ? "py-4" : "py-6"
                      } px-6 font-semibold ${columnClassName} text-nowrap overflow-hidden text-ellipsis`}
                    >
                      {column.dataValidator
                        ? column.dataValidator(row[column.field], row)
                        : row[column.field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
          setPageSize={setPageSize}
        />
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
}) => {
  return (
    <div className="flex justify-center sm:justify-between items-center mt-4">
      <span className="text-sm text-blackGrey-50 min-w-20 font-medium hidden sm:block">{`${
        (currentPage - 1) * pageSize + 1
      } - ${currentPage * pageSize} of ${totalPages * pageSize}`}</span>

      <div className="flex space-x-2 bg-white p-2 rounded-sm shadow-sm sm:shadow-none sm:p-0">
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
              currentPage === i + 1 && "text-black-100 font-bold bg-light-gray"
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
    </div>
  );
};

export default CustomTable;

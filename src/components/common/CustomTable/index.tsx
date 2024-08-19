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
}

const CustomTable = ({
  columns,
  rows,
  initialPageSize = 10,
  equalColumns = true,
  rowClickHandler,
  csv,
  pdf,
  Filters,
}: TableProps) => {
  const [filtersOpen, setFiltersOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRows, setCurrentRows] = useState(rows);
  const [sortConfig, setSortConfig] = useState(null);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [columnWidths, setColumnWidths] = useState([]);
  const tableRef = useRef(null);
  const totalPages = Math.ceil(rows.length / pageSize);

  useEffect(() => {
    if (equalColumns) {
      const tableWidth = tableRef.current?.offsetWidth - 50 || 0;
      setColumnWidths(columns.map(() => tableWidth / columns.length));
      // setColumnWidths(columns.map(() => `${100 / columns.length}%`));
    } else {
      setColumnWidths(columns.map(() => "auto"));
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

  const handleMouseDown = (index, e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = columnWidths[index];

    const handleMouseMove = (e) => {
      const newWidth = Math.max(startWidth + (e.clientX - startX), 50); // Minimum width
      setColumnWidths((prev) =>
        prev.map((width, i) => (i === index ? newWidth : width))
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className="rounded-medium flex flex-col justify-between bg-white p-6 min-h-[calc(100vh-240px)]"
      ref={tableRef}
    >
      <div>
        {/* Table Actions defined here */}

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
              wrapperClassName="!mb-0 !w-[250px] max-w-full"
              inputClassName="py-3"
            />
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

        <div>
          {/* Table Headers Below */}

          <div className="text-gray-700 font-medium  bg-table-header flex w-full">
            {columns.map((column, index) => (
              <div
                key={column.field}
                className="flex items-center"
                style={{ width: columnWidths[index] }}
              >
                <div
                  className="flex-1 py-3 px-6 flex  items-center cursor-pointer text-nowrap text-ellipsis overflow-hidden"
                  onClick={() => handleSort(column)}
                >
                  <span className="text-nowrap text-ellipsis overflow-hidden">
                    {column.headerName}
                  </span>

                  {sortConfig?.key === column.field && (
                    <span className="flex items-center ml-2">
                      {sortConfig.direction === "ascending" ? (
                        <ArrowUpward />
                      ) : (
                        <ArrowDownward />
                      )}
                    </span>
                  )}
                </div>

                <div
                  className="resize-handle cursor-col-resize"
                  onMouseDown={(e) => handleMouseDown(index, e)}
                  style={{ height: "100%", width: "5px", cursor: "col-resize" }}
                />
              </div>
            ))}
          </div>

          {/* Rows Mapped Below */}
          <div>
            {currentRows.map((row, index) => (
              // Row Div
              <div
                key={index}
                onClick={() => rowClickHandler(row)}
                className="bg-white border-b hover:bg-gray-50 flex cursor-pointer"
              >
                {/* Mapping Columns inside rows */}
                {columns.map((column, colIndex) => (
                  <div
                    key={column.field}
                    className={`${
                      column.dataValidator ? "py-4" : "py-6"
                    } px-6 font-semibold text-nowrap text-ellipsis overflow-hidden`}
                    style={{ width: columnWidths[colIndex] }}
                  >
                    {column.dataValidator
                      ? column.dataValidator(row[column.field])
                      : row[column.field]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChangePage={handleChangePage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
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
    <div className="flex justify-between items-center mt-4">
      <span className="text-sm text-blackGrey-50 min-w-20 font-medium">{`${
        (currentPage - 1) * pageSize + 1
      } - ${currentPage * pageSize} of ${totalPages * pageSize}`}</span>

      <div className="flex space-x-2">
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

      <div>
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

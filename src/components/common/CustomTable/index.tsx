import React, { useState, useEffect, useRef, useMemo } from "react";
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
} from "@mui/icons-material"; // Import MUI icons
import { MdCopyAll } from "react-icons/md";
import LoaderButton from "../LoaderButton";
import IconField from "../IconField";
import IconButton from "../IconButton";
import LoadingApi from "../LoadindApi";
import Loader from "../Loader";
import RenderRoleBased from "../RenderRoleBased";
import { Role } from "@/constants/roles";
import useLocalStorage from "@/hooks/useLocalStorage";
import { TableColumns } from "@/constants/types";
import { getNestedValue } from "./utils";
import Link from "next/link";

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
  const scrollContainerRef = useRef(null); // Add this for the scrollable div
  const [isHovered, setIsHovered] = useState(false); // Track mouse hover

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
        columns.some((column) => {
          const value = getNestedValue(row, column.field);
          return value
            ?.toString()
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase().trim());
        })
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!scrollContainerRef.current || !isHovered) return;

      const scrollAmount = 100; // Customize this
      if (e.key === "ArrowRight") {
        scrollContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      } else if (e.key === "ArrowLeft") {
        scrollContainerRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHovered]);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div
      className={
        tableWrapper &&
        `rounded-medium flex flex-col justify-between md:shadow-sm ${
          pagination
            ? "min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-240px)]"
            : "pb-8 sm:pb-0"
        } `
      }
      ref={tableRef}
    >
      <div>
        {/* Table Actions defined here */}

        {!actions ? (
          <div className="flex justify-between items-center mb-6">
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
              <button className="lg:hidden block bg-transparent hover:bg-white bg-none hover:shadow-md p-3 border-0 rounded-full outline-0 w-12 h-12 transition-all">
                <Search />
              </button>
            </div>
          </div>
        ) : (
          actions
        )}
        <div
          ref={scrollContainerRef}
          className={`overflow-x-auto ${
            pagination && "min-h-[calc(100vh-350px)]"
          } sm:min-h-max bg-white p-3 sm:p-0 rounded-medium sm:rounded-none shadow-sm sm:shadow-none`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <table className="w-full text-caption sm:text-p16">
            {/* Table Headers Below */}
            <thead className="bg-table-header font-medium text-gray-700">
              <tr>
                {selectable && (
                  <th className="px-6 py-3 text-left">
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                      <span className="block !static checkmark"></span>
                    </label>
                  </th>
                )}
                {columns.map((column, index) => (
                  <th
                    key={column.field + index}
                    style={{ width: equalColumns ? columnWidths : "auto" }}
                    className={`py-3 px-6 cursor-pointer text-left ${columnClassName} text-nowrap overflow-hidden text-ellipsis`}
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="overflow-hidden text-ellipsis text-nowrap">
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
                  className="bg-white hover:bg-gray-50 border-b cursor-pointer"
                >
                  {selectable && (
                    <td className="px-6 py-4">
                      <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row)}
                          onChange={() => handleRowSelection(row)}
                        />
                        <span className="block !static checkmark"></span>
                      </label>
                    </td>
                  )}
                  {columns.map((column, index) => {
                    const value = getNestedValue(row, column.field);
                    return (
                      <td
                        key={column.field + index}
                        className={`${
                          column.dataValidator ? "py-4" : "py-6"
                        } px-6 font-semibold ${columnClassName} text-nowrap overflow-hidden text-ellipsis`}
                      >
                        {column.dataValidator ? (
                          <CopyButtonColumn
                            value={column.dataValidator(value, row)}
                            copyable={column.copyable}
                            link={column?.link ? column?.link(row) : null}
                            target={column?.target}
                          />
                        ) : value ? (
                          <CopyButtonColumn
                            value={value}
                            copyable={column.copyable}
                            link={column?.link ? column?.link(row) : null}
                            target={column?.target}
                          />
                        ) : (
                          "_"
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {loading && (
            <Loader bg wrapperClassName="w-full flex justify-center my-8" />
          )}
          {!loading && currentRows?.length < 1 && (
            <div className="bg-white p-4 border-b font-semibold text-custom-title-gray text-p120 text-center">
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
  link,
  target,
}: {
  value: string;
  copyable: boolean;
  link: string;
  target: string;
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
      {link ? (
        <Link
          onClick={(event) => event.stopPropagation()}
          href={link}
          target={target || "_blank"}
          className="overflow-hidden font-semibold text-black-100 hover:text-blue-700 hover:underline text-ellipsis capitalize transition-all"
        >
          {isCopied ? "Copied" : value}
        </Link>
      ) : (
        <span className="flex-grow max-w-max overflow-hidden text-ellipsis whitespace-nowrap">
          {isCopied ? "Copied" : value}
        </span>
      )}
      {copyable && (
        <button
          onClick={copyToClipboard(value)}
          className="flex flex-shrink-0 justify-center items-center bg-transparent hover:bg-purple-10 active:bg-purple-20 p-1 border-0 rounded-full outline-0 w-8 h-8 aspect-square text-[14px] transition-all"
        >
          <MdCopyAll className="text-[16px]" />
        </button>
      )}
    </div>
  );
};

const getPaginationPages = (
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1
): (number | string)[] => {
  // Ensure totalPages and currentPage are valid
  if (totalPages <= 0 || currentPage < 1 || currentPage > totalPages) return [];

  const totalPageNumbers = siblingCount * 2 + 3; // 5 includes current, first, last, and 2 ellipses
  const pages: (number | string)[] = [];

  if (totalPages <= totalPageNumbers) {
    // Show all pages if total pages fit within the range
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (showLeftEllipsis) {
    pages.push("..."); // Left ellipsis
  }

  // Add middle pages
  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    pages.push(i);
  }

  if (showRightEllipsis) {
    pages.push("..."); // Right ellipsis
  }
  if (!pages?.includes(1)) {
    pages?.unshift(1);
  }

  // Add the last page
  if (!pages?.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
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

  const pages = useMemo(
    () => getPaginationPages(currentPage, totalPages),
    [currentPage, pageSize, totalPages]
  );

  return (
    <div className="relative flex justify-center sm:justify-between items-center mt-4">
      {/* Pages Indicator */}
      <span className="hidden sm:block min-w-20 font-medium text-blackGrey-50 text-sm">{`${
        (currentPage - 1) * pageSize + 1
      } - ${currentPage * pageSize} of ${totalPages * pageSize}`}</span>

      {/* Pages Navigation */}
      <div className="relative w-full">
        <div className="flex space-x-2 bg-white mx-auto p-2 sm:p-0 rounded-sm w-fit">
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
          {pages.map((item, index) =>
            item == "..." ? (
              <span key={index}>...</span>
            ) : (
              <IconButton
                key={index}
                className={
                  currentPage === item &&
                  "text-black-100 font-bold bg-light-gray"
                }
                onClick={() => onChangePage(item)}
              >
                {item}
              </IconButton>
            )
          )}
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
              className="sm:hidden -top-8 right-4 absolute !p-1 !rounded-full !w-fit"
              variant="contained"
              onClick={createHandler}
            />
          </RenderRoleBased>
        )}
      </div>

      {/* Page Change Dropdown below */}

      <div className="hidden sm:block">
        <label htmlFor="page-size" className="mr-2 text-blackGrey-50 text-sm">
          Page Size
        </label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(e) => {
            setPageSize(parseInt(e.target.value));
            onChangePage(1);
          }}
          className="p-1 border-b outline-none cursor-pointer"
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
            className="hidden md:hidden sm:block -top-10 right-2 absolute !p-1 !rounded-full !w-fit"
            variant="contained"
            onClick={createHandler}
          />
        </RenderRoleBased>
      )}
    </div>
  );
};

export default CustomTable;

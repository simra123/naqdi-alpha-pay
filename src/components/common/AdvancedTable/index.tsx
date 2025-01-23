"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { TableColumns } from "@/constants/types";
import LoaderButton from "../LoaderButton";
import IconField from "../IconField";
import { SearchbarIcon } from "@/assets/Svgs";
import { MdTune } from "react-icons/md";
import RenderRoleBased from "../RenderRoleBased";
import { Role } from "@/constants/roles";
import {
  Add,
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
} from "@mui/icons-material";
import IconButton from "../IconButton";
import useLocalStorage from "@/hooks/useLocalStorage";

interface AdvancedTableProps {
  columns: TableColumns;
  rows: any[];
  selectable?: boolean;
  onSort: (headerName: string) => void;
  onSearch: (field: string, searchValue: string) => void;
  pagination?: boolean;
}

const AdvancedTable = ({
  columns,
  rows,
  selectable,
  onSort,
  onSearch,
  pagination,
}: AdvancedTableProps) => {
  const headerRef = useRef<HTMLTableRowElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const [stickyOffsets, setStickyOffsets] = useState<{ [key: string]: number }>(
    {}
  );

  useEffect(() => {
    if (headerRef.current) {
      const widths = Array.from(headerRef.current.children).map(
        (cell) => (cell as HTMLElement).getBoundingClientRect().width
      );
      setColumnWidths(widths);

      const offsets: { [key: string]: number } = {};
      let cumulativeOffset = 0;

      // Iterate through columns and calculate offsets for sticky columns
      columns.forEach((column, index) => {
        if (column.sticky) {
          // Use the exact width from getBoundingClientRect()
          const columnWidth = widths[index];

          // Set the left position for the sticky column
          offsets[column.id] = cumulativeOffset;

          // Update the cumulative offset for the next sticky column
          cumulativeOffset += index == 0 ? columnWidth : columnWidth - 1;
        } else {
          offsets[column.id] = null; // Non-sticky columns have no offset
        }
      });

      setStickyOffsets(offsets);
    }
  }, [headerRef, columns, rows]);

  console.log({ columnWidths, stickyOffsets });

  const handleRowSelection = (row: any) => {
    const updatedSelection = selectedRows.includes(row)
      ? selectedRows.filter((r) => r !== row)
      : [...selectedRows, row];
    setSelectedRows(updatedSelection);
  };

  const handleSelectAll = () => {
    setSelectedRows(selectedRows.length === rows.length ? [] : [...rows]);
  };

  return (
    <div
      className={`flex flex-col justify-between ${
        pagination
          ? "min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-240px)]"
          : "pb-8 sm:pb-0"
      } `}
    >
      <div>
        {/* Table Actions defined here */}

        <div className="flex items-center justify-between mb-6">
          <div className="left-actions flex items-center gap-3">
            <LoaderButton content={"Export PDF"} variant={"outlined"} />

            <LoaderButton content={"Export CSV"} variant={"outlined"} />
          </div>
          <div className="right-actions flex items-center gap-3">
            <IconField
              onChange={(event) => console.log(event.target.value)}
              value={""}
              icon={SearchbarIcon}
              wrapperClassName="!mb-0 !w-[250px] max-w-full lg:block hidden"
              inputClassName="py-3"
            />
            <button className="bg-none bg-transparent block lg:hidden outline-0 border-0 rounded-full transition-all w-12 h-12 hover:bg-white hover:shadow-md p-3">
              <SearchbarIcon className="" />
            </button>
            <div className="relative filterBtn">
              <button className="bg-none bg-transparent outline-0 border-0 rounded-full transition-all w-12 h-12 hover:bg-white hover:shadow-md p-3">
                <MdTune />
              </button>
            </div>
          </div>
        </div>

        <div
          className={`overflow-x-auto pr-96 ${
            pagination && "min-h-[calc(100vh-350px)]"
          } sm:min-h-max bg-white p-3 sm:p-0 rounded-medium sm:rounded-none shadow-sm sm:shadow-none`}
        >
          <table className="min-w-full">
            {/* Render Table Header */}
            <TableHeader
              columns={columns}
              ref={headerRef}
              columnWidths={columnWidths}
              stickyOffsets={stickyOffsets}
              selectable={selectable}
              selectAll={selectable && selectedRows.length === rows.length}
              onSelectAll={handleSelectAll}
              onSort={onSort}
              onSearch={onSearch}
            />

            {/* Render Table Rows */}
            <tbody>
              {rows.map((row, index) => (
                <TableRow
                  key={index}
                  stickyOffsets={stickyOffsets}
                  columnWidths={columnWidths}
                  row={row}
                  columns={columns}
                  selectable={selectable}
                  isSelected={selectedRows.includes(row)}
                  onRowSelection={handleRowSelection}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {pagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={2}
          onChangePage={() => {}}
          pageSize={pageSize}
          createHandler={() => {}}
          setPageSize={setPageSize}
        />
      )}
    </div>
  );
};

export default AdvancedTable;

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
    console.log("Show all pages if total pages fit within the range");
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

  console.log({
    leftSiblingIndex,
    rightSiblingIndex,
    showLeftEllipsis,
    showRightEllipsis,
  });

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

  console.log({ pages });
  return (
    <div className="flex justify-center sm:justify-between items-center mt-4 relative">
      {/* Pages Indicator */}
      <span className="text-sm text-blackGrey-50 min-w-20 font-medium hidden sm:block">{`${
        (currentPage - 1) * pageSize + 1
      } - ${currentPage * pageSize} of ${totalPages * pageSize}`}</span>

      {/* Pages Navigation */}
      <div className="relative w-full">
        <div className="flex space-x-2 w-fit mx-auto bg-white p-2 rounded-sm sm:p-0">
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
          {pages.map((item) =>
            item == "..." ? (
              <span>...</span>
            ) : (
              <IconButton
                key={item}
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
          onChange={(e) => {
            setPageSize(parseInt(e.target.value));
            onChangePage(1);
          }}
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

// File: components/table/CustomTable.tsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import TableActions from "./TableActions";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import Pagination from "./Pagination";
import { getNestedValue, sortData } from "./utils";
import { useCSVDownloader } from "@/hooks/useCSVDownloader";
import Loader from "../Loader";
import ErrorApiText from "../ErrorApiText";

import type { TableColumns } from "@/constants/types";
import LoadingApi from "../LoadindApi";

interface TableProps {
  columns: TableColumns;
  rows: any[];
  csvData?: any[];
  initialPageSize?: number;
  equalColumns?: boolean;
  rowClickHandler?: (row: object) => void;
  csv?: boolean;
  tableName?: string;
  pdf?: { loading: boolean; error?: string | boolean; handler: () => void };
  Filters?: any;
  actions?: any;
  pagination?: boolean;
  serverSidePagination?: boolean;
  totalItems?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  columnClassName?: string;
  loading?: boolean;
  tableWrapper?: boolean;
  selectable?: boolean;
  selectedRows?: any[];
  setSelectedRows?: any;
  createHandler?: any;
  tableClassName?: string;
  tableWrapperClassName?: string;
  expandRowIDKey?: string;
  ExpandComponent?: any;
}

const CustomTableV2 = ({
  columns,
  rows,
  csvData,
  initialPageSize = 10,
  equalColumns,
  rowClickHandler,
  csv,
  tableName,
  pdf,
  actions,
  pagination,
  serverSidePagination,
  totalItems,
  onPageChange,
  onPageSizeChange,
  columnClassName,
  loading,
  tableWrapper = true,
  selectable,
  selectedRows = [],
  setSelectedRows,
  createHandler,
  tableClassName,
  tableWrapperClassName,
  ExpandComponent,
  expandRowIDKey,
}: TableProps) => {
  const isServerSide = serverSidePagination;

  console.log({ rows });

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortConfig, setSortConfig] = useState<any>(null);
  const [currentRows, setCurrentRows] = useState<any[]>(rows);
  const scrollContainerRef = useRef(null); // Add this for the scrollable div
  const [isHovered, setIsHovered] = useState(false); // Track mouse hover

  const { csvLoading, csvError, generateAndDownloadCSV } = useCSVDownloader();

  const totalPages = useMemo(() => {
    return isServerSide
      ? Math.ceil((totalItems || 0) / pageSize)
      : Math.ceil(
          rows &&
            rows?.length > 0 &&
            rows?.filter((row) =>
              columns.some((column) => {
                const value = getNestedValue(row, column.field);
                return value
                  ?.toString()
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase().trim());
              })
            ).length / pageSize
        );
  }, [rows, pageSize, searchQuery, totalItems, isServerSide, columns]);

  useEffect(() => {
    if (isServerSide) {
      setCurrentRows(rows);
    } else {
      let temp = rows && rows?.length > 0 ? [...rows] : [];

      if (searchQuery) {
        temp = temp?.filter((row) =>
          columns.some((column) => {
            const value = getNestedValue(row, column.field);
            return value
              ?.toString()
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase().trim());
          })
        );
      }

      if (sortConfig) {
        temp = sortData(temp, sortConfig);
      }

      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      setCurrentRows(temp.slice(start, end));
    }
  }, [
    rows,
    searchQuery,
    sortConfig,
    currentPage,
    pageSize,
    isServerSide,
    columns,
  ]);

  const handleSort = (column) => {
    let direction = "ascending";
    if (
      sortConfig?.key === column.field &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key: column.field, direction });
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
    if (isServerSide && onPageChange) onPageChange(page, pageSize);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    if (isServerSide) {
      onPageSizeChange?.(size);
    }
  };

  const handleExportCSV = () => {
    generateAndDownloadCSV(csvData || rows, `${tableName}.csv` || "data.csv");
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

  return (
    <div
      className={`rounded-medium flex flex-col justify-between ${
        pagination
          ? "min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-240px)]"
          : "pb-8 sm:pb-0"
      } ${tableWrapperClassName}`}
    >
      <div>
        <TableActions
          pdf={pdf}
          csv={csv}
          rows={rows}
          isServerSide={isServerSide}
          csvError={csvError}
          csvLoading={csvLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onExportCSV={handleExportCSV}
          actions={actions}
        />

        <div
          className={`overflow-x-auto shadow-sm ${tableClassName}`}
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <table className="w-full text-caption sm:text-p16">
            <TableHeader
              columns={columns}
              sortConfig={sortConfig}
              onSort={handleSort}
              equalColumns={equalColumns}
              columnClassName={columnClassName}
              selectable={selectable}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              currentRows={currentRows}
              ExpandComponent={ExpandComponent}
              expandRowIDKey={expandRowIDKey}
            />
            {!loading && (
              <TableBody
                rows={currentRows}
                columns={columns}
                rowClickHandler={rowClickHandler}
                columnClassName={columnClassName}
                selectable={selectable}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                ExpandComponent={ExpandComponent}
                expandRowIDKey={expandRowIDKey}
              />
            )}
          </table>
          {loading && (
            <Loader bg wrapperClassName="w-full flex justify-center my-8" />
          )}
          {!loading && currentRows?.length < 1 && (
            <div className="bg-white p-4 border-b font-semibold text-custom-title-gray text-center">
              No Data!!
            </div>
          )}
        </div>
      </div>

      {pagination && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          onChangePage={handleChangePage}
          pageSize={pageSize}
          setPageSize={handlePageSizeChange}
          createHandler={createHandler}
        />
      )}
    </div>
  );
};

export default CustomTableV2;

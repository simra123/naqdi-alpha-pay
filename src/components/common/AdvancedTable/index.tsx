"use client";
import React, { useState, useEffect, useRef } from "react";
import TableHeader from "./components/TableHeader";
import TableRow from "./components/TableRow";

import TablePagination from "./components/TablePagination";
import TableActions from "./components/TableActions";
import { ListData } from "./types";

import {
  replaceColumns,
  updateColumnSortState,
  updateFilterState,
} from "./utils";
import { useCSVDownloader } from "@/hooks/useCSVDownloader";

interface AdvancedTableProps {
  columns: ListData;
  setColumns: any;
  rows: any[];
  csvData?: any[];
  selectable?: boolean;
  pagination?: boolean;
  listConfig: any;
  totalItems: number;
  loading?: boolean;
  setListConfig: (config: any) => void;
  fetchData: (payload: any) => void;
  onRowClick?: (row: any) => void;
  tableName?: string;
}

const AdvancedTable = ({
  columns,
  rows,
  csvData,
  selectable,
  pagination,
  listConfig,
  totalItems,
  loading,
  setColumns,
  tableName,
  fetchData,
  setListConfig,
  onRowClick,
}: AdvancedTableProps) => {
  const { csvLoading, csvError, generateAndDownloadCSV } = useCSVDownloader();
  const headerRef = useRef<HTMLTableRowElement>(null);
  const scrollContainerRef = useRef(null); // Add this for the scrollable div
  const [isHovered, setIsHovered] = useState(false); // Track mouse hover
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [limit, setLimit] = useState(10);
  const [sortData, setSortData] = useState<[] | any>([]);
  const [filtersData, setFilterData] = useState<[] | any>([]);
  const [page, setPage] = useState(1);
  const [stickyOffsets, setStickyOffsets] = useState<{ [key: string]: number }>(
    {}
  );

  const onSearch = (column, event) => {
    const { value, type } = event.target;

    // Update the filter state
    let filteredColsData = updateFilterState(
      column,
      [value],
      filtersData,
      type == "date" ? "GREATER_THAN" : "CONTAINS"
    );

    setFilterData(filteredColsData);
    if (type == "date") {
      fetchData({
        sort: sortData,
        filters: filteredColsData,
        limitValue: limit,
        pageValue: 1,
      });
    }
  };

  const onFiltersApply = (filtersData, closeAfter?: boolean) => {
    setFilterData(filtersData);
    setPage(1);
    fetchData({
      pageValue: 1,
      filters: filtersData,
      limitValue: limit,
      sort: sortData,
    });
    if (closeAfter) {
      setFilterOpen(false);
    }
  };

  const onPageChange = (page) => {
    setPage(page);
    fetchData({
      sort: sortData,
      filters: filtersData,
      limitValue: limit,
      pageValue: page,
    });
  };

  const onViewsApply = (viewData) => {
    setColumns(viewData);
    let newConfig = replaceColumns(listConfig, viewData);
    setListConfig(newConfig);
    setFilterOpen(false);
  };

  const onSearchKeyDown = (event) => {
    if (event.key == "Enter") {
      fetchData({
        sort: sortData,
        filters: filtersData,
        limitValue: limit,
        pageValue: 1,
      });
    }
  };

  const onSort = (sortValues) => {
    const colsToSort = updateColumnSortState(sortValues, sortData);
    setSortData(colsToSort);

    fetchData({
      sort: colsToSort,
      filters: filtersData,
      limitValue: limit,
      pageValue: page,
    });
  };

  const onLimitChange = (limit) => {
    setLimit(limit);
    setPage(1);
    fetchData({
      sort: sortData,
      filters: filtersData,
      limitValue: limit,
      pageValue: 1,
    });
  };

  const onClearFilters = () => {
    setFilterData([]);
    setSortData([]);
    setPage(1);
    fetchData({
      filters: [],
      sort: [],
      limitValue: 10,
      pageValue: 1,
    });
  };

  const ExportCSVHandler = async () => {
    generateAndDownloadCSV(csvData || rows, `${tableName}.csv` || "data.csv");
  };

  useEffect(() => {
    if (columns) {
      if (headerRef.current) {
        const widths = Array.from(headerRef.current.children).map(
          (cell) => (cell as HTMLElement).getBoundingClientRect().width
        );
        setColumnWidths(widths);

        const offsets: { [key: string]: number } = {};
        let cumulativeOffset = 0;

        // Iterate through columns and calculate offsets for sticky columns
        columns.forEach((column, index) => {
          if (column.isSticky) {
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
    }
  }, [headerRef, columns, rows]);

  useEffect(() => {
    const handleKeyDown = (e) => {
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

        <TableActions
          onCsvExport={{
            handler: ExportCSVHandler,
            loading: csvLoading,
            error: csvError,
          }}
          onClearFilters={onClearFilters}
          filterOpen={filterOpen}
          columns={columns}
          setColumns={setColumns}
          setFilterOpen={setFilterOpen}
          listConfig={listConfig}
          onFiltersApply={onFiltersApply}
          onViewsApply={onViewsApply}
          filtersData={filtersData}
          sortData={sortData}
        />

        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`overflow-x-auto pr-96 ${
            pagination && "min-h-[calc(100vh-350px)]"
          } sm:min-h-max bg-white p-3 sm:p-0 rounded-medium sm:rounded-none shadow-sm sm:shadow-none`}
        >
          <table className="min-w-full">
            {/* Render Table Header */}
            <TableHeader
              columns={columns}
              sortData={sortData}
              filtersData={filtersData}
              ref={headerRef}
              columnWidths={columnWidths}
              stickyOffsets={stickyOffsets}
              selectable={selectable}
              selectAll={selectable && selectedRows.length === rows.length}
              onSelectAll={handleSelectAll}
              onSort={onSort}
              onSearch={onSearch}
              onSearchKeyDown={onSearchKeyDown}
            />

            {/* Render Table Rows */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns?.length} className="py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : rows?.length >= 1 ? (
                rows?.map((row, index) => (
                  <TableRow
                    key={index}
                    stickyOffsets={stickyOffsets}
                    columnWidths={columnWidths}
                    row={row}
                    columns={columns}
                    onRowClick={onRowClick}
                    selectable={selectable}
                    isSelected={selectedRows.includes(row)}
                    onRowSelection={handleRowSelection}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={columns?.length} className="py-4 text-center">
                    No Rows Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {!loading && pagination && (
        <TablePagination
          currentPage={page}
          totalPages={Math.ceil(totalItems / limit)}
          onChangePage={onPageChange}
          limit={limit}
          onLimitChange={onLimitChange}
          createHandler={() => {}}
        />
      )}
    </div>
  );
};

export default AdvancedTable;

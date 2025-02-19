"use client";
import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import TableHeader from "./components/TableHeader";
import TableRow from "./components/TableRow";
import { TableColumns } from "@/constants/types";

import TablePagination from "./components/TablePagination";
import TableActions from "./components/TableActions";
import { ListData } from "./types";
import LoadingApi from "../LoadindApi";
import Loader from "../Loader";

interface AdvancedTableProps {
  columns: ListData;
  rows: any[];
  selectable?: boolean;
  selectedRows?: any[];
  filterOpen: boolean;
  setFilterOpen: any;
  pagination?: boolean;
  dateRanges?: any;
  setDateRanges?: any;
  listConfig?: any;
  totalItems: number;
  limit?: number;
  currentPage?: number;
  sortData: [];
  filtersData: [];
  loading?: boolean;
  setColumns?: any;
  setSelectedRows?: () => void;
  onClearFilters?: () => void;
  onSort: (sortData: any) => void;
  onSearch: (column: any, event: ChangeEvent<HTMLInputElement> | any) => void;
  onSearchKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onHandleFilter?: () => void;
  onDateChange?: () => void;
  onDateEnter?: () => void;
  onRowClick?: () => void;
  onLimitChange?: (limit: number) => void;
  onPageChange?: (page: number) => void;
  onFiltersApply?: (fitlersData: any) => void;
  onViewsApply?: (viewData: any) => void;
}

const AdvancedTable = ({
  columns,
  rows,
  selectable,
  pagination,
  listConfig,
  totalItems,
  currentPage,
  limit,
  sortData,
  filtersData,
  loading,
  filterOpen,
  setFilterOpen,
  setColumns,
  onClearFilters,
  onSort,
  onSearch,
  onSearchKeyDown,
  onLimitChange,
  onPageChange,
  onFiltersApply,
  onViewsApply,
}: AdvancedTableProps) => {
  const headerRef = useRef<HTMLTableRowElement>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const [stickyOffsets, setStickyOffsets] = useState<{ [key: string]: number }>(
    {}
  );

  console.log({ columns });

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
          onCsvExport={() => {}}
          onPdfExport={() => {}}
          onClearFilters={onClearFilters}
          onRefresh={() => {}}
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
                  <td colSpan={columns?.length} className="text-center py-4">
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
                    selectable={selectable}
                    isSelected={selectedRows.includes(row)}
                    onRowSelection={handleRowSelection}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={columns?.length} className="text-center py-4">
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
          currentPage={currentPage}
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

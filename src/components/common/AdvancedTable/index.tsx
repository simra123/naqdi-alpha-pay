"use client";
import React, { useState, useEffect, useRef } from "react";
import TableHeader from "./components/TableHeader";
import TableRow from "./components/TableRow";
import { TableColumns } from "@/constants/types";

import TablePagination from "./components/TablePagination";
import TableActions from "./components/TableActions";

interface AdvancedTableProps {
  columns: TableColumns;
  rows: any[];
  selectable?: boolean;
  selectedRows?: any[];
  setSelectedRows?: () => void;
  onSort: (headerName: string) => void;
  onSearch: (field: string, searchValue: string) => void;
  onFilterOpen?: boolean;
  onFilterClose?: () => void;
  onHandleFilter?: () => void;
  pagination?: boolean;
  searchValues?: void;
  onDateChange?: () => void;
  onDateEnter?: () => void;
  dateRanges?: any;
  setDateRanges?: any;
  onRowClick?: () => void;
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
          onFilterClick={() => {}}
          onRefresh={() => {}}
          onSearch={() => {}}
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
        <TablePagination
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
